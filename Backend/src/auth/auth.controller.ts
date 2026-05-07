import { JWT_SECRET } from '../config.js';
import { Request, Response } from "express";
import {
  getUserByEmailService,
  registerUserService,
  setEmailVerificationTokenService,
  updateUserService,
    setPasswordResetTokenService,
    getUserByIdService
} from "./auth.service.js";
import { createUserValidator, userLogInValidator } from "../validation/user.validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendNotificationEmail } from "../middlewares/GoogleMailer.js";

// REGISTER WITH OTP
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
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = bcrypt.hashSync(user.password, 10);

    const result = await registerUserService({
      ...user,
      constituency: user.constituency || null,
      passwordHash: hashedPassword
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await setEmailVerificationTokenService(result.id, otp, expires);

    await sendNotificationEmail(
      user.email,
      "Your Verification Code",
      `
      Welcome to BabyCentre Care<br/><br/>
      Your OTP is:<br/><br/>
      <h2>${otp}</h2>
      This code expires in 5 minutes.
      `,
      undefined,
      "welcome"
    );

    const token = jwt.sign(
      {
        userId: result.id,
        userEmail: user.email,
        userType: user.userType || 'mother'
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      user: {
        id: result.id,
        email: user.email,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        phone: user.phone || null,
        userType: user.userType || 'mother',
        county: user.county || null,
        constituency: user.constituency || null,
        ward: user.ward || null
      },
      token,
      isAuthenticated: true,
      message: "Registration successful. OTP sent to email."
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// VERIFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await getUserByEmailService(email);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({ error: "Already verified" });
      return;
    }

    if (user.emailVerificationToken !== otp) {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    if (new Date() > (user.emailVerificationExpires as Date)) {
      res.status(400).json({ error: "OTP expired" });
      return;
    }

    await updateUserService(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    });

    res.status(200).json({ message: "Verified successfully" });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  try {
    const parseResult = userLogInValidator.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues });
      return;
    }

    const { email, password, rememberMe } = parseResult.data;
    const userExists = await getUserByEmailService(email);

    if (!userExists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!userExists.isEmailVerified) {
      res.status(403).json({ error: "Verify your email first", needsVerification: true });
      return;
    }

    const isMatch = bcrypt.compareSync(password, userExists.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const expiresIn = rememberMe ? "30d" : "1h";

    const token = jwt.sign(
      {
        userId: userExists.id,
        userEmail: userExists.email,
        userType: userExists.userType
      },
      JWT_SECRET,
      { expiresIn }
    );

    res.status(200).json({
      user: {
        id: userExists.id,
        email: userExists.email,
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        phone: userExists.phone,
        userType: userExists.userType,
        county: userExists.county || null,
        constituency: userExists.constituency || null,
        ward: userExists.ward || null
      },
      token,
      isAuthenticated: true,
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// RESEND OTP
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await getUserByEmailService(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await setEmailVerificationTokenService(user.id, otp, expires);

    await sendNotificationEmail(
      user.email,
      "Your New Verification Code",
      `
      Your new OTP is:<br/><br/>
      <h2>${otp}</h2>
      This code expires in 5 minutes.
      `,
      undefined,
      "welcome"
    );

    res.status(200).json({
      message: "New OTP sent to email",
      expiresAt: expires
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await getUserByEmailService(email);

    if (!user) {
      res.status(200).json({ message: "If that email exists, a reset code was sent." });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await setPasswordResetTokenService(email, otp, expires);

    await sendNotificationEmail(
      user.email,
      "Your Password Reset Code",
      `
      Hi ${user.firstName || "there"}<br/><br/>
      You requested a password reset for your BabyCentre Care account.<br/><br/>
      Your reset code is:<br/><br/>
      <h2>${otp}</h2>
      This code expires in 10 minutes.<br/><br/>
      If you did not request this, please ignore this email.
      `,
      undefined,
      "welcome"
    );

    res.status(200).json({ message: "If that email exists, a reset code was sent." });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({ error: "Email, OTP and new password are required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const user = await getUserByEmailService(email);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.passwordResetToken !== otp) {
      res.status(400).json({ error: "Invalid reset code" });
      return;
    }

    if (!user.passwordResetExpires || new Date() > user.passwordResetExpires) {
      res.status(400).json({ error: "Reset code has expired" });
      return;
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await updateUserService(user.id, {
      passwordHash: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    res.status(200).json({ message: "Password reset successfully. You can now log in." });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    if (!req.file) {
      res.status(400).json({ error: "No image uploaded" });
      return;
    }
    const imageUrl = (req.file as any).path;
    await updateUserService(userId, { profileImage: imageUrl });
    res.status(200).json({ profileImage: imageUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }
    const user = await getUserByIdService(userId);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
    if (!isMatch) { res.status(401).json({ error: "Current password is incorrect" }); return; }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await updateUserService(userId, { passwordHash: hashedPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number((req as any).user?.userId);
    const user = await getUserByIdService(userId);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      county: user.county,
      constituency: user.constituency,
      ward: user.ward,
      dateOfBirth: user.dateOfBirth,
      profileImage: user.profileImage,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const completeProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number((req as any).user?.userId);
    const { firstName, lastName, phone, county, constituency, ward, dateOfBirth } = req.body;

    await updateUserService(userId, {
      firstName,
      lastName,
      phone,
      county,
      constituency: constituency || null,
      ward: ward || null,
      dateOfBirth: dateOfBirth || null,
    });

    const updated = await getUserByIdService(userId);
    if (!updated) { res.status(404).json({ error: "User not found" }); return; }

    res.status(200).json({
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
      county: updated.county,
      constituency: updated.constituency,
      ward: updated.ward,
      dateOfBirth: updated.dateOfBirth,
      profileImage: updated.profileImage,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};