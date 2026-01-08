CREATE TABLE "pregnancy_guidance" (
	"id" serial PRIMARY KEY NOT NULL,
	"week_number" integer NOT NULL,
	"title" varchar(100) NOT NULL,
	"summary" text NOT NULL,
	"tips" text NOT NULL,
	"source" varchar(200) NOT NULL,
	"link" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
