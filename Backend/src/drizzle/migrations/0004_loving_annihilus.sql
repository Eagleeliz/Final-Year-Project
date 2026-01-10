ALTER TABLE "emergency_alerts" DROP CONSTRAINT "emergency_alerts_mother_id_mothers_id_fk";
--> statement-breakpoint
ALTER TABLE "emergency_contacts" DROP CONSTRAINT "emergency_contacts_mother_id_mothers_id_fk";
--> statement-breakpoint
ALTER TABLE "emergency_alerts" ALTER COLUMN "severity" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "emergency_alerts" ALTER COLUMN "severity" SET DEFAULT 'medium'::text;--> statement-breakpoint
DROP TYPE "public"."emergency_severity";--> statement-breakpoint
CREATE TYPE "public"."emergency_severity" AS ENUM('medium', 'high', 'critical');--> statement-breakpoint
ALTER TABLE "emergency_alerts" ALTER COLUMN "severity" SET DEFAULT 'medium'::"public"."emergency_severity";--> statement-breakpoint
ALTER TABLE "emergency_alerts" ALTER COLUMN "severity" SET DATA TYPE "public"."emergency_severity" USING "severity"::"public"."emergency_severity";--> statement-breakpoint
ALTER TABLE "emergency_alerts" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "emergency_contacts" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "emergency_alerts" ADD CONSTRAINT "emergency_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emergency_alerts" DROP COLUMN "mother_id";--> statement-breakpoint
ALTER TABLE "emergency_contacts" DROP COLUMN "mother_id";