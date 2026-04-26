// src/app/(parent)/parent/chat/actions.ts
"use server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { err, type Result } from "@/lib/types/result"
import { startStudySession } from "@/server/ai/sessions"

const startSchema = z.object({ studentId: z.string().uuid() })

export async function startChatAction(input: { studentId: string }): Promise<Result<never>> {
  const parsed = startSchema.safeParse(input)
  if (!parsed.success) return err("VALIDATION", "Dữ liệu không hợp lệ.")

  const result = await startStudySession({ studentId: parsed.data.studentId })
  if (!result.ok) return result

  redirect(`/parent/chat/${result.data.chatId}`)
}
