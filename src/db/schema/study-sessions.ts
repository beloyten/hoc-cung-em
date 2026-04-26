import { index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { students } from "./students"
import { studyTopics } from "./study-topics"

export const sessionOutcomeEnum = pgEnum("session_outcome", [
  "in_progress",
  "solved_self",
  "partial",
  "gave_up",
])

export const studySessions = pgTable(
  "study_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    topicId: uuid("topic_id").references(() => studyTopics.id),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    summary: text("summary"),
    outcome: sessionOutcomeEnum("outcome").default("in_progress").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("idx_sessions_student_date").on(t.studentId, t.startedAt)],
)

export type StudySession = typeof studySessions.$inferSelect
export type NewStudySession = typeof studySessions.$inferInsert
