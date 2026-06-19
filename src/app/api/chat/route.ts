import { streamText, type UIMessage } from "ai"
import { z } from "zod"
import { db } from "@/db"
import { aiChats, aiMessages } from "@/db/schema"
import { AuthError } from "@/server/auth"
import { FLASH, google } from "@/server/ai/client"
import { aiGuard, FALLBACK_RESPONSE } from "@/server/ai/guard"
import { systemPromptV2 } from "@/server/ai/prompts"
import { loadChatForParent } from "@/server/ai/sessions"
import { and, count, eq, gt, sql } from "drizzle-orm"

export const runtime = "nodejs"
export const maxDuration = 60

const bodySchema = z.object({
  chatId: z.string().uuid(),
  messages: z.array(z.unknown()),
  imageUrl: z.string().url().optional(),
})

// Fallback to 30 if env var is unset or non-numeric.
const MAX_MSG_PER_HOUR = (() => {
  const n = parseInt(process.env.AI_MAX_MESSAGES_PER_HOUR ?? "30", 10)
  return Number.isFinite(n) && n > 0 ? n : 30
})()

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
  const lastUser = messages.findLast((m) => m.role === "user")
  const lastUserText = lastUser ? extractText(lastUser) : ""
  const imageUrl = parsed.imageUrl

  console.log("[chat:POST] uiMessages=%d lastRole=%s", messages.length, messages.at(-1)?.role)

  // insertedMsgId declared here so the catch can clean up on any error below.
  let insertedMsgId: string | undefined

  try {
    // Rate limit: count user messages in the last hour across all chats for this parent.
    const [rateRow] = await db
      .select({ total: count() })
      .from(aiMessages)
      .innerJoin(aiChats, eq(aiChats.id, aiMessages.chatId))
      .where(
        and(
          eq(aiChats.createdByParentId, chatCtx.parentId),
          eq(aiMessages.role, "user"),
          gt(aiMessages.createdAt, sql`NOW() - INTERVAL '1 hour'`),
        ),
      )
    if ((rateRow?.total ?? 0) >= MAX_MSG_PER_HOUR) {
      return Response.json(
        { error: `Bạn đã gửi ${MAX_MSG_PER_HOUR} tin nhắn trong giờ qua. Vui lòng thử lại sau.` },
        { status: 429 },
      )
    }

    // Insert user message before streaming so it persists even if client disconnects mid-stream.
    if (lastUserText) {
      const [row] = await db
        .insert(aiMessages)
        .values({ chatId: chatCtx.chatId, role: "user", content: lastUserText })
        .returning({ id: aiMessages.id })
      insertedMsgId = row?.id
    }

    const startedAt = Date.now()
    const system = systemPromptV2({
      studentName: chatCtx.studentName,
      grade: chatCtx.grade,
      subject: chatCtx.subject,
      topicTitle: chatCtx.topicTitle,
      topicContext: chatCtx.topicContext,
    })

    const result = streamText({
      model: google(FLASH),
      system,
      messages: toCoreMessages(messages, imageUrl),
      onError: ({ error }) => {
        console.error("[chat:streamText] stream error", error)
      },
      onFinish: async (event) => {
        const passed = aiGuard(event.text).status === "passed"
        const finalText = passed ? event.text : FALLBACK_RESPONSE
        try {
          await db.insert(aiMessages).values({
            chatId: chatCtx.chatId,
            role: "assistant",
            content: finalText,
            guardStatus: passed ? "passed" : "fallback",
          })
          const totalTokens = event.totalUsage?.totalTokens ?? 0
          await db
            .update(aiChats)
            .set({
              totalTokens: sql`${aiChats.totalTokens} + ${totalTokens}`,
              durationMs: Date.now() - startedAt,
            })
            .where(eq(aiChats.id, chatCtx.chatId))
        } catch (e) {
          console.error("[chat:onFinish] persistence error", e)
        }
      },
    })

    // consumeStream ensures onFinish fires even if the client disconnects mid-stream.
    result.consumeStream()
    return result.toUIMessageStreamResponse()
  } catch (e) {
    console.error("[chat:POST] error", e)
    if (insertedMsgId) {
      await db
        .delete(aiMessages)
        .where(eq(aiMessages.id, insertedMsgId))
        .catch((de) => console.error("[chat:POST] orphan cleanup failed", de))
    }
    return Response.json({ error: "Có lỗi xảy ra, xin vui lòng thử lại." }, { status: 500 })
  }
}

function extractText(msg: UIMessage): string {
  if (!Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n")
    .trim()
}

// SDK may attach internal parts (step-start etc.) to streamed UIMessages;
// toCoreMessages strips those to avoid crash on turn 2+.
// When imageUrl is provided it is attached as an image part on the last user message.
type TextPart = { type: "text"; text: string }
type ImagePart = { type: "image"; image: URL }
type CoreUserMessage = { role: "user"; content: string | Array<TextPart | ImagePart> }
type CoreAssistantMessage = { role: "assistant"; content: string }
type ChatMessage = CoreUserMessage | CoreAssistantMessage

function toCoreMessages(messages: UIMessage[], imageUrl?: string): ChatMessage[] {
  const result: ChatMessage[] = []
  const lastUserIdx = messages.findLastIndex((m) => m.role === "user")
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i]
    if (!m) continue
    const text = extractText(m)
    if (!text) continue
    if (m.role === "user") {
      // Attach image only to the last user message
      if (i === lastUserIdx && imageUrl) {
        result.push({
          role: "user",
          content: [
            { type: "image", image: new URL(imageUrl) },
            { type: "text", text },
          ],
        })
      } else {
        result.push({ role: "user", content: text })
      }
    } else if (m.role === "assistant") {
      result.push({ role: "assistant", content: text })
    }
  }
  return result
}
