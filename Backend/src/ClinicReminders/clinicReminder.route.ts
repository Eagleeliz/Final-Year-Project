import { Router } from "express";
// Import the base middleware from your bearAuth.ts
import { authMiddleware } from "../middlewares/bearAuth"; 
import {
  createClinicReminderController,
  getAllClinicRemindersController,
  getClinicReminderByIdController,
  getUserClinicRemindersController,
  updateClinicReminderController,
  deleteClinicReminderController,
} from "./clinicReminder.controller";

const clinicReminderRouter = Router();

/**
 * We use authMiddleware("any") to act as our 'authenticate' function.
 * This ensures the user is logged in, but doesn't restrict them to a specific role.
 */
const authenticate = authMiddleware("any");

// Create a new clinic reminder
clinicReminderRouter.post("/", authenticate, createClinicReminderController);

// Get all reminders for a specific user
clinicReminderRouter.get("/user/:userId", authenticate, getUserClinicRemindersController);

// Get a single reminder by ID
clinicReminderRouter.get("/:id", authenticate, getClinicReminderByIdController);

// Update a clinic reminder by ID
clinicReminderRouter.put("/:id", authenticate, updateClinicReminderController);

// Delete a clinic reminder by ID
clinicReminderRouter.delete("/:id", authenticate, deleteClinicReminderController);

// Admin/Staff only route (Using your existing staffOnly export if preferred)
clinicReminderRouter.get("/all", authMiddleware(["admin", "policy_maker"]), getAllClinicRemindersController);

export default clinicReminderRouter;