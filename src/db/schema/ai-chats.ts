import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { parents } from "./parents"
import { studySessions } from "./study-sessions"

export const aiChats = pgTable("ai_chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => studySessions.id),
  createdByParentId: uuid("created_by_parent_id")
    .notNull()
    .references(() => parents.id),
  promptVersion: text("prompt_version").notNull(),
  model: text("model").notNull(),
  totalTokens: integer("total_tokens").default(0).notNull(),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export type AiChat = typeof aiChats.$inferSelect
export type NewAiChat = typeof aiChats.$inferInsert
