// src/auth/auth.routes.ts
import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  passwordReset, 
  resetPassword, // Add this new function
  updatePassword, // Keep for backward compatibility
  verifyEmail,    // Add email verification
  getUserProfile, 
  completeProfile
} from "./auth.controller";
import { authMiddleware, motherOnly } from "../middlewares/bearAuth";

export const authRouter = Router();

// User authentication routes
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

// Email verification
authRouter.get('/verify-email/:token', verifyEmail); // ADD THIS

// Password reset routes
authRouter.post('/password-reset', passwordReset);
authRouter.post('/reset-password/:token', resetPassword); // New endpoint
authRouter.post('/reset/:token', updatePassword); // Keep old endpoint


authRouter.patch('/complete-profile', authMiddleware(), completeProfile);

// User profile route
authRouter.get('/profile', authMiddleware(), getUserProfile);