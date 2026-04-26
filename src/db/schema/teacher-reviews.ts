import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { notebookUploads } from "./notebook-uploads"
import { teachers } from "./teachers"

export const ratingEnum = pgEnum("rating", ["good", "needs_support"])

export const teacherReviews = pgTable("teacher_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  uploadId: uuid("upload_id")
    .notNull()
    .references(() => notebookUploads.id)
    .unique(),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => teachers.id),
  rating: ratingEnum("rating").notNull(),
  note: text("note"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }).defaultNow().notNull(),
})

export type TeacherReview = typeof teacherReviews.$inferSelect
export type NewTeacherReview = typeof teacherReviews.$inferInsert
