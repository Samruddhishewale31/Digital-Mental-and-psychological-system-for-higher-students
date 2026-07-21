import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🌿 Emotional System Prompt
const SYSTEM_PROMPT = `
You are a deeply empathetic mental health companion for students.

Your personality:
- Talk like a close best friend
- Be warm, calm, and emotionally supportive
- Never sound robotic or like a therapist
- Use simple human language
- Keep responses natural and short

Rules:
- Always validate feelings first
- Avoid generic advice
- Respond differently each time
- Ask gentle follow-up questions
- Use soft tone like: "hey…", "hmm…", "it’s okay…"

Make the user feel heard, safe, and understood.
`;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  // 🚨 Crisis Detection
  if (
    message.toLowerCase().includes("suicide") ||
    message.toLowerCase().includes("die") ||
    message.toLowerCase().includes("kill myself")
  ) {
    return res.json({
      reply:
        "Hey… I’m really sorry you’re feeling this way 💛 You don’t have to go through this alone. Please consider talking to someone you trust or a helpline. I’m here with you."
    });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\nUser: ${message}`
              }
            ]
          }
        ]
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hmm… I’m here for you 💛 tell me more…";

    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);

    res.json({
      reply:
        "Hey… something went wrong on my side 💛 but I’m still here… try telling me again?"
    });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});