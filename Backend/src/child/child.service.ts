import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { childrenTable } from "../drizzle/schema";

// ── Types ─────────────────────────────────────────────────────

interface CreateChildInput {
  userId: number;
  pregnancyId?: number;
  name?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth: string;
  birthWeight?: number;
  birthHeight?: number;
  apgarScore?: string;
  bloodGroup?: string;
}

interface UpdateChildInput {
  name?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  birthWeight?: number;
  birthHeight?: number;
  apgarScore?: string;
  bloodGroup?: string;
}

// ── Service functions ─────────────────────────────────────────

// Create a new child record linked to userId
export const createChild = async (data: CreateChildInput) => {
  const result = await db
    .insert(childrenTable)
    .values({
      userId: data.userId,
      pregnancyId: data.pregnancyId,
      name: data.name,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      birthWeight: data.birthWeight?.toString(),
      birthHeight: data.birthHeight?.toString(),
      apgarScore: data.apgarScore,
      bloodGroup: data.bloodGroup,
    })
    .returning();
  return result[0];
};

// Get all children belonging to a user
export const getChildrenByUser = async (userId: number) => {
  return db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.userId, userId));
};

// Get a single child by their id
export const getChildById = async (id: number) => {
  const result = await db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.id, id));
  return result[0] ?? null;
};

// Update a child record
export const updateChild = async (id: number, data: UpdateChildInput) => {
  const result = await db
    .update(childrenTable)
    .set({
      ...(data.name       && { name: data.name }),
      ...(data.gender     && { gender: data.gender }),
      ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
      ...(data.birthWeight && { birthWeight: data.birthWeight.toString() }),
      ...(data.birthHeight && { birthHeight: data.birthHeight.toString() }),
      ...(data.apgarScore  && { apgarScore: data.apgarScore }),
      ...(data.bloodGroup  && { bloodGroup: data.bloodGroup }),
    })
    .where(eq(childrenTable.id, id))
    .returning();
  return result[0] ?? null;
};

// Delete a child record
export const deleteChild = async (id: number) => {
  await db
    .delete(childrenTable)
    .where(eq(childrenTable.id, id));
};