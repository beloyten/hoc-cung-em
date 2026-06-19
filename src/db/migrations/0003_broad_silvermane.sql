ALTER TYPE "public"."subject" ADD VALUE 'vietnamese';--> statement-breakpoint
ALTER TYPE "public"."subject" ADD VALUE 'science';--> statement-breakpoint
ALTER TYPE "public"."subject" ADD VALUE 'history_geography';--> statement-breakpoint
ALTER TYPE "public"."subject" ADD VALUE 'social_studies';--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "subject" "subject" DEFAULT 'math' NOT NULL;