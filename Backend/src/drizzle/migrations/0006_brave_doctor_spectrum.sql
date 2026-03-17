CREATE TABLE "clinic_reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"pregnancy_id" integer,
	"facility_id" integer,
	"title" varchar(200) NOT NULL,
	"reminder_type" varchar(100),
	"appointment_date" timestamp NOT NULL,
	"notes" text,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "children" RENAME COLUMN "mother_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "children" DROP CONSTRAINT "children_mother_id_mothers_id_fk";
--> statement-breakpoint
ALTER TABLE "clinic_reminders" ADD CONSTRAINT "clinic_reminders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic_reminders" ADD CONSTRAINT "clinic_reminders_pregnancy_id_pregnancies_id_fk" FOREIGN KEY ("pregnancy_id") REFERENCES "public"."pregnancies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinic_reminders" ADD CONSTRAINT "clinic_reminders_facility_id_healthcare_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."healthcare_facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "children" ADD CONSTRAINT "children_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;