import { Request, Response } from "express";
import {
  getEmergencyContact,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  createEmergencyAlert,
  getAlertsByUser,
  updateAlertStatus,
  getAllEmergencyAlerts,
} from "./emergency.service";

// ── Emergency Contact Controllers ─────────────────────────────

// GET /api/emergency/contact/:userId
export const getEmergencyContactController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ success: false, message: "Invalid user ID" });
      return;
    }
    const contact = await getEmergencyContact(userId);
    if (!contact) {
      res.status(404).json({ success: false, message: "No emergency contact found" });
      return;
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch contact", error: error.message });
  }
};

// POST /api/emergency/contact
export const createEmergencyContactController = async (req: Request, res: Response) => {
  try {
    const { userId, name, phoneNumber, relationship } = req.body;
    if (!userId || !name || !phoneNumber) {
      res.status(400).json({ success: false, message: "userId, name and phoneNumber are required" });
      return;
    }
    const contact = await createEmergencyContact({ userId, name, phoneNumber, relationship });
    res.status(201).json({ success: true, data: contact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to create contact", error: error.message });
  }
};

// PUT /api/emergency/contact/:id
export const updateEmergencyContactController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid contact ID" });
      return;
    }
    const updated = await updateEmergencyContact(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: "Contact not found" });
      return;
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to update contact", error: error.message });
  }
};

// DELETE /api/emergency/contact/:id
export const deleteEmergencyContactController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid contact ID" });
      return;
    }
    await deleteEmergencyContact(id);
    res.status(200).json({ success: true, message: "Emergency contact deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to delete contact", error: error.message });
  }
};

// ── Emergency Alert Controllers ───────────────────────────────

// POST /api/emergency/alert
export const createEmergencyAlertController = async (req: Request, res: Response) => {
  try {
    const { userId, pregnancyId, alertType, severity, description, locationLat, locationLong } = req.body;
    if (!userId) {
      res.status(400).json({ success: false, message: "userId is required" });
      return;
    }
    const alert = await createEmergencyAlert({
      userId,
      pregnancyId,
      alertType,
      severity,
      description,
      locationLat,
      locationLong,
    });
    res.status(201).json({ success: true, data: alert });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to create alert", error: error.message });
  }
};

// GET /api/emergency/alerts/:userId
export const getAlertsByUserController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ success: false, message: "Invalid user ID" });
      return;
    }
    const alerts = await getAlertsByUser(userId);
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch alerts", error: error.message });
  }
};

// PATCH /api/emergency/alert/:id/status
export const updateAlertStatusController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid alert ID" });
      return;
    }
    const validStatuses = ["pending", "notified", "responded", "resolved"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(", ")}` });
      return;
    }
    const updated = await updateAlertStatus(id, status);
    if (!updated) {
      res.status(404).json({ success: false, message: "Alert not found" });
      return;
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to update alert status", error: error.message });
  }
};
export const getAllAlertsController = async (req: Request, res: Response) => {
  try {
    const alerts = await getAllEmergencyAlerts();
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch alerts", error: error.message });
  }
};