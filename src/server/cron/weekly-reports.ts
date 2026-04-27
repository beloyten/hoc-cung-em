// src/server/cron/weekly-reports.ts
// Tổng hợp báo cáo tuần cho từng học sinh dựa trên ai_messages của tuần trước.
import "server-only"
import { and, asc, eq, gte, lt } from "drizzle-orm"
import { generateObject } from "ai"
import { z } from "zod"
import { db } from "@/db"
import {
  aiChats,
  aiMessages,
  parents,
  parentStudents,
  students,
  studySessions,
  studyTopics,
  weeklyReports,
} from "@/db/schema"
import { FLASH, google } from "@/server/ai/client"
import { sendWeeklyReportEmail } from "@/server/email/weekly-report"
import { previousWeekStartICT, weekRangeUTC } from "./week"

const reportSchema = z.object({
  summary: z
    .string()
    .min(1)
    .max(500)
    .describe("2-3 câu tiếng Việt tóm tắt tuần học của con cho phụ huynh."),
  progressHighlights: z
    .array(z.string().min(1).max(200))
    .max(5)
    .describe("Tối đa 5 điểm tiến bộ, tiếng Việt, mỗi câu ngắn gọn."),
  areasToImprove: z
    .array(z.string().min(1).max(200))
    .max(5)
    .describe("Tối đa 5 mảng cần luyện thêm."),
  suggestedActions: z
    .array(z.string().min(1).max(200))
    .max(5)
    .describe("Tối đa 5 gợi ý cụ thể phụ huynh có thể làm cùng con tuần tới."),
})

interface MessageLite {
  role: "user" | "assistant" | "system"
  content: string
  topicTitle: string | null
}

function buildPrompt(studentName: string, items: MessageLite[]): string {
  const lines = items
    .slice(0, 200)
    .map((m) => `[${m.role}]${m.topicTitle ? ` (${m.topicTitle})` : ""} ${m.content}`)
    .join("\n")
  return `Bạn là trợ lý phân tích cho ứng dụng HọcCùngEm.
Học sinh: ${studentName} (lớp 4).
Đoạn hội thoại tuần qua giữa học sinh và Cô Mây (gia sư AI Socratic):

${lines}

Hãy phân tích và trả về báo cáo tuần ngắn gọn theo schema. Văn phong ấm áp, khích lệ, tiếng Việt.
Không nêu đáp án bài tập. Tập trung vào kỹ năng (đặt câu hỏi, kiên trì, hiểu khái niệm) và mảng cần luyện.`
}

export interface RunResult {
  weekStart: string
  generated: number
  skippedNoActivity: number
  skippedExisting: number
  errors: { studentId: string; message: string }[]
}

export async function runWeeklyReports(now: Date = new Date()): Promise<RunResult> {
  const weekStart = previousWeekStartICT(now)
  const { start, endExclusive } = weekRangeUTC(weekStart)

  // Tìm các học sinh có hoạt động trong tuần
  const activity = await db
    .selectDistinct({ studentId: studySessions.studentId })
    .from(studySessions)
    .where(and(gte(studySessions.startedAt, start), lt(studySessions.startedAt, endExclusive)))

  const result: RunResult = {
    weekStart,
    generated: 0,
    skippedNoActivity: 0,
    skippedExisting: 0,
    errors: [],
  }

  for (const { studentId } of activity) {
    try {
      const [existing] = await db
        .select({ id: weeklyReports.id })
        .from(weeklyReports)
        .where(and(eq(weeklyReports.studentId, studentId), eq(weeklyReports.weekStart, weekStart)))
        .limit(1)
      if (existing) {
        result.skippedExisting++
        continue
      }

      const [studentRow] = await db
        .select({ fullName: students.fullName })
        .from(students)
        .where(eq(students.id, studentId))
        .limit(1)
      if (!studentRow) continue

      const messages = await db
        .select({
          role: aiMessages.role,
          content: aiMessages.content,
          topicTitle: studyTopics.title,
          createdAt: aiMessages.createdAt,
        })
        .from(aiMessages)
        .innerJoin(aiChats, eq(aiChats.id, aiMessages.chatId))
        .innerJoin(studySessions, eq(studySessions.id, aiChats.sessionId))
        .leftJoin(studyTopics, eq(studyTopics.id, studySessions.topicId))
        .where(
          and(
            eq(studySessions.studentId, studentId),
            gte(aiMessages.createdAt, start),
            lt(aiMessages.createdAt, endExclusive),
          ),
        )
        .orderBy(asc(aiMessages.createdAt))

      if (messages.length === 0) {
        result.skippedNoActivity++
        continue
      }

      const lite: MessageLite[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
        topicTitle: m.topicTitle,
      }))

      const { object } = await generateObject({
        model: google(FLASH),
        schema: reportSchema,
        prompt: buildPrompt(studentRow.fullName, lite),
      })

      await db.insert(weeklyReports).values({
        studentId,
        weekStart,
        summary: object.summary,
        progressHighlights: object.progressHighlights,
        areasToImprove: object.areasToImprove,
        suggestedActions: object.suggestedActions,
      })

      // Gửi email cho từng phụ huynh đã liên kết và đã được giáo viên duyệt
      const recipients = await db
        .select({ name: parents.fullName, email: parents.email })
        .from(parentStudents)
        .innerJoin(parents, eq(parents.id, parentStudents.parentId))
        .where(
          and(eq(parentStudents.studentId, studentId), eq(parentStudents.verifiedByTeacher, true)),
        )

      let sent = false
      for (const r of recipients) {
        if (!r.email) continue // phone-only parent — skip email report
        try {
          await sendWeeklyReportEmail({
            to: r.email,
            parentName: r.name,
            studentName: studentRow.fullName,
            weekStart,
            summary: object.summary,
            highlights: object.progressHighlights,
            improve: object.areasToImprove,
            actions: object.suggestedActions,
          })
          sent = true
        } catch (e) {
          result.errors.push({
            studentId,
            message: `email ${r.email}: ${e instanceof Error ? e.message : String(e)}`,
          })
        }
      }
      if (sent) {
        await db
          .update(weeklyReports)
          .set({ sentToEmailAt: new Date() })
          .where(
            and(eq(weeklyReports.studentId, studentId), eq(weeklyReports.weekStart, weekStart)),
          )
      }

      result.generated++
    } catch (e) {
      result.errors.push({
        studentId,
        message: e instanceof Error ? e.message : String(e),
      })
    }
  }

  return result
}
