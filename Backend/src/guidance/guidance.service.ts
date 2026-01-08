// src/guidance/guidance.service.ts
import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { pregnancyGuidanceTable } from "../drizzle/schema";
import { pregnancyGuidanceData } from "./guidance.data";

// Seed the guidance table
export const seedGuidance = async () => {
  for (const week of pregnancyGuidanceData) {
    await db.insert(pregnancyGuidanceTable).values(week).onConflictDoNothing();
  }
  return "Guidance table seeded successfully 😎";
};

// Get all guidance
export const getAllGuidance = async () => {
  return db.select().from(pregnancyGuidanceTable).orderBy(pregnancyGuidanceTable.weekNumber);
};

// Get guidance by week
export const getGuidanceByWeek = async (weekNumber: number) => {
  const result = await db
  .select()
  .from(pregnancyGuidanceTable)
  .where(eq(pregnancyGuidanceTable.weekNumber, weekNumber))
  return result[0];
};
