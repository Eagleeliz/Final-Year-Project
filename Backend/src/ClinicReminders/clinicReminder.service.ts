import { eq, and, desc } from "drizzle-orm";
import db from "./../drizzle/db";
import { clinicRemindersTable } from "./../drizzle/schema";

/**
 * Clinic Reminder Service
 * Handles CRUD operations for clinic reminders
 */
export class ClinicReminderService {
  /**
   * Create a new clinic reminder
   */
  async createReminder(data: typeof clinicRemindersTable.$inferInsert) {
    const safeData = { ...data };

    // Convert appointmentDate string to Date if needed
    if (data.appointmentDate && typeof data.appointmentDate === "string") {
      safeData.appointmentDate = new Date(data.appointmentDate);
    }

    // Set default status if not provided
    if (!safeData.status) safeData.status = "pending";

    const [newReminder] = await db
      .insert(clinicRemindersTable)
      .values(safeData)
      .returning();
    return newReminder;
  }

  /**
   * Get all reminders
   */
  async getAllReminders() {
    return await db.query.clinicRemindersTable.findMany({
      orderBy: [desc(clinicRemindersTable.appointmentDate)],
    });
  }

  /**
   * Get reminders for a specific user
   */
  async getRemindersByUser(userId: number) {
    return await db.query.clinicRemindersTable.findMany({
      where: eq(clinicRemindersTable.userId, userId),
      orderBy: [desc(clinicRemindersTable.appointmentDate)],
    });
  }

  /**
   * Get a specific reminder by ID
   */
  async getReminderById(id: number, userId: number) {
    const [reminder] = await db
      .select()
      .from(clinicRemindersTable)
      .where(
        and(
          eq(clinicRemindersTable.id, id),
          eq(clinicRemindersTable.userId, userId)
        )
      )
      .limit(1);

    return reminder || null;
  }

  /**
   * Update a reminder
   */
  async updateReminder(
    id: number,
    userId: number,
    updates: Partial<typeof clinicRemindersTable.$inferInsert>
  ) {
    const safeUpdates = { ...updates, updatedAt: new Date() } as typeof clinicRemindersTable.$inferInsert;

    // Convert appointmentDate string to Date if needed
    if (updates.appointmentDate && typeof updates.appointmentDate === "string") {
      safeUpdates.appointmentDate = new Date(updates.appointmentDate);
    }

    const [updated] = await db
      .update(clinicRemindersTable)
      .set(safeUpdates)
      .where(
        and(
          eq(clinicRemindersTable.id, id),
          eq(clinicRemindersTable.userId, userId)
        )
      )
      .returning();

    return updated;
  }

  /**
   * Delete a reminder
   */
  async deleteReminder(id: number, userId: number) {
    const [deleted] = await db
      .delete(clinicRemindersTable)
      .where(
        and(
          eq(clinicRemindersTable.id, id),
          eq(clinicRemindersTable.userId, userId)
        )
      )
      .returning();

    return deleted;
  }
}

// Export singleton instance
export const clinicReminderService = new ClinicReminderService();