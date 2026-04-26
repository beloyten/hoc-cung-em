import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { teachers } from "./teachers"

export const classes = pgTable(
  "classes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.id),
    name: text("name").notNull(),
    grade: integer("grade").notNull(),
    joinCode: text("join_code").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_classes_teacher").on(t.teacherId),
    index("idx_classes_join_code").on(t.joinCode),
  ],
)

export type Class = typeof classes.$inferSelect
export type NewClass = typeof classes.$inferInsert
