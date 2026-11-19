
import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const moodScores = {
  Sad: 1,
  Stressed: 2,
  Neutral: 3,
  Calm: 4,
  Happy: 5,
};

const allowedMoods = Object.keys(moodScores);

router.use(authenticateToken);

// GET TODAY'S MOOD
router.get("/today", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, mood_label, mood_score, note, responses, recorded_at
       FROM mood_entries
       WHERE user_id = $1
         AND (recorded_at AT TIME ZONE 'Asia/Kolkata')::date =
             (NOW() AT TIME ZONE 'Asia/Kolkata')::date
       ORDER BY recorded_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    return res.json({
      success: true,
      entry: result.rows[0] || null,
    });
  } catch (error) {
    console.error("Fetch today's mood error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve today's mood.",
    });
  }
});

// GET MOOD HISTORY
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, mood_label, mood_score, note, responses, recorded_at
       FROM mood_entries
       WHERE user_id = $1
       ORDER BY recorded_at DESC
       LIMIT 100`,
      [req.user.id]
    );

    return res.json({
      success: true,
      entries: result.rows,
    });
  } catch (error) {
    console.error("Fetch mood history error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve mood history.",
    });
  }
});

// SAVE OR UPDATE TODAY'S MOOD
router.post("/", async (req, res) => {
  const { mood, note, responses, prompts } = req.body;

  if (!allowedMoods.includes(mood)) {
    return res.status(400).json({
      success: false,
      message: "Please select a valid mood.",
    });
  }

  if (typeof note !== "string" || note.length > 3000) {
    return res.status(400).json({
      success: false,
      message: "Reflection must be text up to 3000 characters.",
    });
  }

  if (
    !responses ||
    typeof responses !== "object" ||
    Array.isArray(responses)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid daily reflection responses.",
    });
  }

  const responseEntries = Object.entries(responses);

  if (
    responseEntries.length > 10 ||
    responseEntries.some(
      ([key, value]) =>
        key.length > 100 ||
        typeof value !== "string" ||
        value.length > 1000
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Daily reflection responses are invalid or too long.",
    });
  }

  if (
    !Array.isArray(prompts) ||
    prompts.length > 10 ||
    prompts.some(
      (prompt) =>
        !prompt ||
        typeof prompt.id !== "string" ||
        typeof prompt.category !== "string" ||
        typeof prompt.question !== "string" ||
        prompt.id.length > 100 ||
        prompt.category.length > 100 ||
        prompt.question.length > 500
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Daily reflection questions are invalid.",
    });
  }

  const savedResponses = {
    answers: responses,
    prompts: prompts.map(({ id, category, question }) => ({
      id,
      category,
      question,
    })),
  };

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Serialize mood saves for this user.
    await client.query(
  "SELECT pg_advisory_xact_lock(hashtext($1::text))",
  [req.user.id]
);

    const existing = await client.query(
      `SELECT id
       FROM mood_entries
       WHERE user_id = $1
         AND (recorded_at AT TIME ZONE 'Asia/Kolkata')::date =
             (NOW() AT TIME ZONE 'Asia/Kolkata')::date
       ORDER BY recorded_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    let result;

   if (existing.rows.length > 0) {
  result = await client.query(
    `UPDATE mood_entries
     SET mood_label = $1,
         mood_score = $2,
         note = $3,
         responses = $4::jsonb,
         recorded_at = NOW()
     WHERE id = $5
     RETURNING id, mood_label, mood_score, note, responses, recorded_at`,
    [
      mood,
      moodScores[mood],
      note.trim(),
      JSON.stringify(savedResponses),
      existing.rows[0].id,
    ]
  );
} else {
  result = await client.query(
    `INSERT INTO mood_entries
       (user_id, mood_label, mood_score, note, responses)
     VALUES ($1, $2, $3, $4, $5::jsonb)
     RETURNING id, mood_label, mood_score, note, responses, recorded_at`,
    [
      req.user.id,
      mood,
      moodScores[mood],
      note.trim(),
      JSON.stringify(savedResponses),
    ]
  );
}

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Today's mood has been saved successfully.",
      entry: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Save mood error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save your mood. Please try again.",
    });
  } finally {
    client.release();
  }
});

export default router;
