import nodemailer from "nodemailer";

const getTransporter = () => {
  const pass = (process.env.MAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER || "geargrid60@gmail.com",
      pass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
};

const SENDER_EMAIL = process.env.MAIL_USER || "geargrid60@gmail.com";
const SENDER_NAME = "GearGrid Operations";

/**
 * Send an email with HTML and Plain Text fallback
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();
  const mailOptions = {
    from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email delivery failed:", error.message);
    throw error;
  }
};

/**
 * Branded GearGrid Email Template Wrapper
 */
const getBrandedHtmlTemplate = ({ title, subtitle, otp, actionText, warningText }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #121215; border: 1px solid #27272a; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #18181b; padding: 24px 32px; border-bottom: 1px solid #27272a;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 800; letter-spacing: 0.1em; color: #f4f4f5; text-transform: uppercase;">
                      GEAR<span style="color: #f59e0b;">GRID</span>
                    </span>
                    <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 3px; font-size: 10px; font-weight: 700; color: #f59e0b; letter-spacing: 0.08em;">
                      OPERATIONS
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                ${title}
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #a1a1aa; line-height: 1.5;">
                ${subtitle}
              </p>

              <!-- OTP Callout Box -->
              <div style="background-color: #09090b; border: 1px solid #3f3f46; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <span style="display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: #f59e0b; text-transform: uppercase; margin-bottom: 10px;">
                  ${actionText}
                </span>
                <span style="display: inline-block; font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 0.3em; color: #ffffff; padding: 8px 16px; background-color: #18181b; border: 1px solid #f59e0b; border-radius: 6px;">
                  ${otp}
                </span>
                <p style="margin: 12px 0 0 0; font-size: 12px; color: #71717a;">
                  Valid for <strong>10 minutes</strong>. Single use only.
                </p>
              </div>

              <!-- Security Warning -->
              <div style="background-color: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 12px 16px; border-radius: 0 4px 4px 0; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 12px; color: #f87171; line-height: 1.4;">
                  <strong>SECURITY NOTICE:</strong> ${warningText}
                </p>
              </div>

              <p style="margin: 0; font-size: 12px; color: #71717a; line-height: 1.5;">
                If you did not initiate this request on GearGrid, please disregard this transmission or contact system security.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #09090b; padding: 20px 32px; border-top: 1px solid #27272a; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #52525b;">
                GearGrid Engineering &bull; High-Performance Custom Hardware &bull; Automated Dispatch
              </p>
              <p style="margin: 0; font-size: 11px; color: #3f3f46;">
                &copy; ${new Date().getFullYear()} GearGrid Inc. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

/**
 * Send 6-digit Email Verification OTP
 */
export const sendVerificationOtp = async (email, otp) => {
  const html = getBrandedHtmlTemplate({
    title: "Verify Your GearGrid Station Profile",
    subtitle: "Thank you for registering with GearGrid. Use the one-time passcode below to verify your email and activate your station.",
    otp,
    actionText: "VERIFICATION ONE-TIME PASSCODE",
    warningText: "Never share this code with anyone. GearGrid engineers will never ask for your verification passcode.",
  });

  const text = `GearGrid Account Verification\n\nYour 6-digit verification passcode is: ${otp}\n\nThis code expires in 10 minutes.\nNever share this code with anyone.`;

  return sendEmail({
    to: email,
    subject: `[GearGrid] Your Verification Code: ${otp}`,
    html,
    text,
  });
};

/**
 * Send 6-digit Password Reset OTP
 */
export const sendPasswordResetOtp = async (email, otp) => {
  const html = getBrandedHtmlTemplate({
    title: "Station Password Reset Request",
    subtitle: "We received an authorized password reset request for your GearGrid station account.",
    otp,
    actionText: "PASSWORD RESET PASSCODE",
    warningText: "If you did not request this password reset, please secure your station immediately. Do not share this OTP with anyone.",
  });

  const text = `GearGrid Password Reset\n\nYour 6-digit password reset passcode is: ${otp}\n\nThis code expires in 10 minutes.\nIf you did not request this, please ignore this email.`;

  return sendEmail({
    to: email,
    subject: `[GearGrid] Password Reset Code: ${otp}`,
    html,
    text,
  });
};

export default {
  sendEmail,
  sendVerificationOtp,
  sendPasswordResetOtp,
};