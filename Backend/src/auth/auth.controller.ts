// src/auth/auth.controller.ts
import { Request, Response } from "express";
import { 
  getUserByEmailService, 
  getUserByIdService, 
  registerUserService,
  updateUserPasswordService,
  setEmailVerificationTokenService,
  verifyEmailService,
  setPasswordResetTokenService,
  resetPasswordWithTokenService
} from "./auth.service";
import { createUserValidator, userLogInValidator } from "../validation/user.validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Register user with email verification
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = createUserValidator.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues });
      return;
    }

    const user = parseResult.data;

    const existingUser = await getUserByEmailService(user.email);
    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    const userForService = {
      email: user.email,
      phone: user.phone,
      passwordHash: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      county: user.county,
      userType: user.userType || 'mother'
    };

    const result = await registerUserService(userForService);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await setEmailVerificationTokenService(
      result.id,
      verificationToken,
      verificationExpires
    );

    const verificationUrl = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

    res.status(201).json({
      message: "User created. Please verify your email.",
      userId: result.id,
      verificationUrl: verificationUrl,
    });

  } catch (error: any) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: error.message || "Failed to register user" });
  }
};

// LOGIN USER - requires email verification
export const loginUser = async (req: Request, res: Response) => {
  try {
    const parseResult = userLogInValidator.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues });
      return;
    }

    const user = parseResult.data;
    const userExists = await getUserByEmailService(user.email);
    
    if (!userExists) {
      res.status(404).json({ error: "User does not exist" });
      return;
    }

    if (!userExists.isActive) {
      res.status(403).json({ error: "Account is deactivated" });
      return;
    }

    // Check if email is verified
    if (!userExists.isEmailVerified) {
      res.status(403).json({ 
        error: "Email not verified. Please verify your email first.",
        needsVerification: true
      });
      return;
    }

    const isMatch = bcrypt.compareSync(user.password, userExists.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({
      userId: userExists.id,
      userEmail: userExists.email,
      userType: userExists.userType,
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, secret);

    res.status(200).json({ 
      token,
      userId: userExists.id,
      email: userExists.email,
      userType: userExists.userType,
      firstName: userExists.firstName,
      lastName: userExists.lastName,
      phone: userExists.phone,
      county: userExists.county,
      isActive: userExists.isActive,
      isEmailVerified: userExists.isEmailVerified
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to login user" });
  }
};

// Verify email with token
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const isVerified = await verifyEmailService(token);

    if (!isVerified) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    res.status(200).json({ message: "Email verified successfully" });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Password reset request
export const passwordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    // 🔥 ADD THIS CHECK FIRST:
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await getUserByEmailService(email);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const tokenSet = await setPasswordResetTokenService(email, resetToken, expiresAt);
    
    if (!tokenSet) {
      res.status(500).json({ error: "Failed to set password reset token" });
      return;
    }

    const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    res.status(200).json({
      message: "Password reset email sent",
      resetUrl: resetUrl,
      expiresAt: expiresAt
    });

  } catch (error: any) {
    console.error("❌ passwordReset error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    // 🔥 ADD THIS CHECK:
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      res.status(400).json({ error: "Token and password are required" });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const isReset = await resetPasswordWithTokenService(token, hashedPassword);

    if (!isReset) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    res.status(200).json({ message: "Password reset successfully" });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Keep old updatePassword for compatibility
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      res.status(400).json({ error: "Token and password are required" });
      return;
    }

    const secret = process.env.JWT_SECRET as string;
    const payload: any = jwt.verify(token, secret);

    const user = await getUserByIdService(payload.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await updateUserPasswordService(user.email, hashedPassword);

    res.status(200).json({ message: "Password reset successfully" });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await getUserByIdService(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      county: user.county,
      userType: user.userType,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};