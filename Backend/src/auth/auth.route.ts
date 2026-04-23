import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  uploadProfileImage,
  changePassword,
  getProfile,        // ✅ add
  completeProfile,   // ✅ add
} from "./auth.controller";
import { upload } from "../middlewares/cloudinary";


import { authMiddleware } from "../middlewares/bearAuth";



export const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/resend-otp", resendOtp);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/upload-image/:userId", upload.single("image"), uploadProfileImage);
authRouter.post("/change-password", changePassword);
authRouter.get("/profile", authMiddleware(), getProfile);          // ✅
authRouter.put("/complete-profile", authMiddleware(), completeProfile); // ✅