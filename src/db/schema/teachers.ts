import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const teachers = pgTable("teachers", {
  id: uuid("id").defaultRandom().primaryKey(),
  authUserId: uuid("auth_user_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export type Teacher = typeof teachers.$inferSelect
export type NewTeacher = typeof teachers.$inferInsert
