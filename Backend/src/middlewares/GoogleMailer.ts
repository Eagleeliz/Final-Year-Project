import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendNotificationEmail = async (
  email: string,
  subject: string,
  message: string,
  html?: string,
  type: string = "generic"
): Promise<string> => {
  try {
    const info = await transporter.sendMail({
      from: `"BabyCentre Care" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: `${subject} | BabyCentre`,
      html: html || message,
    });
    console.log("📨 Email sent:", info.messageId);
    return "✅ Email sent";
  } catch (error: any) {
    console.error("❌ EMAIL ERROR:", error.message);
    return `❌ Email error: ${error.message}`;
  }
};