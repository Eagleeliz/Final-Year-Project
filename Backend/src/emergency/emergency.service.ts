import db from "../drizzle/db";
import { eq, desc } from "drizzle-orm";
import {
  emergencyAlertsTable,
  emergencyContactsTable,
} from "../drizzle/schema";
import { smsService } from "../sms/sms.service";
import { usersTable } from "../drizzle/schema";

// ── Emergency Contact Services ────────────────────────────────

export const getEmergencyContact = async (userId: number) => {
  const result = await db
    .select()
    .from(emergencyContactsTable)
    .where(eq(emergencyContactsTable.userId, userId));
  return result[0] ?? null;
};

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
      isPrimary: true,
    })
    .returning();
  return result[0];
};

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

export const deleteEmergencyContact = async (id: number) => {
  await db
    .delete(emergencyContactsTable)
    .where(eq(emergencyContactsTable.id, id));
};

// ── Emergency Alert Services ──────────────────────────────────

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

  const alert = result[0];

  const emergencyContact = await getEmergencyContact(data.userId);

  if (emergencyContact?.phoneNumber) {
    try {
      // ← Fetch the user's name
      const userResult = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, data.userId));
      
      const user = userResult[0];
      const userFullName = user
        ? `${user.firstName} ${user.lastName}`.trim()
        : `User ${data.userId}`; // fallback if user not found

      await smsService.sendEmergencyAlert(
        emergencyContact.phoneNumber,
        userFullName,  // ← pass name instead of userId
        data.alertType ?? "other",
        (data.severity as "medium" | "high" | "critical") ?? "high",
        data.description ?? "Emergency alert triggered"
      );

      await db
        .update(emergencyAlertsTable)
        .set({ status: "notified" })
        .where(eq(emergencyAlertsTable.id, alert.id));

      alert.status = "notified";

      console.log(`✅ Emergency SMS sent to ${emergencyContact.name} (${emergencyContact.phoneNumber})`);
    } catch (smsError: any) {
      console.error(`❌ SMS failed but alert was created: ${smsError.message}`);
    }
  } else {
    console.warn(`⚠️ No emergency contact found for user ${data.userId} — SMS not sent`);
  }

  return alert;
};

export const getAlertsByUser = async (userId: number) => {
  return db
    .select()
    .from(emergencyAlertsTable)
    .where(eq(emergencyAlertsTable.userId, userId));
};

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

export const getAllEmergencyAlerts = async () => {
  return db
    .select()
    .from(emergencyAlertsTable)
    .orderBy(desc(emergencyAlertsTable.createdAt));
};

export const getPendingAlertsCount = async () => {
  const result = await db
    .select()
    .from(emergencyAlertsTable)
    .where(eq(emergencyAlertsTable.status, "pending"));
  return result.length;
};
