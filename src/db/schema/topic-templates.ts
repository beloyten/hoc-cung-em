import { date, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { subjectEnum } from "./study-topics"

export const topicTemplates = pgTable(
  "topic_templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    grade: integer("grade").notNull(),
    subject: subjectEnum("subject").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    context: text("context"),
    verifiedAt: date("verified_at"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_topic_templates_grade_subject").on(t.grade, t.subject)],
)

export type TopicTemplate = typeof topicTemplates.$inferSelect
export type NewTopicTemplate = typeof topicTemplates.$inferInsert
