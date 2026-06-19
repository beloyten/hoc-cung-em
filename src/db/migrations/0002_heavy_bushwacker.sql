CREATE TABLE "topic_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grade" integer NOT NULL,
	"subject" "subject" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"context" text,
	"verified_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_topic_templates_grade_subject" ON "topic_templates" USING btree ("grade","subject");