import { index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { aiChats } from "./ai-chats"

export const messageRoleEnum = pgEnum("message_role", ["user", "assistant", "system"])
export const guardStatusEnum = pgEnum("guard_status", ["passed", "retried", "fallback"])

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chatId: uuid("chat_id")
      .notNull()
      .references(() => aiChats.id),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    imagePaths: text("image_paths").array(),
    guardStatus: guardStatusEnum("guard_status"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_messages_chat").on(t.chatId, t.createdAt)],
)

export type AiMessage = typeof aiMessages.$inferSelect
export type NewAiMessage = typeof aiMessages.$inferInsert
