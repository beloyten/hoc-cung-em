import { date, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"
import { students } from "./students"

export const weeklyReports = pgTable(
  "weekly_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    weekStart: date("week_start").notNull(),
    summary: text("summary").notNull(),
    progressHighlights: jsonb("progress_highlights"),
    areasToImprove: jsonb("areas_to_improve"),
    suggestedActions: jsonb("suggested_actions"),
    sentToEmailAt: timestamp("sent_to_email_at", { withTimezone: true }),
    openedAt: timestamp("opened_at", { withTimezone: true }),
    generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("uniq_reports_student_week").on(t.studentId, t.weekStart)],
)

export type WeeklyReport = typeof weeklyReports.$inferSelect
export type NewWeeklyReport = typeof weeklyReports.$inferInsert
