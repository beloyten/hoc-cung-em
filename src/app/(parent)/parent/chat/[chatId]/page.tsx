// src/app/(parent)/parent/chat/[chatId]/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { asc, eq } from "drizzle-orm"
import { db } from "@/db"
import { aiMessages } from "@/db/schema"
import { ChatPanel } from "@/components/chat/chat-panel"
import { buttonVariants } from "@/components/ui/button"
import { AI_PERSONA_NAME } from "@/lib/constants"
import { AuthError } from "@/server/auth"
import { loadChatForParent } from "@/server/ai/sessions"

export const metadata: Metadata = {
  title: `Cô Mây đang lắng nghe`,
}

export default async function ChatSessionPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params

  let ctx
  try {
    const result = await loadChatForParent(chatId)
    if (!result.ok) {
      if (result.error.code === "NOT_FOUND") notFound()
      redirect("/parent/chat")
    }
    ctx = result.data
  } catch (e) {
    if (e instanceof AuthError) {
      redirect(e.code === "UNAUTHENTICATED" ? "/login" : "/onboarding")
    }
    throw e
  }

  const history = await db
    .select({
      id: aiMessages.id,
      role: aiMessages.role,
      content: aiMessages.content,
    })
    .from(aiMessages)
    .where(eq(aiMessages.chatId, chatId))
    .orderBy(asc(aiMessages.createdAt))

  const initialMessages = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      parts: [{ type: "text" as const, text: m.content }],
    }))

  return (
    <main className="container mx-auto flex h-dvh max-w-2xl flex-col px-4 py-4">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{AI_PERSONA_NAME}</h1>
          <p className="text-muted-foreground text-xs">
            Đang học cùng {ctx.studentName}
            {ctx.topicTitle ? ` · ${ctx.topicTitle}` : ""}
          </p>
        </div>
        <Link href="/parent/chat" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Đóng
        </Link>
      </header>

      <ChatPanel chatId={chatId} initialMessages={initialMessages} />
    </main>
  )
}
