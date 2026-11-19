
import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import pool from "../config/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  sendOtpEmail,
  sendRecoveredIdEmail,
} from "../services/emailService.js";

const router = express.Router();

const COLLEGE_DOMAIN = "somaiya.edu";
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isCollegeEmail(email) {
  return /^[^\s@]+@somaiya\.edu$/.test(email);
}

function getSecret() {
  const secret = process.env.OTP_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("OTP_SECRET is not configured.");
  }

  return secret;
}

function hashEmail(email) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(normalizeEmail(email))
    .digest("hex");
}

function hashOtp(otp) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(String(otp))
    .digest("hex");
}

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function generateMindEaseId() {
  return `ME-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function createToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

function hashRegistrationCode(code) {
  return crypto
    .createHash("sha256")
    .update(code.trim().toUpperCase())
    .digest("hex");
}

async function createAndSendOtp(email, purpose) {
  const emailHash = hashEmail(email);

  const recent = await pool.query(
    `SELECT
       COUNT(*)::int AS count,
       MAX(last_sent_at) AS last_sent
     FROM email_otp_challenges
     WHERE email_hash = $1
       AND purpose = $2
       AND created_at > NOW() - INTERVAL '15 minutes'`,
    [emailHash, purpose]
  );

  if (recent.rows[0].count >= 5) {
    throw new Error("Too many OTP requests. Please try again after 15 minutes.");
  }

  const lastSent = recent.rows[0].last_sent;

  if (
    lastSent &&
    Date.now() - new Date(lastSent).getTime() < 60 * 1000
  ) {
    throw new Error("Please wait one minute before requesting another OTP.");
  }

  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  const inserted = await pool.query(
    `INSERT INTO email_otp_challenges
       (email_hash, purpose, otp_hash, expires_at, attempts)
     VALUES
       ($1, $2, $3, NOW() + INTERVAL '10 minutes', 0)
     RETURNING id`,
    [emailHash, purpose, otpHash]
  );

  try {
    await sendOtpEmail(email, otp, purpose);
  } catch (error) {
    await pool.query(
      `UPDATE email_otp_challenges
       SET consumed_at = NOW()
       WHERE id = $1`,
      [inserted.rows[0].id]
    );

    throw error;
  }

  return { emailHash };
}

async function verifyOtp(email, otp, purpose) {
  const emailHash = hashEmail(email);

  const result = await pool.query(
    `SELECT id, otp_hash, expires_at, attempts, verified_at
     FROM email_otp_challenges
     WHERE email_hash = $1
       AND purpose = $2
       AND consumed_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [emailHash, purpose]
  );

  if (result.rowCount === 0) {
    return { valid: false, emailHash };
  }

  const challenge = result.rows[0];

  if (new Date(challenge.expires_at) <= new Date()) {
    await pool.query(
      `UPDATE email_otp_challenges
       SET consumed_at = NOW()
       WHERE id = $1`,
      [challenge.id]
    );

    return { valid: false, emailHash };
  }

  if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
    return { valid: false, emailHash };
  }

  const suppliedHash = hashOtp(otp);

  const matches = crypto.timingSafeEqual(
    Buffer.from(suppliedHash, "hex"),
    Buffer.from(challenge.otp_hash, "hex")
  );

  if (!matches) {
    await pool.query(
      `UPDATE email_otp_challenges
       SET attempts = attempts + 1
       WHERE id = $1`,
      [challenge.id]
    );

    return { valid: false, emailHash };
  }

  return {
    valid: true,
    emailHash,
    challengeId: challenge.id,
  };
}

// ------------------------------------------
// SEND REGISTRATION OTP
// POST /api/auth/send-otp
// ------------------------------------------

router.post("/send-otp", async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!isCollegeEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please use your official @somaiya.edu email address.",
    });
  }

  try {
    const emailHash = hashEmail(email);

    const existing = await pool.query(
      `SELECT 1
       FROM college_email_verifications
       WHERE email_hash = $1`,
      [emailHash]
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: "This college email is already linked to a MindEase account. Try recovering your ID.",
      });
    }

    await createAndSendOtp(email, "register");

    return res.json({
      success: true,
      message: "Verification code sent. Please check your email.",
    });
  } catch (error) {
    console.error("Registration OTP error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to send the OTP.",
    });
  }
});

// ------------------------------------------
// VERIFY REGISTRATION OTP
// POST /api/auth/verify-otp
// ------------------------------------------

router.post("/verify-otp", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || "").trim();

  if (!isCollegeEmail(email) || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid college email and six-digit OTP.",
    });
  }

  try {
    const result = await verifyOtp(email, otp, "register");

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please try again.",
      });
    }

    await pool.query(
      `UPDATE email_otp_challenges
       SET verified_at = NOW()
       WHERE id = $1`,
      [result.challengeId]
    );

    return res.json({
      success: true,
      message: "College email verified successfully.",
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify the OTP.",
    });
  }
});

// ------------------------------------------
// REGISTER
// POST /api/auth/register
// ------------------------------------------

router.post("/register", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password, registrationCode } = req.body;

  if (!isCollegeEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "A verified @somaiya.edu email is required.",
    });
  }

  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128
  ) {
    return res.status(400).json({
      success: false,
      message: "Password must contain between 8 and 128 characters.",
    });
  }

  if (
    registrationCode !== undefined &&
    (typeof registrationCode !== "string" ||
      registrationCode.trim().length === 0 ||
      registrationCode.trim().length > 100)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid college registration code.",
    });
  }

  let client;

  try {
    const emailHash = hashEmail(email);

    const verifiedChallenge = await pool.query(
      `SELECT id
       FROM email_otp_challenges
       WHERE email_hash = $1
         AND purpose = 'register'
         AND verified_at IS NOT NULL
         AND consumed_at IS NULL
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [emailHash]
    );

    if (verifiedChallenge.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Please verify your college email before registering.",
      });
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    client = await pool.connect();
    await client.query("BEGIN");

    const duplicate = await client.query(
      `SELECT 1
       FROM college_email_verifications
       WHERE email_hash = $1
       FOR UPDATE`,
      [emailHash]
    );

    if (duplicate.rowCount > 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        success: false,
        message: "This college email is already registered.",
      });
    }

    let codeRecord = null;

    if (registrationCode) {
      const codeResult = await client.query(
        `SELECT id, max_uses, uses_count, expires_at
         FROM college_registration_codes
         WHERE code_hash = $1
           AND is_active = TRUE
         FOR UPDATE`,
        [hashRegistrationCode(registrationCode)]
      );

      if (codeResult.rowCount === 0) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Invalid or inactive college registration code.",
        });
      }

      codeRecord = codeResult.rows[0];

      if (
        codeRecord.expires_at &&
        new Date(codeRecord.expires_at) <= new Date()
      ) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "This college registration code has expired.",
        });
      }

      if (
        codeRecord.max_uses !== null &&
        codeRecord.uses_count >= codeRecord.max_uses
      ) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "This college registration code has reached its usage limit.",
        });
      }
    }

    let userId;
    let inserted = false;
    let createdAt;

    for (let attempt = 0; attempt < 5; attempt++) {
      userId = generateMindEaseId();

      const userResult = await client.query(
        `INSERT INTO users (id, password_hash)
         VALUES ($1, $2)
         ON CONFLICT (id) DO NOTHING
         RETURNING id, created_at`,
        [userId, passwordHash]
      );

      if (userResult.rowCount > 0) {
        inserted = true;
        createdAt = userResult.rows[0].created_at;
        break;
      }
    }

    if (!inserted) {
      throw new Error("Unable to generate a unique MindEase ID.");
    }

    await client.query(
      `INSERT INTO college_email_verifications
         (user_id, email_hash, email_domain)
       VALUES ($1, $2, $3)`,
      [userId, emailHash, COLLEGE_DOMAIN]
    );

    await client.query(
      `UPDATE email_otp_challenges
       SET consumed_at = NOW()
       WHERE id = $1`,
      [verifiedChallenge.rows[0].id]
    );

    if (codeRecord) {
      await client.query(
        `UPDATE college_registration_codes
         SET uses_count = uses_count + 1
         WHERE id = $1`,
        [codeRecord.id]
      );

      await client.query(
        `INSERT INTO code_redemptions (code_id, user_id)
         VALUES ($1, $2)`,
        [codeRecord.id, userId]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "MindEase account created successfully.",
      user: {
        id: userId,
        createdAt,
      },
      token: createToken(userId),
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create your account. Please try again.",
    });
  } finally {
    if (client) client.release();
  }
});

// ------------------------------------------
// LOGIN
// POST /api/auth/login
// ------------------------------------------

router.post("/login", async (req, res) => {
  const { id, password } = req.body;

  if (
    typeof id !== "string" ||
    typeof password !== "string" ||
    !id.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "MindEase ID and password are required.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, password_hash, created_at
       FROM users
       WHERE id = $1`,
      [id.trim().toUpperCase()]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid MindEase ID or password.",
      });
    }

    const user = result.rows[0];
    const matches = await argon2.verify(user.password_hash, password);

    if (!matches) {
      return res.status(401).json({
        success: false,
        message: "Invalid MindEase ID or password.",
      });
    }

    await pool.query(
      `UPDATE users SET last_login_at = NOW() WHERE id = $1`,
      [user.id]
    );

    return res.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        createdAt: user.created_at,
      },
      token: createToken(user.id),
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again.",
    });
  }
});

// ------------------------------------------
// SEND FORGOT-ID OTP
// POST /api/auth/recover-id/send-otp
// ------------------------------------------

router.post("/recover-id/send-otp", async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!isCollegeEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter your @somaiya.edu email address.",
    });
  }

  try {
    const emailHash = hashEmail(email);

    const existing = await pool.query(
      `SELECT 1
       FROM college_email_verifications
       WHERE email_hash = $1`,
      [emailHash]
    );

    // Use the same response whether or not the email exists.
    if (existing.rowCount > 0) {
      await createAndSendOtp(email, "recover_id");
    }

    return res.json({
      success: true,
      message: "If an account is linked to this email, a recovery code will be sent.",
    });
  } catch (error) {
    console.error("ID recovery OTP error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to process your request.",
    });
  }
});

// ------------------------------------------
// VERIFY FORGOT-ID OTP
// POST /api/auth/recover-id/verify
// ------------------------------------------

router.post("/recover-id/verify", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || "").trim();

  if (!isCollegeEmail(email) || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email and six-digit OTP.",
    });
  }

  try {
    const verification = await verifyOtp(email, otp, "recover_id");

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    const account = await pool.query(
      `SELECT u.id
       FROM users u
       INNER JOIN college_email_verifications v
         ON v.user_id = u.id
       WHERE v.email_hash = $1`,
      [verification.emailHash]
    );

    if (account.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: "No account was found for this email.",
      });
    }

    await sendRecoveredIdEmail(email, account.rows[0].id);

    await pool.query(
      `UPDATE email_otp_challenges
       SET consumed_at = NOW()
       WHERE id = $1`,
      [verification.challengeId]
    );

    return res.json({
      success: true,
      message: "Your MindEase ID has been sent to your college email.",
    });
  } catch (error) {
    console.error("ID recovery error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to recover your ID. Please try again.",
    });
  }
});

// ------------------------------------------
// SEND PASSWORD RESET OTP
// POST /api/auth/password-reset/send-otp
// ------------------------------------------

router.post("/password-reset/send-otp", async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!isCollegeEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter your @somaiya.edu email address.",
    });
  }

  try {
    const emailHash = hashEmail(email);

    const existing = await pool.query(
      `SELECT 1
       FROM college_email_verifications
       WHERE email_hash = $1`,
      [emailHash]
    );

    if (existing.rowCount > 0) {
      await createAndSendOtp(email, "reset_password");
    }

    return res.json({
      success: true,
      message: "If an account is linked to this email, a password reset code will be sent.",
    });
  } catch (error) {
    console.error("Password reset OTP error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to process your request.",
    });
  }
});

// ------------------------------------------
// CONFIRM PASSWORD RESET
// POST /api/auth/password-reset/confirm
// ------------------------------------------

router.post("/password-reset/confirm", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || "").trim();
  const password = req.body.password;

  if (!isCollegeEmail(email) || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid college email and six-digit OTP.",
    });
  }

  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128
  ) {
    return res.status(400).json({
      success: false,
      message: "Password must contain between 8 and 128 characters.",
    });
  }

  try {
    const verification = await verifyOtp(email, otp, "reset_password");

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const account = await client.query(
        `SELECT user_id
         FROM college_email_verifications
         WHERE email_hash = $1
         FOR UPDATE`,
        [verification.emailHash]
      );

      if (account.rowCount === 0) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "No account was found for this email.",
        });
      }

      await client.query(
        `UPDATE users
         SET password_hash = $1
         WHERE id = $2`,
        [passwordHash, account.rows[0].user_id]
      );

      await client.query(
        `UPDATE email_otp_challenges
         SET consumed_at = NOW()
         WHERE id = $1`,
        [verification.challengeId]
      );

      await client.query("COMMIT");

      return res.json({
        success: true,
        message: "Password reset successfully. Please sign in with your new password.",
      });
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Password reset error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reset your password. Please try again.",
    });
  }
});

// ------------------------------------------
// CURRENT USER
// GET /api/auth/me
// ------------------------------------------

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.json({
      success: true,
      user: {
        id: result.rows[0].id,
        createdAt: result.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error("Fetch user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user details.",
    });
  }
});

export default router;
