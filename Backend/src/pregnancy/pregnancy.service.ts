import db from "../drizzle/db";
import { pregnanciesTable, usersTable } from "../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";

/**
 * Calculate pregnancy progress based on LMP
 */
export const calculatePregnancyStats = (lmpDate: string | Date) => {
  const lmp = new Date(lmpDate);
  const today = new Date();
  
  // Calculate days since LMP
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

// CRUD Operations

export const createPregnancy = async (data: any) => {
  if (!data.userId) throw new Error("userId is required");
  if (!data.lmpDate) throw new Error("LMP date is required");

  const lmp = new Date(data.lmpDate);

  // Calculate EDD - LMP plus 280 days
  const edd = new Date(lmp);
  edd.setDate(edd.getDate() + 280);

  // Get initial trimester
  const { trimester } = calculatePregnancyStats(data.lmpDate);

  // Deactivate all previous pregnancies for this user
  await db
    .update(pregnanciesTable)
    .set({ isActive: false })
    .where(eq(pregnanciesTable.userId, data.userId));

  // Insert new pregnancy record
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

  // Add live calculations for the dashboard
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

// LOCATION-BASED AND ANALYTICS SERVICES

// Get pregnancies with user location data
const getPregnanciesWithLocation = async () => {
  return await db.select({
    pregnancy: pregnanciesTable,
    userCounty: usersTable.county,
    userConstituency: usersTable.constituency,
    userWard: usersTable.ward,
  })
  .from(pregnanciesTable)
  .innerJoin(usersTable, eq(pregnanciesTable.userId, usersTable.id));
};

// Get pregnancy count by county
export const getPregnancyCountByCounty = async () => {
  const data = await getPregnanciesWithLocation();
  const counts: Record<string, number> = {};
  data.forEach((row: { userCounty: any; }) => {
    const county = row.userCounty;
    if (county) {
      counts[county] = (counts[county] || 0) + 1;
    }
  });
  return counts;
};

// Get pregnancy count by outcome
export const getPregnancyOutcomeStats = async () => {
  const pregnancies = await db.query.pregnanciesTable.findMany({
    columns: { outcome: true },
  });
  const stats: Record<string, number> = {};
pregnancies.forEach((p: { outcome: string | null; }) => {
    const outcome = p.outcome || "ongoing";
    stats[outcome] = (stats[outcome] || 0) + 1;
  });
  return stats;
};

// Get pregnancy counts by trimester
export const getPregnancyTrimesterStats = async () => {
  const pregnancies = await db.query.pregnanciesTable.findMany({
    columns: { currentTrimester: true },
  });
  const stats: Record<string, number> = { 1: 0, 2: 0, 3: 0 };
  pregnancies.forEach((p: { currentTrimester: any; }) => {
    if (p.currentTrimester) {
      stats[String(p.currentTrimester)] = (stats[String(p.currentTrimester)] || 0) + 1;
    }
  });
  return stats;
};

// Get delivery stats by month
export const getDeliveryStatsByMonth = async (months: number = 12) => {
  const pregnancies = await db.query.pregnanciesTable.findMany({
    where: eq(pregnanciesTable.outcome, "delivered" as any),
    columns: { deliveryDate: true },
  });
  
  const now = new Date();
  const stats: Record<string, number> = {};
  
  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    stats[key] = 0;
  }
  
  pregnancies.forEach((p: { deliveryDate: string | null; }) => {
    if (p.deliveryDate) {
      const date = new Date(p.deliveryDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (stats[key] !== undefined) {
        stats[key]++;
      }
    }
  });
  
  return stats;
};

// Get high-risk pregnancies (based on outcomes: miscarriage, terminated)
export const getHighRiskPregnancies = async () => {
  const data = await db.select({
    pregnancy: pregnanciesTable,
    userCounty: usersTable.county,
    userConstituency: usersTable.constituency,
    userWard: usersTable.ward,
  })
  .from(pregnanciesTable)
  .innerJoin(usersTable, eq(pregnanciesTable.userId, usersTable.id))
  .where(
    and(
      sql`${pregnanciesTable.outcome} IN ('miscarriage', 'terminated')`
    )
  );
  
  return data;
};

// Get risk count by location
export const getRiskCountByCounty = async () => {
  const highRiskData = await getHighRiskPregnancies();
  const counts: Record<string, number> = {};
  highRiskData.forEach((row: { userCounty: any; }) => {
    const county = row.userCounty;
    if (county) {
      counts[county] = (counts[county] || 0) + 1;
    }
  });
  return counts;
};