import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { parents } from "./parents"
import { students } from "./students"
import { studyTopics } from "./study-topics"

export const notebookUploads = pgTable(
  "notebook_uploads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    topicId: uuid("topic_id").references(() => studyTopics.id),
    uploadedByParentId: uuid("uploaded_by_parent_id")
      .notNull()
      .references(() => parents.id),
    imagePaths: text("image_paths").array().notNull(),
    note: text("note"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("idx_uploads_student_date").on(t.studentId, t.uploadedAt)],
)

export type NotebookUpload = typeof notebookUploads.$inferSelect
export type NewNotebookUpload = typeof notebookUploads.$inferInsert
