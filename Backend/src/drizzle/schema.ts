import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  numeric,
  date,
  pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================
// Enums
// ============================

export const userTypeEnum = pgEnum("user_type", [
  "mother",
  "health_worker", 
  "admin",
  "policy_maker"
]);

export const pregnancyOutcomeEnum = pgEnum("pregnancy_outcome", [
  "ongoing",
  "delivered",
  "miscarriage",
  "terminated"
]);

export const emergencySeverityEnum = pgEnum("emergency_severity", [
  "low",
  "medium",
  "high",
  "critical"
]);

export const emergencyStatusEnum = pgEnum("emergency_status", [
  "pending",
  "notified",
  "responded",
  "resolved"
]);

export const childGenderEnum = pgEnum("child_gender", [
  "male",
  "female",
  "other"
]);

export const milestoneTypeEnum = pgEnum("milestone_type", [
  "motor",
  "language", 
  "social",
  "cognitive"
]);

export const alertTypeEnum = pgEnum("alert_type", [
  "bleeding",
  "severe_pain",
  "reduced_movements",
  "high_fever",
  "blurred_vision",
  "severe_headache",
  "water_break",
  "contractions",
  "other"
]);

// ============================
// Users Table
// ============================

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  dateOfBirth: date("date_of_birth"),
  county: varchar("county", { length: 100 }),
  subCounty: varchar("sub_county", { length: 100 }),
  village: varchar("village", { length: 100 }),
  userType: userTypeEnum("user_type").default("mother"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// ============================
// Mothers Table
// ============================

export const mothersTable = pgTable("mothers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  bloodGroup: varchar("blood_group", { length: 5 }),
  rhFactor: varchar("rh_factor", { length: 10 }),
  knownAllergies: text("known_allergies"),
  chronicConditions: text("chronic_conditions").array(),
  previousPregnancies: integer("previous_pregnancies").default(0),
  previousComplications: text("previous_complications"),
  emergencyContactName: varchar("emergency_contact_name", { length: 200 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow()
});

// ============================
// Pregnancies Table
// ============================

export const pregnanciesTable = pgTable("pregnancies", {
  id: serial("id").primaryKey(),
  motherId: integer("mother_id")
    .references(() => mothersTable.id, { onDelete: "cascade" })
    .notNull(),
  lmpDate: date("lmp_date").notNull(), // Last Menstrual Period
  eddDate: date("edd_date").notNull(), // Estimated Due Date
  currentTrimester: integer("current_trimester").$type<1 | 2 | 3>(),
  pregnancyNumber: integer("pregnancy_number"),
  isActive: boolean("is_active").default(true),
  outcome: pregnancyOutcomeEnum("outcome").default("ongoing"),
  deliveryDate: date("delivery_date"),
  deliveryType: varchar("delivery_type", { length: 50 }),
  birthWeight: numeric("birth_weight", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// ============================
// Weekly Check-ins Table
// ============================

export const weeklyCheckinsTable = pgTable("weekly_checkins", {
  id: serial("id").primaryKey(),
  pregnancyId: integer("pregnancy_id")
    .references(() => pregnanciesTable.id, { onDelete: "cascade" })
    .notNull(),
  weekNumber: integer("week_number").notNull(),
  checkinDate: date("checkin_date").defaultNow(),
  
  // Symptoms (scale 1-5)
  nauseaLevel: integer("nausea_level").$type<1 | 2 | 3 | 4 | 5>(),
  fatigueLevel: integer("fatigue_level").$type<1 | 2 | 3 | 4 | 5>(),
  backPain: boolean("back_pain").default(false),
  headache: boolean("headache").default(false),
  dizziness: boolean("dizziness").default(false),
  swelling: boolean("swelling").default(false),
  vaginalBleeding: boolean("vaginal_bleeding").default(false),
  blurredVision: boolean("blurred_vision").default(false),
  
  // Vital signs
  bloodPressureSystolic: integer("blood_pressure_systolic"),
  bloodPressureDiastolic: integer("blood_pressure_diastolic"),
  weight: numeric("weight", { precision: 5, scale: 2 }),
  temperature: numeric("temperature", { precision: 4, scale: 1 }),
  
  // Fetal movements
  fetalMovementsCount: integer("fetal_movements_count"),
  fetalMovementNotes: text("fetal_movement_notes"),
  
  // Custom notes
  otherSymptoms: text("other_symptoms"),
  generalNotes: text("general_notes"),
  
  // Risk flag
  riskFlag: boolean("risk_flag").default(false),
  riskReason: text("risk_reason"),
  
  createdAt: timestamp("created_at").defaultNow()
});

// ============================
// Emergency Alerts Table
// ============================

export const emergencyAlertsTable = pgTable("emergency_alerts", {
  id: serial("id").primaryKey(),
  motherId: integer("mother_id")
    .references(() => mothersTable.id, { onDelete: "cascade" })
    .notNull(),
  pregnancyId: integer("pregnancy_id")
    .references(() => pregnanciesTable.id),
  alertType: alertTypeEnum("alert_type").default("other"),
  severity: emergencySeverityEnum("severity").default("medium"),
  description: text("description"),
  locationLat: numeric("location_lat", { precision: 10, scale: 8 }),
  locationLong: numeric("location_long", { precision: 11, scale: 8 }),
  status: emergencyStatusEnum("status").default("pending"),
  respondedBy: integer("responded_by")
    .references(() => usersTable.id),
  responseNotes: text("response_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at")
});

// ============================
// Children Table
// ============================

export const childrenTable = pgTable("children", {
  id: serial("id").primaryKey(),
  motherId: integer("mother_id")
    .references(() => mothersTable.id, { onDelete: "cascade" })
    .notNull(),
  pregnancyId: integer("pregnancy_id")
    .references(() => pregnanciesTable.id),
  name: varchar("name", { length: 200 }),
  gender: childGenderEnum("gender"),
  dateOfBirth: date("date_of_birth").notNull(),
  birthWeight: numeric("birth_weight", { precision: 5, scale: 2 }),
  birthHeight: numeric("birth_height", { precision: 5, scale: 2 }),
  apgarScore: varchar("apgar_score", { length: 10 }),
  bloodGroup: varchar("blood_group", { length: 5 }),
  createdAt: timestamp("created_at").defaultNow()
});

// ============================
// Child Milestones Table
// ============================

export const childMilestonesTable = pgTable("child_milestones", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .references(() => childrenTable.id, { onDelete: "cascade" })
    .notNull(),
  milestoneDate: date("milestone_date").defaultNow(),
  ageMonths: numeric("age_months", { precision: 4, scale: 1 }),
  milestoneType: milestoneTypeEnum("milestone_type"),
  milestoneDescription: text("milestone_description"),
  achieved: boolean("achieved").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

// ============================
// AI Chat Logs Table
// ============================

export const aiChatLogsTable = pgTable("ai_chat_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => usersTable.id),
  userQuery: text("user_query").notNull(),
  aiResponse: text("ai_response"),
  intentDetected: varchar("intent_detected", { length: 100 }),
  confidenceScore: numeric("confidence_score", { precision: 3, scale: 2 }),
  isEmergencyTrigger: boolean("is_emergency_trigger").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// ============================
// Trimester Information Table (Reference Data)
// ============================

export const trimesterInfoTable = pgTable("trimester_info", {
  id: serial("id").primaryKey(),
  trimester: integer("trimester").notNull(),
  weekStart: integer("week_start").notNull(),
  weekEnd: integer("week_end").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  symptoms: text("symptoms").array(),
  developmentMilestones: text("development_milestones").array(),
  warningSigns: text("warning_signs").array(),
  recommendations: text("recommendations").array(),
  createdAt: timestamp("created_at").defaultNow()
});

// ============================
// Child Development Guide Table (Reference Data)
// ============================

export const developmentGuideTable = pgTable("development_guide", {
  id: serial("id").primaryKey(),
  ageMonths: numeric("age_months", { precision: 4, scale: 1 }).notNull(),
  milestoneType: milestoneTypeEnum("milestone_type").notNull(),
  milestoneDescription: text("milestone_description").notNull(),
  isCritical: boolean("is_critical").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

// ============================
// Notifications Table
// ============================

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("info"), // info, warning, emergency, reminder
  isRead: boolean("is_read").default(false),
  relatedId: integer("related_id"), // Can link to pregnancy, checkin, emergency, etc.
  relatedType: varchar("related_type", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at")
});

// ============================
// Health Tips Table
// ============================

export const healthTipsTable = pgTable("health_tips", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 100 }).notNull(), // pregnancy, postnatal, newborn, toddler
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  targetTrimester: integer("target_trimester"), // 1, 2, 3, or null for general
  targetAgeMonths: numeric("target_age_months", { precision: 4, scale: 1 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// ============================
// Hospital/Clinic Reference Table
// ============================

export const healthcareFacilitiesTable = pgTable("healthcare_facilities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // hospital, clinic, health_center
  county: varchar("county", { length: 100 }).notNull(),
  subCounty: varchar("sub_county", { length: 100 }),
  ward: varchar("ward", { length: 100 }),
  address: text("address"),
  contactPhone: varchar("contact_phone", { length: 20 }),
  emergencyPhone: varchar("emergency_phone", { length: 20 }),
  latitude: numeric("latitude", { precision: 10, scale: 8 }),
  longitude: numeric("longitude", { precision: 11, scale: 8 }),
  services: text("services").array(), // maternity, emergency, pediatric, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// ============================
// Relations (Optional - for complex queries)
// ============================

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  mother: one(mothersTable, {
    fields: [usersTable.id],
    references: [mothersTable.userId]
  }),
  emergenciesResponded: many(emergencyAlertsTable, {
    relationName: "responded_emergencies"
  }),
  chatLogs: many(aiChatLogsTable),
  notifications: many(notificationsTable)
}));

export const mothersRelations = relations(mothersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [mothersTable.userId],
    references: [usersTable.id]
  }),
  pregnancies: many(pregnanciesTable),
  children: many(childrenTable),
  emergencies: many(emergencyAlertsTable)
}));

export const pregnanciesRelations = relations(pregnanciesTable, ({ one, many }) => ({
  mother: one(mothersTable, {
    fields: [pregnanciesTable.motherId],
    references: [mothersTable.id]
  }),
  checkins: many(weeklyCheckinsTable),
  emergencies: many(emergencyAlertsTable),
  children: many(childrenTable)
}));

export const childrenRelations = relations(childrenTable, ({ one, many }) => ({
  mother: one(mothersTable, {
    fields: [childrenTable.motherId],
    references: [mothersTable.id]
  }),
  pregnancy: one(pregnanciesTable, {
    fields: [childrenTable.pregnancyId],
    references: [pregnanciesTable.id]
  }),
  milestones: many(childMilestonesTable)
}));

// ============================
// Type Definitions (Optional but helpful)
// ============================

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Mother = typeof mothersTable.$inferSelect;
export type NewMother = typeof mothersTable.$inferInsert;

export type Pregnancy = typeof pregnanciesTable.$inferSelect;
export type NewPregnancy = typeof pregnanciesTable.$inferInsert;

export type WeeklyCheckin = typeof weeklyCheckinsTable.$inferSelect;
export type NewWeeklyCheckin = typeof weeklyCheckinsTable.$inferInsert;

export type EmergencyAlert = typeof emergencyAlertsTable.$inferSelect;
export type NewEmergencyAlert = typeof emergencyAlertsTable.$inferInsert;

export type Child = typeof childrenTable.$inferSelect;
export type NewChild = typeof childrenTable.$inferInsert;

export type ChildMilestone = typeof childMilestonesTable.$inferSelect;
export type NewChildMilestone = typeof childMilestonesTable.$inferInsert;

export type AIChatLog = typeof aiChatLogsTable.$inferSelect;
export type NewAIChatLog = typeof aiChatLogsTable.$inferInsert;

export type Notification = typeof notificationsTable.$inferSelect;
export type NewNotification = typeof notificationsTable.$inferInsert;

export type HealthTip = typeof healthTipsTable.$inferSelect;
export type NewHealthTip = typeof healthTipsTable.$inferInsert;

export type HealthcareFacility = typeof healthcareFacilitiesTable.$inferSelect;
export type NewHealthcareFacility = typeof healthcareFacilitiesTable.$inferInsert;