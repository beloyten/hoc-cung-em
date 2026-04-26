// src/app/api/chat/route.ts
// POST /api/chat — stream phản hồi từ Cô Mây và lưu lịch sử tin nhắn.
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { z } from "zod"
import { db } from "@/db"
import { aiChats, aiMessages } from "@/db/schema"
import { AuthError } from "@/server/auth"
import { FLASH, google } from "@/server/ai/client"
import { aiGuard, FALLBACK_RESPONSE } from "@/server/ai/guard"
import { systemPromptV1 } from "@/server/ai/prompts"
import { loadChatForParent } from "@/server/ai/sessions"
import { eq, sql } from "drizzle-orm"

export const runtime = "nodejs"
export const maxDuration = 60

const bodySchema = z.object({
  chatId: z.string().uuid(),
  messages: z.array(z.unknown()),
})

export async function POST(req: Request) {
  let parsed: z.infer<typeof bodySchema>
  try {
    parsed = bodySchema.parse(await req.json())
  } catch {
    return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 })
  }

  let chatCtx
  try {
    const result = await loadChatForParent(parsed.chatId)
    if (!result.ok) {
      return Response.json({ error: result.error.message }, { status: 403 })
    }
    chatCtx = result.data
  } catch (e) {
    if (e instanceof AuthError) {
      return Response.json({ error: "Bạn cần đăng nhập." }, { status: 401 })
    }
    throw e
  }

  const messages = parsed.messages as UIMessage[]
  const lastUser = [...messages].reverse().find((m) => m.role === "user")
  const lastUserText = lastUser ? extractText(lastUser) : ""

  // Lưu tin nhắn người dùng trước khi stream.
  if (lastUserText) {
    await db.insert(aiMessages).values({
      chatId: chatCtx.chatId,
      role: "user",
      content: lastUserText,
    })
  }

  const startedAt = Date.now()
  const system = systemPromptV1({
    studentName: chatCtx.studentName,
    topicTitle: chatCtx.topicTitle,
    topicContext: chatCtx.topicContext,
  })

  const result = streamText({
    model: google(FLASH),
    system,
    messages: await convertToModelMessages(messages),
    onFinish: async (event) => {
      const guard = aiGuard(event.text)
      const finalText = guard.status === "passed" ? event.text : FALLBACK_RESPONSE
      const guardStatus = guard.status === "passed" ? "passed" : "fallback"

      try {
        await db.insert(aiMessages).values({
          chatId: chatCtx.chatId,
          role: "assistant",
          content: finalText,
          guardStatus,
        })

        const totalTokens = event.totalUsage?.totalTokens ?? 0
        const durationMs = Date.now() - startedAt
        await db
          .update(aiChats)
          .set({
            totalTokens: sql`${aiChats.totalTokens} + ${totalTokens}`,
            durationMs,
          })
          .where(eq(aiChats.id, chatCtx.chatId))
      } catch (e) {
        console.error("[chat:onFinish] persistence error", e)
      }
    },
  })

  return result.toUIMessageStreamResponse()
}

function extractText(msg: UIMessage): string {
  if (!Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n")
    .trim()
}
