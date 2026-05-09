import dotenv from 'dotenv'
dotenv.config() 

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const EMAIL_SENDER = process.env.EMAIL_SENDER as string;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;
export const RESEND_API_KEY = process.env.RESEND_API_KEY as string;