import db from "../drizzle/db";
import { pregnanciesTable } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

// Create a pregnancy
export const createPregnancy = async (data: any) => {
  if (!data.userId) throw new Error("userId is required");

  // Ensure only one active pregnancy per user
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

// ✅ Get ALL pregnancies WITH user info
export const getAllPregnancies = async () => {
  return db.query.pregnanciesTable.findMany({
    with: {
      user: {
        columns: {
          passwordHash: false
        }
      }
    },
    orderBy: [desc(pregnanciesTable.createdAt)]
  });
};

// ✅ Get pregnancies for ONE user (with user info)
export const getPregnanciesByUserId = async (userId: number) => {
  return db.query.pregnanciesTable.findMany({
    where: eq(pregnanciesTable.userId, userId),
    with: {
      user: {
        columns: {
          passwordHash: false
        }
      }
    }
  });
};

// Get a single pregnancy by ID (with user)
export const getPregnancyById = async (id: number) => {
  const pregnancy = await db.query.pregnanciesTable.findFirst({
    where: eq(pregnanciesTable.id, id),
    with: {
      user: {
        columns: {
          passwordHash: false
        }
      }
    }
  });

  return pregnancy;
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
