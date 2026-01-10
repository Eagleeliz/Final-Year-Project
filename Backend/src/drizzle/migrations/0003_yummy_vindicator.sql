CREATE TABLE "emergency_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"mother_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"relationship" varchar(50),
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_mother_id_mothers_id_fk" FOREIGN KEY ("mother_id") REFERENCES "public"."mothers"("id") ON DELETE cascade ON UPDATE no action;