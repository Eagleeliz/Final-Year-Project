import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Define Email Types for Maternal Health context
type EmailType = 
  | "welcome" 
  | "milestone" 
  | "emergency"
  | "credentials" 
  | "password-reset" 
  | "password-update" 
  | "generic"
  | "account-closure";

// Transporter Configuration - Port 587 / TLS
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true, // This will print the handshake details in your terminal
  debug: true,  // This will show detailed error logs
});

const PLATFORM_NAME = "BabyCentre Care";

export const sendNotificationEmail = async (
  email: string,
  subject: string,
  message: string,
  html?: string,
  type: EmailType = "generic"
): Promise<string> => {
  try {
    const themes: Record<EmailType, { color: string; icon: string; label: string }> = {
      welcome:           { color: "#002e33", icon: "👋", label: "WELCOME" },
      milestone:         { color: "#14b8a6", icon: "✨", label: "PREGNANCY UPDATE" },
      emergency:         { color: "#DC2626", icon: "🚨", label: "URGENT ALERT" },
      credentials:       { color: "#002e33", icon: "🔐", label: "ACCESS KEYS" },
      "password-reset":   { color: "#D97706", icon: "🔄", label: "RECOVERY" },
      "password-update": { color: "#059669", icon: "🛡️", label: "SECURITY" },
      generic:           { color: "#002e33", icon: "📢", label: "NOTICE" },
      "account-closure": { color: "#4B5563", icon: "🚫", label: "ACCOUNT CLOSED" },
    };

    const theme = themes[type] || themes.generic;

    const defaultHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { max-width: 600px; margin: 0 auto; font-family: 'Helvetica Neue', Arial, sans-serif; color: #1f2937; background-color: #f3f4f6; padding: 20px; }
        .card { background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
        .header { background-color: ${theme.color}; padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px; }
        .content { padding: 40px 30px; text-align: center; }
        .badge { display: inline-block; padding: 6px 16px; border-radius: 50px; background-color: ${theme.color}15; color: ${theme.color}; font-size: 12px; font-weight: 900; margin-bottom: 24px; text-transform: uppercase; }
        .message { line-height: 1.8; font-size: 16px; color: #4b5563; }
        .footer { padding: 30px; text-align: center; font-size: 12px; color: #9ca3af; background-color: #f9fafb; }
        .heart { color: #14b8a6; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h1>${PLATFORM_NAME}</h1>
          </div>
          <div class="content">
            <div class="badge">${theme.icon} ${theme.label}</div>
            <div class="message">
              ${message}
            </div>
            <div style="margin-top: 30px;">
                <span class="heart">♥</span>
                <p style="font-size: 13px; color: #6b7280; margin-top: 5px;">Your partners in motherhood.</p>
            </div>
          </div>
          <div class="footer">
            <strong>BabyCentre Care Kenya</strong><br>
            Ensuring safe journeys for every mom & baby &copy; ${new Date().getFullYear()}
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"${PLATFORM_NAME}" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: `${subject} | BabyCentre`,
      html: html || defaultHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📨 NodeMailer accepted this email:", info.messageId);
    return "✅ Email sent";

  } catch (error: any) {
    console.error("❌ CRITICAL EMAIL ERROR:", error);
    return `❌ Email error: ${error.message}`;
  }
};