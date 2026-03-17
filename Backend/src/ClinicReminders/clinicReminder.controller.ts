import { Request, Response } from "express";
import { clinicReminderService } from "./clinicReminder.service";

/**
 * Create a new clinic reminder
 */
export const createClinicReminderController = async (req: Request, res: Response) => {
  try {
    const { 
      userId, 
      title, 
      appointmentDate, 
      description, 
      notes, 
      pregnancyId, 
      facilityId, 
      reminderType 
    } = req.body;

    // 1. Critical Validation
    if (!userId || !title || !appointmentDate) {
      return res.status(400).json({ message: "Missing required fields: userId, title, or appointmentDate" });
    }

    // 2. Map Frontend keys to Database Schema keys
    const reminderData = {
      userId: Number(userId),
      title: title,
      appointmentDate: new Date(appointmentDate), // Ensure Date object for Drizzle
      notes: notes || description || null,        // Maps 'description' to 'notes' column
      reminderType: reminderType || "General",
      pregnancyId: pregnancyId ? Number(pregnancyId) : null,
      facilityId: facilityId ? Number(facilityId) : null,
      status: "pending"
    };

    const reminder = await clinicReminderService.createReminder(reminderData);
    res.status(201).json(reminder);
  } catch (error: any) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ 
      message: "Failed to create clinic reminder",
      error: error.message // Helps debugging in the network tab
    });
  }
};

/**
 * Get all reminders (Admin/Dev)
 */
export const getAllClinicRemindersController = async (_req: Request, res: Response) => {
  try {
    const reminders = await clinicReminderService.getAllReminders();
    res.status(200).json(reminders);
  } catch (error) {
    console.error("FETCH ALL ERROR:", error);
    res.status(500).json({ message: "Failed to fetch clinic reminders" });
  }
};

/**
 * Get reminders for a specific user
 */
export const getUserClinicRemindersController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid User ID" });

    const reminders = await clinicReminderService.getRemindersByUser(userId);
    res.status(200).json(reminders);
  } catch (error) {
    console.error("FETCH USER REMINDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch user clinic reminders" });
  }
};

/**
 * Get a single reminder by ID (Ownership protected)
 */
export const getClinicReminderByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    // userId can come from req.user (if using auth middleware) or req.query
    const userId = Number(req.query.userId || (req as any).user?.id); 

    if (!id || !userId) return res.status(400).json({ message: "ID and UserID required" });

    const reminder = await clinicReminderService.getReminderById(id, userId);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json(reminder);
  } catch (error) {
    console.error("FETCH BY ID ERROR:", error);
    res.status(500).json({ message: "Failed to fetch clinic reminder" });
  }
};

/**
 * Update a clinic reminder
 */
export const updateClinicReminderController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.body.userId || (req as any).user?.id);
    
    // Clean updates: map description to notes if provided
    const updates = { ...req.body };
    if (updates.description) {
      updates.notes = updates.description;
      delete updates.description;
    }

    const updated = await clinicReminderService.updateReminder(id, userId, updates);

    if (!updated) {
      return res.status(404).json({ message: "Reminder not found or unauthorized" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Failed to update clinic reminder" });
  }
};

/**
 * Delete a clinic reminder
 */
export const deleteClinicReminderController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.query.userId || (req as any).user?.id);

    if (!id || !userId) return res.status(400).json({ message: "Missing ID or User ID" });

    const deleted = await clinicReminderService.deleteReminder(id, userId);

    if (!deleted) {
      return res.status(404).json({ message: "Reminder not found or already deleted" });
    }

    res.status(200).json({ message: "Clinic reminder deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Failed to delete clinic reminder" });
  }
};