import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { pregnancyGuidanceTable } from "../drizzle/schema";
import { pregnancyGuidanceData } from "./guidance.data";

// Seed the guidance table - run once
export const seedGuidance = async () => {
  for (const week of pregnancyGuidanceData) {
    await db.insert(pregnancyGuidanceTable).values(week).onConflictDoNothing();
  }
  return "Guidance table seeded successfully 😎";
};

// Get all guidance ordered by week
export const getAllGuidance = async () => {
  return db
    .select()
    .from(pregnancyGuidanceTable)
    .orderBy(pregnancyGuidanceTable.weekNumber);
};

// Get guidance by week number
export const getGuidanceByWeek = async (weekNumber: number) => {
  const result = await db
    .select()
    .from(pregnancyGuidanceTable)
    .where(eq(pregnancyGuidanceTable.weekNumber, weekNumber));
  return result[0];
};

// Create new guidance entry
export const createGuidance = async (data: {
  weekNumber: number;
  title: string;
  summary: string;
  tips: string;
  source: string;
  link?: string;
}) => {
  const result = await db
    .insert(pregnancyGuidanceTable)
    .values(data)
    .returning();
  return result[0];
};

// Update existing guidance by id
export const updateGuidance = async (
  id: number,
  data: {
    title?: string;
    summary?: string;
    tips?: string;
    source?: string;
    link?: string;
  }
) => {
  const result = await db
    .update(pregnancyGuidanceTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(pregnancyGuidanceTable.id, id))
    .returning();
  return result[0] ?? null;
};

// Delete guidance by id
export const deleteGuidance = async (id: number) => {
  await db
    .delete(pregnancyGuidanceTable)
    .where(eq(pregnancyGuidanceTable.id, id));
};