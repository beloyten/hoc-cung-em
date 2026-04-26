import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const parents = pgTable("parents", {
  id: uuid("id").defaultRandom().primaryKey(),
  authUserId: uuid("auth_user_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export type Parent = typeof parents.$inferSelect
export type NewParent = typeof parents.$inferInsert
