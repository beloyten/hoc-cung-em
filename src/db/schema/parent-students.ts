import { boolean, index, pgEnum, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"
import { parents } from "./parents"
import { students } from "./students"

export const relationshipEnum = pgEnum("relationship", ["mother", "father", "guardian", "other"])

export const parentStudents = pgTable(
  "parent_students",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentId: uuid("parent_id")
      .notNull()
      .references(() => parents.id),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    relationship: relationshipEnum("relationship").default("guardian").notNull(),
    verifiedByTeacher: boolean("verified_by_teacher").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_ps_parent").on(t.parentId),
    index("idx_ps_student").on(t.studentId),
    uniqueIndex("uniq_parent_student").on(t.parentId, t.studentId),
  ],
)

export type ParentStudent = typeof parentStudents.$inferSelect
export type NewParentStudent = typeof parentStudents.$inferInsert
