
import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

// Validate an ISO date-time value.
const isValidDateTime = (value) => {
  return (
    typeof value === "string" &&
    value.length <= 50 &&
    !Number.isNaN(Date.parse(value))
  );
};

// GET ALL APPOINTMENTS FOR THE LOGGED-IN STUDENT
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         booking_code,
         counsellor_id,
         counsellor_label,
         counsellor_image,
         specialization,
         appointment_at,
         appointment_mode,
         reason,
         notes,
         status,
         is_anonymous,
         created_at
       FROM counselling_appointments
       WHERE user_id = $1
       ORDER BY appointment_at DESC`,
      [req.user.id]
    );

    return res.json({
      success: true,
      appointments: result.rows,
    });
  } catch (error) {
    console.error("Fetch appointments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your appointments.",
    });
  }
});

// CREATE A NEW COUNSELLING APPOINTMENT
router.post("/", async (req, res) => {
  const {
    bookingCode,
    counsellorId,
    counsellorName,
    counsellorImage,
    specialization,
    appointmentAt,
    mode,
    reason,
    notes,
    anonymous,
  } = req.body;

  if (
    typeof bookingCode !== "string" ||
    !/^MH-\d{6}$/.test(bookingCode)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment booking ID.",
    });
  }

  if (
    !Number.isInteger(Number(counsellorId)) ||
    Number(counsellorId) <= 0 ||
    typeof counsellorName !== "string" ||
    !counsellorName.trim() ||
    counsellorName.length > 150
  ) {
    return res.status(400).json({
      success: false,
      message: "Please select a valid counsellor.",
    });
  }

  if (!isValidDateTime(appointmentAt)) {
    return res.status(400).json({
      success: false,
      message: "Please select a valid appointment date and time.",
    });
  }

  if (new Date(appointmentAt).getTime() <= Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Appointment date and time must be in the future.",
    });
  }

  if (
    typeof mode !== "string" ||
    !mode.trim() ||
    mode.length > 20 ||
    typeof reason !== "string" ||
    !reason.trim() ||
    reason.length > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid appointment mode and reason.",
    });
  }

  if (
    typeof notes !== "string" ||
    notes.length > 3000 ||
    typeof anonymous !== "boolean"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment details.",
    });
  }

  if (
    counsellorImage != null &&
    (typeof counsellorImage !== "string" ||
      counsellorImage.length > 2000)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid counsellor image.",
    });
  }

  if (
    specialization != null &&
    (typeof specialization !== "string" ||
      specialization.length > 200)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid counsellor specialization.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO counselling_appointments (
         user_id,
         booking_code,
         counsellor_id,
         counsellor_label,
         counsellor_image,
         specialization,
         appointment_at,
         appointment_mode,
         reason,
         notes,
         is_anonymous,
         status
       )
       VALUES (
         $1, $2, $3, $4, $5, $6,
         $7::timestamptz, $8, $9, $10, $11, 'pending'
       )
       RETURNING
         id,
         booking_code,
         counsellor_id,
         counsellor_label,
         counsellor_image,
         specialization,
         appointment_at,
         appointment_mode,
         reason,
         notes,
         status,
         is_anonymous,
         created_at`,
      [
        req.user.id,
        bookingCode,
        Number(counsellorId),
        counsellorName.trim(),
        counsellorImage || null,
        specialization || null,
        new Date(appointmentAt).toISOString(),
        mode.trim(),
        reason.trim(),
        notes.trim(),
        anonymous,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Counselling appointment booked successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Create appointment error:", error.message);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This booking ID already exists. Please try booking again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to book your appointment. Please try again.",
    });
  }
});

// CANCEL AN APPOINTMENT
router.patch("/:bookingCode/cancel", async (req, res) => {
  const { bookingCode } = req.params;

  try {
    const result = await pool.query(
      `UPDATE counselling_appointments
       SET status = 'cancelled'
       WHERE booking_code = $1
         AND user_id = $2
         AND status IN ('pending', 'confirmed')
       RETURNING booking_code, status`,
      [bookingCode, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or can no longer be cancelled.",
      });
    }

    return res.json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Cancel appointment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel your appointment.",
    });
  }
});

// RESCHEDULE AN APPOINTMENT
router.patch("/:bookingCode/reschedule", async (req, res) => {
  const { bookingCode } = req.params;
  const { appointmentAt } = req.body;

  if (!isValidDateTime(appointmentAt)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid appointment date and time.",
    });
  }

  if (new Date(appointmentAt).getTime() <= Date.now()) {
    return res.status(400).json({
      success: false,
      message: "The new appointment date and time must be in the future.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE counselling_appointments
       SET appointment_at = $1::timestamptz
       WHERE booking_code = $2
         AND user_id = $3
         AND status IN ('pending', 'confirmed')
       RETURNING booking_code, appointment_at, status`,
      [
        new Date(appointmentAt).toISOString(),
        bookingCode,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or can no longer be rescheduled.",
      });
    }

    return res.json({
      success: true,
      message: "Appointment rescheduled successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Reschedule appointment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to reschedule your appointment.",
    });
  }
});

export default router;
