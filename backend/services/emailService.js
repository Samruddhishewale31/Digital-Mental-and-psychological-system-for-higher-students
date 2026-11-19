
import { Resend } from "resend";

export async function sendOtpEmail(email, otp, purpose) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend API key is not configured.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const messages = {
    register: {
      subject: "Verify your MindEase college email",
      heading: "Verify your college email",
      description: "Use this code to complete your MindEase account registration.",
    },
    recover_id: {
      subject: "Recover your MindEase ID",
      heading: "Recover your MindEase ID",
      description: "Use this code to securely recover your MindEase ID.",
    },
    reset_password: {
      subject: "Reset your MindEase password",
      heading: "Reset your password",
      description: "Use this code to reset your MindEase password.",
    },
  };

  const message = messages[purpose];

  if (!message) {
    throw new Error("Invalid email purpose.");
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;color:#333">
      <h2 style="color:#6656a5">MindEase</h2>
      <h3>${message.heading}</h3>
      <p>${message.description}</p>
      <div style="background:#f4f2fa;padding:20px;text-align:center;
                  border-radius:10px;font-size:30px;font-weight:bold;
                  letter-spacing:8px">
        ${otp}
      </div>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
      <p style="color:#888;font-size:12px">
        MindEase Student Wellness Platform
      </p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [email],
    subject: message.subject,
    html,
    text: `${message.description} Your OTP is ${otp}. It expires in 10 minutes.`,
  });

  if (error) {
    console.error("Resend delivery error:", error.message);
    throw new Error("Unable to send the verification email.");
  }

  return data;
}

export async function sendRecoveredIdEmail(email, mindEaseId) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend API key is not configured.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [email],
    subject: "Your MindEase ID",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#6656a5">MindEase</h2>
        <p>Your MindEase ID is:</p>
        <div style="background:#f4f2fa;padding:20px;text-align:center;
                    border-radius:10px;font-size:26px;font-weight:bold">
          ${mindEaseId}
        </div>
        <p>Keep this ID safe. You will need it to sign in.</p>
      </div>
    `,
    text: `Your MindEase ID is ${mindEaseId}. Keep it safe.`,
  });

  if (error) {
    console.error("Resend delivery error:", error.message);
    throw new Error("Unable to send the recovery email.");
  }

  return data;
}
