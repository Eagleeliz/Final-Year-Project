ALTER TABLE "pregnancies" DROP CONSTRAINT "pregnancies_mother_id_mothers_id_fk";
--> statement-breakpoint
ALTER TABLE "pregnancies" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "pregnancies" ADD CONSTRAINT "pregnancies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pregnancies" DROP COLUMN "mother_id";