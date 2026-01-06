import db from "../drizzle/db";
import { pregnanciesTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Create a pregnancy
export const createPregnancy = async (data: any) => {
  // Ensure only one active pregnancy per user
  if (!data.userId) throw new Error("userId is required");

  await db
    .update(pregnanciesTable)
    .set({ isActive: false })
    .where(eq(pregnanciesTable.userId, data.userId));

  const pregnancy = await db
    .insert(pregnanciesTable)
    .values(data)
    .returning();

  return pregnancy[0];
};

// Get all pregnancies for a user
export const getPregnanciesByUserId = async (userId: number) => {
  return db
    .select()
    .from(pregnanciesTable)
    .where(eq(pregnanciesTable.userId, userId));
};

// Get a single pregnancy by its ID
export const getPregnancyById = async (id: number) => {
  const pregnancy = await db
    .select()
    .from(pregnanciesTable)
    .where(eq(pregnanciesTable.id, id));

  return pregnancy[0];
};

// Update a pregnancy
export const updatePregnancy = async (id: number, data: any) => {
  const updated = await db
    .update(pregnanciesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(pregnanciesTable.id, id))
    .returning();

  return updated[0];
};

// Delete a pregnancy
export const deletePregnancy = async (id: number) => {
  await db
    .delete(pregnanciesTable)
    .where(eq(pregnanciesTable.id, id));

  return { message: "Pregnancy record deleted successfully" };
};
