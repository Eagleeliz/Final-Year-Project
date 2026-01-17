// src/validation/user.validator.ts
import { z } from "zod";

const kenyanCounties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa",
  "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu",
  "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a",
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu",
  "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu",
  "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
] as const;

export const createUserValidator = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  email: z.string().email().trim(),
  password: z.string().min(4).max(100).trim(),
  userType: z.enum(["mother", "health_worker", "admin"]).optional(),
  phone: z.string().min(5).max(20).trim(),
  county: z.enum(kenyanCounties).optional(),
});

export const updateUserValidator = createUserValidator.extend({
  id: z.number().int().positive()
});

export const userLogInValidator = z.object({
  email: z.string().email().trim(),
  password: z.string().min(4).max(100).trim(),
});

// Optional: Add password reset validator
export const passwordResetValidator = z.object({
  email: z.string().email().trim()
});

// Optional: Add email verification request validator
export const emailVerificationValidator = z.object({
  email: z.string().email().trim()
});