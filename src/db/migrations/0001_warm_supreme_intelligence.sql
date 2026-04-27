ALTER TABLE "teachers" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "parents" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_phone_unique" UNIQUE("phone");--> statement-breakpoint
ALTER TABLE "parents" ADD CONSTRAINT "parents_phone_unique" UNIQUE("phone");