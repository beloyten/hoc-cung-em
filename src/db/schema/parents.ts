import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

// email và phone đều nullable nhưng ràng buộc app-layer: ít nhất một trong hai phải có
// (user đăng nhập OTP SMS chưa có email; user magic link chưa có phone)
export const parents = pgTable("parents", {
  id: uuid("id").defaultRandom().primaryKey(),
  authUserId: uuid("auth_user_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export type Parent = typeof parents.$inferSelect
export type NewParent = typeof parents.$inferInsert
