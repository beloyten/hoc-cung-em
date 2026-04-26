// src/server/ai/sessions.ts
// Tạo study_session + ai_chat khi phụ huynh bắt đầu trò chuyện với Cô Mây.
import "server-only"
import { and, desc, eq, isNull } from "drizzle-orm"
import { db } from "@/db"
import { aiChats, parentStudents, students, studySessions, studyTopics } from "@/db/schema"
import { err, ok, type Result } from "@/lib/types/result"
import { requireParent } from "@/server/auth"
import { FLASH } from "./client"
import { SYSTEM_PROMPT_VERSION } from "./prompts"

export interface StartStudySessionInput {
  studentId: string
  topicId?: string
}

export interface StartStudySessionData {
  sessionId: string
  chatId: string
}

export async function startStudySession(
  input: StartStudySessionInput,
): Promise<Result<StartStudySessionData>> {
  const { parent } = await requireParent()

  // Xác nhận parent thực sự liên kết với học sinh này.
  const [link] = await db
    .select()
    .from(parentStudents)
    .where(
      and(eq(parentStudents.parentId, parent.id), eq(parentStudents.studentId, input.studentId)),
    )
    .limit(1)
  if (!link) return err("FORBIDDEN", "Bạn chưa liên kết với học sinh này.")

  let topicId = input.topicId
  if (!topicId) {
    // Mặc định chọn chủ đề tuần mới nhất của lớp HS.
    const [student] = await db
      .select({ classId: students.classId })
      .from(students)
      .where(eq(students.id, input.studentId))
      .limit(1)
    if (!student) return err("NOT_FOUND", "Không tìm thấy học sinh.")

    const [latest] = await db
      .select({ id: studyTopics.id })
      .from(studyTopics)
      .where(eq(studyTopics.classId, student.classId))
      .orderBy(desc(studyTopics.weekNumber))
      .limit(1)
    topicId = latest?.id
  }

  const [session] = await db
    .insert(studySessions)
    .values({ studentId: input.studentId, topicId })
    .returning({ id: studySessions.id })

  if (!session) return err("DB_ERROR", "Không tạo được phiên học.")

  const [chat] = await db
    .insert(aiChats)
    .values({
      sessionId: session.id,
      createdByParentId: parent.id,
      promptVersion: SYSTEM_PROMPT_VERSION,
      model: FLASH,
    })
    .returning({ id: aiChats.id })

  if (!chat) return err("DB_ERROR", "Không tạo được cuộc trò chuyện.")

  return ok({ sessionId: session.id, chatId: chat.id })
}

export interface ChatContextData {
  chatId: string
  sessionId: string
  studentName: string
  topicTitle?: string
  topicContext?: string
}

/**
 * Load chat context và verify parent có quyền truy cập.
 */
export async function loadChatForParent(chatId: string): Promise<Result<ChatContextData>> {
  const { parent } = await requireParent()

  const [row] = await db
    .select({
      chatId: aiChats.id,
      sessionId: studySessions.id,
      createdByParentId: aiChats.createdByParentId,
      studentName: students.fullName,
      topicTitle: studyTopics.title,
      topicContext: studyTopics.context,
      sessionDeletedAt: studySessions.deletedAt,
    })
    .from(aiChats)
    .innerJoin(studySessions, eq(studySessions.id, aiChats.sessionId))
    .innerJoin(students, eq(students.id, studySessions.studentId))
    .leftJoin(studyTopics, eq(studyTopics.id, studySessions.topicId))
    .where(and(eq(aiChats.id, chatId), isNull(studySessions.deletedAt)))
    .limit(1)

  if (!row) return err("NOT_FOUND", "Không tìm thấy cuộc trò chuyện.")
  if (row.createdByParentId !== parent.id) {
    return err("FORBIDDEN", "Bạn không có quyền truy cập cuộc trò chuyện này.")
  }

  return ok({
    chatId: row.chatId,
    sessionId: row.sessionId,
    studentName: row.studentName,
    topicTitle: row.topicTitle ?? undefined,
    topicContext: row.topicContext ?? undefined,
  })
}
