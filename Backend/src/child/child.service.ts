import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { childrenTable, childMilestonesTable } from "../drizzle/schema";

// Types

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

interface CreateMilestoneInput {
  childId: number;
  milestoneType?: "motor" | "language" | "social" | "cognitive";
  milestoneDescription?: string;
  ageMonths?: number;
  achieved?: boolean;
  notes?: string;
  milestoneDate?: string;
}

interface UpdateMilestoneInput {
  milestoneType?: "motor" | "language" | "social" | "cognitive";
  milestoneDescription?: string;
  ageMonths?: number;
  achieved?: boolean;
  notes?: string;
  milestoneDate?: string;
}

// Helper functions

export const calcAgeMonths = (dateOfBirth: string): number => {
  const birth = new Date(dateOfBirth);
  const now = new Date();
  return (
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth())
  );
};

// Child service functions

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

export const getChildrenByUser = async (userId: number) => {
  return db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.userId, userId));
};

export const getChildById = async (id: number) => {
  const result = await db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.id, id));
  return result[0] ?? null;
};

export const updateChild = async (id: number, data: UpdateChildInput) => {
  const result = await db
    .update(childrenTable)
    .set({
      ...(data.name        && { name: data.name }),
      ...(data.gender      && { gender: data.gender }),
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

export const deleteChild = async (id: number) => {
  await db.delete(childrenTable).where(eq(childrenTable.id, id));
};

// Milestone service functions

export const createMilestone = async (data: CreateMilestoneInput) => {
  // Calculate age in months from date of birth
  let ageMonths = data.ageMonths;
  if (ageMonths === undefined) {
    const child = await getChildById(data.childId);
    if (child) ageMonths = calcAgeMonths(child.dateOfBirth);
  }

  const result = await db
    .insert(childMilestonesTable)
    .values({
      childId: data.childId,
      milestoneType: data.milestoneType,
      milestoneDescription: data.milestoneDescription,
      ageMonths: ageMonths?.toString(),
      achieved: data.achieved ?? false,
      notes: data.notes,
      milestoneDate:
        data.milestoneDate ?? new Date().toISOString().split("T")[0],
    })
    .returning();
  return result[0];
};

export const getMilestonesByChild = async (childId: number) => {
  return db
    .select()
    .from(childMilestonesTable)
    .where(eq(childMilestonesTable.childId, childId));
};

export const getMilestoneById = async (id: number) => {
  const result = await db
    .select()
    .from(childMilestonesTable)
    .where(eq(childMilestonesTable.id, id));
  return result[0] ?? null;
};

export const updateMilestone = async (id: number, data: UpdateMilestoneInput) => {
  const result = await db
    .update(childMilestonesTable)
    .set({
      ...(data.milestoneType        && { milestoneType: data.milestoneType }),
      ...(data.milestoneDescription && { milestoneDescription: data.milestoneDescription }),
      ...(data.ageMonths  !== undefined && { ageMonths: data.ageMonths.toString() }),
      ...(data.achieved   !== undefined && { achieved: data.achieved }),
      ...(data.notes      !== undefined && { notes: data.notes }),
      ...(data.milestoneDate         && { milestoneDate: data.milestoneDate }),
    })
    .where(eq(childMilestonesTable.id, id))
    .returning();
  return result[0] ?? null;
};

export const deleteMilestone = async (id: number) => {
  await db.delete(childMilestonesTable).where(eq(childMilestonesTable.id, id));
};