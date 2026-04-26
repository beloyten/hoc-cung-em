import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { classes } from "./classes"

export const students = pgTable(
  "students",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id),
    fullName: text("full_name").notNull(),
    studentCode: text("student_code"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("idx_students_class").on(t.classId)],
)

export type Student = typeof students.$inferSelect
export type NewStudent = typeof students.$inferInsert
