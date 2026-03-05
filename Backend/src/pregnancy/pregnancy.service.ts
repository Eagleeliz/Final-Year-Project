import db from "../drizzle/db";
import { pregnanciesTable } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Utility to calculate pregnancy progress based on LMP
 */
export const calculatePregnancyStats = (lmpDate: string | Date) => {
  const lmp = new Date(lmpDate);
  const today = new Date();
  
  // Calculate difference in days
  const diffInMs = today.getTime() - lmp.getTime();
  const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  const weeks = Math.max(0, Math.floor(totalDays / 7));
  const days = Math.max(0, totalDays % 7);

  // Determine trimester
  let trimester: 1 | 2 | 3 = 1;
  if (weeks >= 13 && weeks < 27) trimester = 2;
  if (weeks >= 27) trimester = 3;

  return { weeks, days, trimester };
};

// --- CRUD Operations ---

export const createPregnancy = async (data: any) => {
  if (!data.userId) throw new Error("userId is required");
  if (!data.lmpDate) throw new Error("LMP date is required");

  const lmp = new Date(data.lmpDate);

  // 1. Calculate EDD (LMP + 280 days)
  const edd = new Date(lmp);
  edd.setDate(edd.getDate() + 280);

  // 2. Get initial trimester
  const { trimester } = calculatePregnancyStats(data.lmpDate);

  // 3. Deactivate all previous pregnancies for this user
  await db
    .update(pregnanciesTable)
    .set({ isActive: false })
    .where(eq(pregnanciesTable.userId, data.userId));

  // 4. Insert new journey
  const pregnancy = await db
    .insert(pregnanciesTable)
    .values({
      ...data,
      lmpDate: lmp.toISOString().split('T')[0], // Standardize to YYYY-MM-DD
      eddDate: edd.toISOString().split('T')[0],
      currentTrimester: trimester,
      isActive: true,
    })
    .returning();

  return pregnancy[0];
};

export const getActivePregnancyByUserId = async (userId: number) => {
  const record = await db.query.pregnanciesTable.findFirst({
    where: and(
      eq(pregnanciesTable.userId, userId),
      eq(pregnanciesTable.isActive, true)
    )
  });

  if (!record) return null;

  // Add "Live" calculations for the dashboard
  const stats = calculatePregnancyStats(record.lmpDate);

  return {
    ...record,
    liveWeeks: stats.weeks,
    liveDays: stats.days,
    liveTrimester: stats.trimester
  };
};

export const getAllPregnancies = async () => {
  return db.query.pregnanciesTable.findMany({
    with: { user: { columns: { passwordHash: false } } },
    orderBy: [desc(pregnanciesTable.createdAt)]
  });
};

export const getPregnanciesByUserId = async (userId: number) => {
  return db.query.pregnanciesTable.findMany({
    where: eq(pregnanciesTable.userId, userId),
    orderBy: [desc(pregnanciesTable.createdAt)]
  });
};

export const getPregnancyById = async (id: number) => {
  return db.query.pregnanciesTable.findFirst({
    where: eq(pregnanciesTable.id, id),
    with: { user: { columns: { passwordHash: false } } }
  });
};

export const updatePregnancy = async (id: number, data: any) => {
  let updatePayload = { ...data };

  // If the user is updating the LMP, recalculate the EDD and Trimester
  if (data.lmpDate) {
    const lmp = new Date(data.lmpDate);
    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280);
    
    const { trimester } = calculatePregnancyStats(data.lmpDate);
    
    updatePayload.eddDate = edd.toISOString().split('T')[0];
    updatePayload.currentTrimester = trimester;
  }

  const updated = await db
    .update(pregnanciesTable)
    .set({ ...updatePayload, updatedAt: new Date() })
    .where(eq(pregnanciesTable.id, id))
    .returning();

  return updated[0];
};

export const deletePregnancy = async (id: number) => {
  await db.delete(pregnanciesTable).where(eq(pregnanciesTable.id, id));
  return { message: "Pregnancy record deleted successfully" };
};