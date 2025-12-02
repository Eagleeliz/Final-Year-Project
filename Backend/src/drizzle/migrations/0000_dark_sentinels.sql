CREATE TYPE "public"."alert_type" AS ENUM('bleeding', 'severe_pain', 'reduced_movements', 'high_fever', 'blurred_vision', 'severe_headache', 'water_break', 'contractions', 'other');--> statement-breakpoint
CREATE TYPE "public"."child_gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."emergency_severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."emergency_status" AS ENUM('pending', 'notified', 'responded', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."milestone_type" AS ENUM('motor', 'language', 'social', 'cognitive');--> statement-breakpoint
CREATE TYPE "public"."pregnancy_outcome" AS ENUM('ongoing', 'delivered', 'miscarriage', 'terminated');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('mother', 'health_worker', 'admin', 'policy_maker');--> statement-breakpoint
CREATE TABLE "ai_chat_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"user_query" text NOT NULL,
	"ai_response" text,
	"intent_detected" varchar(100),
	"confidence_score" numeric(3, 2),
	"is_emergency_trigger" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "child_milestones" (
	"id" serial PRIMARY KEY NOT NULL,
	"child_id" integer NOT NULL,
	"milestone_date" date DEFAULT now(),
	"age_months" numeric(4, 1),
	"milestone_type" "milestone_type",
	"milestone_description" text,
	"achieved" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "children" (
	"id" serial PRIMARY KEY NOT NULL,
	"mother_id" integer NOT NULL,
	"pregnancy_id" integer,
	"name" varchar(200),
	"gender" "child_gender",
	"date_of_birth" date NOT NULL,
	"birth_weight" numeric(5, 2),
	"birth_height" numeric(5, 2),
	"apgar_score" varchar(10),
	"blood_group" varchar(5),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "development_guide" (
	"id" serial PRIMARY KEY NOT NULL,
	"age_months" numeric(4, 1) NOT NULL,
	"milestone_type" "milestone_type" NOT NULL,
	"milestone_description" text NOT NULL,
	"is_critical" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "emergency_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"mother_id" integer NOT NULL,
	"pregnancy_id" integer,
	"alert_type" "alert_type" DEFAULT 'other',
	"severity" "emergency_severity" DEFAULT 'medium',
	"description" text,
	"location_lat" numeric(10, 8),
	"location_long" numeric(11, 8),
	"status" "emergency_status" DEFAULT 'pending',
	"responded_by" integer,
	"response_notes" text,
	"created_at" timestamp DEFAULT now(),
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "health_tips" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar(100) NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"target_trimester" integer,
	"target_age_months" numeric(4, 1),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "healthcare_facilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" varchar(50) NOT NULL,
	"county" varchar(100) NOT NULL,
	"sub_county" varchar(100),
	"ward" varchar(100),
	"address" text,
	"contact_phone" varchar(20),
	"emergency_phone" varchar(20),
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"services" text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mothers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"blood_group" varchar(5),
	"rh_factor" varchar(10),
	"known_allergies" text,
	"chronic_conditions" text[],
	"previous_pregnancies" integer DEFAULT 0,
	"previous_complications" text,
	"emergency_contact_name" varchar(200),
	"emergency_contact_phone" varchar(20),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) DEFAULT 'info',
	"is_read" boolean DEFAULT false,
	"related_id" integer,
	"related_type" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "pregnancies" (
	"id" serial PRIMARY KEY NOT NULL,
	"mother_id" integer NOT NULL,
	"lmp_date" date NOT NULL,
	"edd_date" date NOT NULL,
	"current_trimester" integer,
	"pregnancy_number" integer,
	"is_active" boolean DEFAULT true,
	"outcome" "pregnancy_outcome" DEFAULT 'ongoing',
	"delivery_date" date,
	"delivery_type" varchar(50),
	"birth_weight" numeric(5, 2),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trimester_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"trimester" integer NOT NULL,
	"week_start" integer NOT NULL,
	"week_end" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"symptoms" text[],
	"development_milestones" text[],
	"warning_signs" text[],
	"recommendations" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"password_hash" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"date_of_birth" date,
	"county" varchar(100),
	"sub_county" varchar(100),
	"village" varchar(100),
	"user_type" "user_type" DEFAULT 'mother',
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "weekly_checkins" (
	"id" serial PRIMARY KEY NOT NULL,
	"pregnancy_id" integer NOT NULL,
	"week_number" integer NOT NULL,
	"checkin_date" date DEFAULT now(),
	"nausea_level" integer,
	"fatigue_level" integer,
	"back_pain" boolean DEFAULT false,
	"headache" boolean DEFAULT false,
	"dizziness" boolean DEFAULT false,
	"swelling" boolean DEFAULT false,
	"vaginal_bleeding" boolean DEFAULT false,
	"blurred_vision" boolean DEFAULT false,
	"blood_pressure_systolic" integer,
	"blood_pressure_diastolic" integer,
	"weight" numeric(5, 2),
	"temperature" numeric(4, 1),
	"fetal_movements_count" integer,
	"fetal_movement_notes" text,
	"other_symptoms" text,
	"general_notes" text,
	"risk_flag" boolean DEFAULT false,
	"risk_reason" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_chat_logs" ADD CONSTRAINT "ai_chat_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_milestones" ADD CONSTRAINT "child_milestones_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_mother_id_mothers_id_fk" FOREIGN KEY ("mother_id") REFERENCES "public"."mothers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_pregnancy_id_pregnancies_id_fk" FOREIGN KEY ("pregnancy_id") REFERENCES "public"."pregnancies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emergency_alerts" ADD CONSTRAINT "emergency_alerts_mother_id_mothers_id_fk" FOREIGN KEY ("mother_id") REFERENCES "public"."mothers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emergency_alerts" ADD CONSTRAINT "emergency_alerts_pregnancy_id_pregnancies_id_fk" FOREIGN KEY ("pregnancy_id") REFERENCES "public"."pregnancies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emergency_alerts" ADD CONSTRAINT "emergency_alerts_responded_by_users_id_fk" FOREIGN KEY ("responded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mothers" ADD CONSTRAINT "mothers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pregnancies" ADD CONSTRAINT "pregnancies_mother_id_mothers_id_fk" FOREIGN KEY ("mother_id") REFERENCES "public"."mothers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_checkins" ADD CONSTRAINT "weekly_checkins_pregnancy_id_pregnancies_id_fk" FOREIGN KEY ("pregnancy_id") REFERENCES "public"."pregnancies"("id") ON DELETE cascade ON UPDATE no action;