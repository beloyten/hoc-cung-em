import { date, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"
import { classes } from "./classes"

export const weeklyInsights = pgTable(
  "weekly_insights",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id),
    weekStart: date("week_start").notNull(),
    topErrors: jsonb("top_errors"),
    studentAttention: jsonb("student_attention"),
    teachingSuggestions: jsonb("teaching_suggestions"),
    generatedByModel: text("generated_by_model").notNull(),
    generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
    teacherReviewedAt: timestamp("teacher_reviewed_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("uniq_insights_class_week").on(t.classId, t.weekStart)],
)

export type WeeklyInsight = typeof weeklyInsights.$inferSelect
export type NewWeeklyInsight = typeof weeklyInsights.$inferInsert
