import { date, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { classes } from "./classes"

export const subjectEnum = pgEnum("subject", ["math"])

export const studyTopics = pgTable(
  "study_topics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id),
    title: text("title").notNull(),
    description: text("description"),
    subject: subjectEnum("subject").default("math").notNull(),
    weekNumber: integer("week_number").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    context: text("context"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_topics_class_week").on(t.classId, t.weekNumber)],
)

export type StudyTopic = typeof studyTopics.$inferSelect
export type NewStudyTopic = typeof studyTopics.$inferInsert
