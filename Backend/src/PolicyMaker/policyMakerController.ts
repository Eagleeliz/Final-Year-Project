import { Request, Response } from "express";
import { eq, and, inArray, sql } from "drizzle-orm";
import db from "../drizzle/db";
import {
  usersTable,
  pregnanciesTable,
  weeklyCheckinsTable,
} from "../drizzle/schema";

// ── Shared helper: build location WHERE filters for users ────────────────────
const buildLocationFilters = (county?: string, constituency?: string, ward?: string) => {
  const filters = [];
  if (county)       filters.push(eq(usersTable.county, county));
  if (constituency) filters.push(eq(usersTable.constituency, constituency));
  if (ward)         filters.push(eq(usersTable.ward, ward));
  return filters;
};

// ── GET /api/dashboard/national-summary ──────────────────────────────────────
export const getNationalSummary = async (req: Request, res: Response) => {
  try {
    const { county, constituency, ward } = req.query as {
      county?: string;
      constituency?: string;
      ward?: string;
    };

    const filters = buildLocationFilters(county, constituency, ward);
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const users = await db.select().from(usersTable).where(whereClause);
    const userIds = users.map((u) => u.id);

    if (userIds.length === 0) {
      return res.json({
        totalUsers: 0, totalPregnancies: 0, activePregnancies: 0,
        delivered: 0, miscarriage: 0, terminated: 0,
        mothers: 0, healthWorkers: 0, policymakers: 0,
      });
    }

    const pregnancies = await db
      .select()
      .from(pregnanciesTable)
      .where(inArray(pregnanciesTable.userId, userIds));

    return res.json({
      totalUsers:        users.length,
      totalPregnancies:  pregnancies.length,
      activePregnancies: pregnancies.filter((p) => p.isActive).length,
      delivered:         pregnancies.filter((p) => p.outcome === "delivered").length,
      miscarriage:       pregnancies.filter((p) => p.outcome === "miscarriage").length,
      terminated:        pregnancies.filter((p) => p.outcome === "terminated").length,
      mothers:           users.filter((u) => u.userType === "mother").length,
      healthWorkers:     users.filter((u) => u.userType === "health_worker").length,
      policymakers:      users.filter((u) => u.userType === "policy_maker").length,
    });
  } catch (error: any) {
    console.error("getNationalSummary error:", error.message);
    return res.status(500).json({ error: "Failed to fetch national summary" });
  }
};

// ── GET /api/dashboard/risk-trends ───────────────────────────────────────────
// Supports ?county=&constituency=&ward= to filter risk cases by location
export const getRiskTrends = async (req: Request, res: Response) => {
  try {
    const { county, constituency, ward } = req.query as {
      county?: string;
      constituency?: string;
      ward?: string;
    };

    // Step 1: users matching location (or all users)
    const filters = buildLocationFilters(county, constituency, ward);
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const users = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(whereClause);

    const userIds = users.map((u) => u.id);

    if (userIds.length === 0) {
      return res.json({ highRiskPregnancies: 0, riskFlaggedCheckins: 0, riskCases: [] });
    }

    // Step 2: pregnancies for those users
    const pregnancies = await db
      .select({ id: pregnanciesTable.id, userId: pregnanciesTable.userId })
      .from(pregnanciesTable)
      .where(inArray(pregnanciesTable.userId, userIds));

    const pregnancyIds = pregnancies.map((p) => p.id);

    if (pregnancyIds.length === 0) {
      return res.json({ highRiskPregnancies: 0, riskFlaggedCheckins: 0, riskCases: [] });
    }

    // Step 3: risk-flagged check-ins for those pregnancies only
    const riskFlaggedCheckins = await db
      .select()
      .from(weeklyCheckinsTable)
      .where(
        and(
          eq(weeklyCheckinsTable.riskFlag, true),
          inArray(weeklyCheckinsTable.pregnancyId, pregnancyIds)
        )
      );

    // Step 4: deduplicate by pregnancyId for the detailed risk case list
    const pregnancyMap = new Map(pregnancies.map((p) => [p.id, p.userId]));
    const seenPregnancies = new Set<number>();
    const riskCases: any[] = [];

    for (const checkin of riskFlaggedCheckins) {
      if (seenPregnancies.has(checkin.pregnancyId)) continue;
      seenPregnancies.add(checkin.pregnancyId);

      riskCases.push({
        pregnancyId:     checkin.pregnancyId,
        userId:          pregnancyMap.get(checkin.pregnancyId),
        weekNumber:      checkin.weekNumber,
        riskReason:      checkin.riskReason ?? "Not specified",
        checkinDate:     checkin.checkinDate,
        vaginalBleeding: checkin.vaginalBleeding,
        blurredVision:   checkin.blurredVision,
        severeHeadache:  checkin.headache,
        dizziness:       checkin.dizziness,
        swelling:        checkin.swelling,
      });
    }

    return res.json({
      highRiskPregnancies: seenPregnancies.size,
      riskFlaggedCheckins: riskFlaggedCheckins.length,
      riskCases,
    });
  } catch (error: any) {
    console.error("getRiskTrends error:", error.message);
    return res.status(500).json({ error: "Failed to fetch risk trends" });
  }
};

// ── GET /api/dashboard/stats ──────────────────────────────────────────────────
// Returns all 12 calendar months Jan–Dec for the current year
// Zero-fills months with no registrations
export const getStats = async (_req: Request, res: Response) => {
  try {
    const rows = await db.execute(sql`
      SELECT
        DATE_TRUNC('month', created_at) AS month_start,
        COUNT(*)::int                       AS count
      FROM users
      WHERE created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '11 months'
        AND created_at <  DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `);

    // Map DB results: key = "2025-01", value = count
    const dbMap = new Map<string, number>();
    for (const row of rows.rows as { month_start: Date; count: number }[]) {
      const d = new Date(row.month_start);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      dbMap.set(key, row.count);
    }

    // Build all 12 months Jan–Dec, zero-filling gaps
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const result: { month: string; count: number }[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      result.push({ month: MONTHS[d.getMonth()], count: dbMap.get(key) ?? 0 });
    }

    return res.json({ userRegistrationStats: result });
  } catch (error: any) {
    console.error("getStats error:", error.message);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// ── GET /api/dashboard/county-breakdown ──────────────────────────────────────
// Each county only counts users whose stored `county` column exactly matches
export const getCountyBreakdown = async (_req: Request, res: Response) => {
  try {
    const rows = await db.execute(sql`
      SELECT
        u.county,
        COUNT(DISTINCT u.id)::int                                                    AS users,
        COUNT(DISTINCT p.id)::int                                                    AS pregnancies,
        COUNT(DISTINCT CASE WHEN u.user_type = 'mother'        THEN u.id END)::int  AS mothers,
        COUNT(DISTINCT CASE WHEN u.user_type = 'health_worker' THEN u.id END)::int  AS "healthWorkers",
        COUNT(DISTINCT CASE WHEN wc.risk_flag = true THEN wc.id END)::int           AS "riskCases"
      FROM users u
      LEFT JOIN pregnancies p       ON p.user_id       = u.id
      LEFT JOIN weekly_checkins wc  ON wc.pregnancy_id = p.id
      WHERE u.county IS NOT NULL
        AND TRIM(u.county) != ''
      GROUP BY u.county
      ORDER BY users DESC
    `);

    return res.json(rows.rows);
  } catch (error: any) {
    console.error("getCountyBreakdown error:", error.message);
    return res.status(500).json({ error: "Failed to fetch county breakdown" });
  }
};

// ── GET /api/dashboard/users-by-location ─────────────────────────────────────
// Strict filtering — only returns users whose stored location fields match exactly
// ?county=Nairobi
// ?county=Nairobi&constituency=Westlands
// ?county=Nairobi&constituency=Westlands&ward=Parklands
export const getUsersByLocation = async (req: Request, res: Response) => {
  try {
    const { county, constituency, ward } = req.query as {
      county?: string;
      constituency?: string;
      ward?: string;
    };

    const filters = buildLocationFilters(county, constituency, ward);
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const users = await db
      .select({
        id:           usersTable.id,
        firstName:    usersTable.firstName,
        lastName:     usersTable.lastName,
        email:        usersTable.email,
        phone:        usersTable.phone,
        userType:     usersTable.userType,
        county:       usersTable.county,
        constituency: usersTable.constituency,
        ward:         usersTable.ward,
        createdAt:    usersTable.createdAt,
      })
      .from(usersTable)
      .where(whereClause);

    return res.json(users);
  } catch (error: any) {
    console.error("getUsersByLocation error:", error.message);
    return res.status(500).json({ error: "Failed to fetch users by location" });
  }
};