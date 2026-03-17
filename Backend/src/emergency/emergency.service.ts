import db from "../drizzle/db";
import { eq,desc } from "drizzle-orm";
import {
  emergencyAlertsTable,
  emergencyContactsTable,
} from "../drizzle/schema";

// ── Emergency Contact Services ────────────────────────────────

// Get emergency contact by userId (one contact per user)
export const getEmergencyContact = async (userId: number) => {
  const result = await db
    .select()
    .from(emergencyContactsTable)
    .where(eq(emergencyContactsTable.userId, userId));
  return result[0] ?? null;
};

// Create emergency contact
export const createEmergencyContact = async (data: {
  userId: number;
  name: string;
  phoneNumber: string;
  relationship?: string;
}) => {
  const result = await db
    .insert(emergencyContactsTable)
    .values({
      userId: data.userId,
      name: data.name,
      phoneNumber: data.phoneNumber,
      relationship: data.relationship,
      isPrimary: true, // always primary since only one contact
    })
    .returning();
  return result[0];
};

// Update emergency contact
export const updateEmergencyContact = async (
  id: number,
  data: {
    name?: string;
    phoneNumber?: string;
    relationship?: string;
  }
) => {
  const result = await db
    .update(emergencyContactsTable)
    .set({
      ...(data.name        && { name: data.name }),
      ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
      ...(data.relationship && { relationship: data.relationship }),
      updatedAt: new Date(),
    })
    .where(eq(emergencyContactsTable.id, id))
    .returning();
  return result[0] ?? null;
};

// Delete emergency contact
export const deleteEmergencyContact = async (id: number) => {
  await db
    .delete(emergencyContactsTable)
    .where(eq(emergencyContactsTable.id, id));
};

// ── Emergency Alert Services ──────────────────────────────────

// Create an emergency alert (triggered by SOS button)
export const createEmergencyAlert = async (data: {
  userId: number;
  pregnancyId?: number;
  alertType?: string;
  severity?: string;
  description?: string;
  locationLat?: number;
  locationLong?: number;
}) => {
  const result = await db
    .insert(emergencyAlertsTable)
    .values({
      userId: data.userId,
      pregnancyId: data.pregnancyId,
      alertType: (data.alertType as any) ?? "other",
      severity: (data.severity as any) ?? "high",
      description: data.description,
      locationLat: data.locationLat?.toString(),
      locationLong: data.locationLong?.toString(),
      status: "pending",
    })
    .returning();
  return result[0];
};

// Get all alerts for a user
export const getAlertsByUser = async (userId: number) => {
  return db
    .select()
    .from(emergencyAlertsTable)
    .where(eq(emergencyAlertsTable.userId, userId));
};

// Update alert status
export const updateAlertStatus = async (
  id: number,
  status: "pending" | "notified" | "responded" | "resolved"
) => {
  const result = await db
    .update(emergencyAlertsTable)
    .set({
      status,
      ...(status === "resolved" && { resolvedAt: new Date() }),
    })
    .where(eq(emergencyAlertsTable.id, id))
    .returning();
  return result[0] ?? null;
};
// Get all emergency alerts (admin use)
export const getAllEmergencyAlerts = async () => {
  return db
    .select()
    .from(emergencyAlertsTable)
    .orderBy(desc(emergencyAlertsTable.createdAt));
};

// Get count of pending alerts
export const getPendingAlertsCount = async () => {
  const result = await db
    .select()
    .from(emergencyAlertsTable)
    .where(eq(emergencyAlertsTable.status, "pending"));
  return result.length;
};