import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailType = "welcome" | "milestone" | "emergency" | "credentials" | "password-reset" | "password-update" | "generic" | "account-closure";

export const sendNotificationEmail = async (
  email: string,
  subject: string,
  message: string,
  html?: string,
  type: EmailType = "generic"
): Promise<string> => {
  try {
    console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "SET ✅" : "NOT SET ❌");

    await resend.emails.send({
      from: 'BabyCentre Care <onboarding@resend.dev>',
      to: email,
      subject: `${subject} | BabyCentre`,
      html: html || message,
    });

    console.log("📨 Email sent successfully to:", email);
    return "✅ Email sent";

  } catch (error: any) {
    console.error("❌ EMAIL ERROR:", error);
    return `❌ Email error: ${error.message}`;
  }
};