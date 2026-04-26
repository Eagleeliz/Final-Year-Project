import { Router } from "express";
import {
  getEmergencyContactController,
  createEmergencyContactController,
  updateEmergencyContactController,
  deleteEmergencyContactController,
  createEmergencyAlertController,
  getAlertsByUserController,
  updateAlertStatusController,
  getAllAlertsController,
} from "./emergency.controller";
import { authMiddleware, adminOnly } from "../middlewares/bearAuth";

const emergencyRouter = Router();

// ── Emergency Contact Routes ──────────────────────────────────
emergencyRouter.get("/contact/:userId",    authMiddleware(), getEmergencyContactController);
emergencyRouter.post("/contact",           authMiddleware(), createEmergencyContactController);
emergencyRouter.put("/contact/:id",        authMiddleware(), updateEmergencyContactController);
emergencyRouter.delete("/contact/:id",     authMiddleware(), deleteEmergencyContactController);

// ── Emergency Alert Routes ────────────────────────────────────
emergencyRouter.post("/alert",             authMiddleware(), createEmergencyAlertController);
emergencyRouter.get("/alerts/all",         authMiddleware(), adminOnly, getAllAlertsController);  // ✅ before :userId
emergencyRouter.get("/alerts/:userId",     authMiddleware(), getAlertsByUserController);
emergencyRouter.patch("/alert/:id/status", authMiddleware(), updateAlertStatusController);

export default emergencyRouter;