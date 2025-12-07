import db from "../drizzle/db.js";
import { desc, eq, and } from "drizzle-orm";
import { 
  weeklyCheckinsTable,
  pregnanciesTable,
  type WeeklyCheckin,
  type NewWeeklyCheckin
} from "../drizzle/schema.js";

// Get all weekly check-ins
export const getWeeklyCheckinsService = async (): Promise<WeeklyCheckin[] | null> => {
  try {
    const checkins = await db.select()
      .from(weeklyCheckinsTable)
      .orderBy(desc(weeklyCheckinsTable.weekNumber));
    
    return checkins.length > 0 ? checkins : null;
  } catch (error) {
    throw new Error(`Failed to fetch weekly check-ins: ${error}`);
  }
};

// Get weekly check-in by ID
export const getWeeklyCheckinByIdService = async (
  checkinId: number
): Promise<WeeklyCheckin | undefined> => {
  try {
    const [checkin] = await db.select()
      .from(weeklyCheckinsTable)
      .where(eq(weeklyCheckinsTable.id, checkinId))
      .limit(1);
    
    return checkin;
  } catch (error) {
    throw new Error(`Failed to fetch check-in: ${error}`);
  }
};

// Get weekly check-ins for a pregnancy
export const getWeeklyCheckinsForPregnancyService = async (
  pregnancyId: number
): Promise<WeeklyCheckin[] | null> => {
  try {
    const checkins = await db.select()
      .from(weeklyCheckinsTable)
      .where(eq(weeklyCheckinsTable.pregnancyId, pregnancyId))
      .orderBy(desc(weeklyCheckinsTable.weekNumber));
    
    return checkins.length > 0 ? checkins : null;
  } catch (error) {
    throw new Error(`Failed to fetch check-ins for pregnancy: ${error}`);
  }
};

// Get weekly check-in by pregnancy and week number
export const getWeeklyCheckinByWeekService = async (
  pregnancyId: number,
  weekNumber: number
): Promise<WeeklyCheckin | undefined> => {
  try {
    const [checkin] = await db.select()
      .from(weeklyCheckinsTable)
      .where(
        and(
          eq(weeklyCheckinsTable.pregnancyId, pregnancyId),
          eq(weeklyCheckinsTable.weekNumber, weekNumber)
        )
      )
      .limit(1);
    
    return checkin;
  } catch (error) {
    throw new Error(`Failed to fetch check-in: ${error}`);
  }
};

// Create new weekly check-in
export const createWeeklyCheckinService = async (
  data: NewWeeklyCheckin
): Promise<WeeklyCheckin> => {
  try {
    // Check if pregnancy exists
    const [pregnancy] = await db.select()
      .from(pregnanciesTable)
      .where(eq(pregnanciesTable.id, data.pregnancyId))
      .limit(1);
    
    if (!pregnancy) {
      throw new Error("Pregnancy not found");
    }
    
    // Check for duplicate week check-in
    const existing = await getWeeklyCheckinByWeekService(
      data.pregnancyId,
      data.weekNumber
    );
    
    if (existing) {
      throw new Error(`Check-in already exists for week ${data.weekNumber}`);
    }
    
    // Perform risk assessment
    const riskAssessment = assessRisk(data);
    const checkinData = {
      ...data,
      riskFlag: riskAssessment.level === "high",
      riskReason: riskAssessment.reasons.join(", ")
    };
    
    const [checkin] = await db.insert(weeklyCheckinsTable)
      .values(checkinData)
      .returning();
    
    return checkin;
  } catch (error) {
    throw new Error(`Failed to create check-in: ${error}`);
  }
};

// Update weekly check-in
export const updateWeeklyCheckinService = async (
  checkinId: number,
  data: Partial<NewWeeklyCheckin>
): Promise<WeeklyCheckin | undefined> => {
  try {
    // Get current check-in
    const current = await getWeeklyCheckinByIdService(checkinId);
    
    if (!current) {
      throw new Error("Check-in not found");
    }
    
    // Re-assess risk with updated data
    const updatedData = { ...current, ...data } as NewWeeklyCheckin;
    const riskAssessment = assessRisk(updatedData);
    
    const updateData = {
      ...data,
      riskFlag: riskAssessment.level === "high",
      riskReason: riskAssessment.reasons.join(", ")
    };
    
    const [updated] = await db.update(weeklyCheckinsTable)
      .set(updateData)
      .where(eq(weeklyCheckinsTable.id, checkinId))
      .returning();
    
    return updated;
  } catch (error) {
    throw new Error(`Failed to update check-in: ${error}`);
  }
};

// Delete weekly check-in
export const deleteWeeklyCheckinService = async (
  checkinId: number
): Promise<WeeklyCheckin | undefined> => {
  try {
    const [deleted] = await db.delete(weeklyCheckinsTable)
      .where(eq(weeklyCheckinsTable.id, checkinId))
      .returning();
    
    return deleted;
  } catch (error) {
    throw new Error(`Failed to delete check-in: ${error}`);
  }
};

// Get weekly summary for pregnancy
export const getWeeklySummaryService = async (
  pregnancyId: number
): Promise<any[]> => {
  try {
    const checkins = await getWeeklyCheckinsForPregnancyService(pregnancyId);
    
    if (!checkins) {
      return [];
    }
    
    return checkins.map(checkin => ({
      weekNumber: checkin.weekNumber,
      checkinDate: checkin.checkinDate,
      symptomsCount: countSymptoms(checkin),
      hasWarningSigns: hasWarningSigns(checkin),
      riskFlag: checkin.riskFlag,
      riskLevel: assessRisk(checkin).level
    }));
  } catch (error) {
    throw new Error(`Failed to get weekly summary: ${error}`);
  }
};

// ========== HELPER FUNCTIONS ==========

// Risk assessment for maternal health
const assessRisk = (data: any): {
  level: "low" | "medium" | "high";
  reasons: string[];
  recommendations: string[];
} => {
  const reasons: string[] = [];
  const recommendations: string[] = [];

  // Emergency signs (HIGH RISK)
  if (data.vaginalBleeding) {
    reasons.push("Vaginal bleeding detected");
    recommendations.push("Seek immediate medical attention");
  }

  if (data.blurredVision) {
    reasons.push("Blurred vision (possible preeclampsia)");
    recommendations.push("Check blood pressure immediately");
  }

  // High blood pressure
  if (data.bloodPressureSystolic >= 140 || data.bloodPressureDiastolic >= 90) {
    reasons.push("High blood pressure");
    recommendations.push("Monitor BP regularly, reduce salt intake");
  }

  // Reduced fetal movements
  if (data.fetalMovementsCount && data.fetalMovementsCount < 10) {
    reasons.push("Reduced fetal movements");
    recommendations.push("Drink cold water, lie on left side, monitor for 2 hours");
  }

  // Fever
  if (data.temperature && data.temperature > 37.5) {
    reasons.push("Elevated temperature");
    recommendations.push("Rest, hydrate, monitor for other symptoms");
  }

  // Determine risk level
  let level: "low" | "medium" | "high" = "low";
  
  if (data.vaginalBleeding || data.blurredVision) {
    level = "high";
  } else if (reasons.length > 0) {
    level = "medium";
  } else {
    level = "low";
    recommendations.push("Continue regular checkups and healthy lifestyle");
  }

  return { level, reasons, recommendations };
};

// Count symptoms
const countSymptoms = (checkin: WeeklyCheckin): number => {
  let count = 0;
  
  // Boolean symptoms
  if (checkin.backPain) count++;
  if (checkin.headache) count++;
  if (checkin.dizziness) count++;
  if (checkin.swelling) count++;
  if (checkin.vaginalBleeding) count++;
  if (checkin.blurredVision) count++;
  
  // Scaled symptoms if moderate or severe (3-5)
  if (checkin.nauseaLevel && checkin.nauseaLevel >= 3) count++;
  if (checkin.fatigueLevel && checkin.fatigueLevel >= 3) count++;
  
  return count;
};

// Check for warning signs
const hasWarningSigns = (checkin: WeeklyCheckin): boolean => {
  return !!(
    checkin.vaginalBleeding || 
    checkin.blurredVision || 
    (checkin.bloodPressureSystolic && checkin.bloodPressureSystolic >= 140) ||
    (checkin.fetalMovementsCount && checkin.fetalMovementsCount < 10)
  );
};