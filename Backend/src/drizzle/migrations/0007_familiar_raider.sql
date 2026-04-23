ALTER TABLE "users" RENAME COLUMN "sub_county" TO "constituency";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "village" TO "ward";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_image" varchar(500);