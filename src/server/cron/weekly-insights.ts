// src/server/cron/weekly-insights.ts
// Tổng hợp insight tuần cho từng lớp (giáo viên xem).
import "server-only"
import { and, asc, count, eq, gte, isNull, lt } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import {
  aiChats,
  aiMessages,
  classes,
  students,
  studySessions,
  studyTopics,
  weeklyInsights,
} from "@/db/schema"
import { generateObjectWithFallback } from "@/server/ai/client"
import { previousWeekStartICT, weekRangeUTC } from "./week"

const insightSchema = z.object({
  topErrors: z
    .array(z.string().min(1).max(200))
    .max(5)
    .describe("Tối đa 5 lỗi/khái niệm mà nhiều học sinh trong lớp gặp khó."),
  studentAttention: z
    .array(
      z.object({
        studentName: z.string().min(1).max(100),
        note: z.string().min(1).max(200),
      }),
    )
    .max(5)
    .describe("Tối đa 5 HS cần GV chú ý, kèm 1 câu lý do."),
  teachingSuggestions: z
    .array(z.string().min(1).max(200))
    .max(5)
    .describe("Tối đa 5 gợi ý giảng dạy tuần tới."),
  suggestedFocus: z
    .string()
    .min(1)
    .max(400)
    .describe(
      "1–2 câu tóm tắt cụ thể, dựa trên dữ liệu thực (ví dụ: tỷ lệ % HS hỏi về chủ đề nào), gợi ý nội dung GV nên ưu tiên tuần sau. Không chung chung. Có số liệu cụ thể nếu có thể.",
    ),
})

interface ClassMessage {
  studentName: string
  role: "user" | "assistant" | "system"
  content: string
  topicTitle: string | null
}

function buildPrompt(
  className: string,
  grade: number,
  totalStudents: number,
  items: ClassMessage[],
): string {
  const lines = items
    .slice(0, 300)
    .map(
      (m) =>
        `[${m.studentName} · ${m.role}]${m.topicTitle ? ` (${m.topicTitle})` : ""} ${m.content}`,
    )
    .join("\n")

  const activeStudents = new Set(items.filter((m) => m.role === "user").map((m) => m.studentName))
    .size

  return `Bạn là trợ lý phân tích cho giáo viên lớp ${grade} trên ứng dụng HọcCùngEm.
Lớp: ${className} (khối ${grade}, tổng ${totalStudents} HS, tuần này hoạt động: ${activeStudents} em).
Hội thoại tuần qua giữa các học sinh trong lớp và Cô Mây:

${lines}

Hãy tổng hợp insight cho giáo viên theo schema. Văn phong chuyên nghiệp, ngắn gọn, tiếng Việt.
- topErrors: khái niệm nhiều em cùng vướng
- studentAttention: HS cần chú ý (dựa trên tần suất câu hỏi, dấu hiệu chưa hiểu bài)
- teachingSuggestions: gợi ý giảng dạy cụ thể cho tuần tới
- suggestedFocus: **1–2 câu dựa trên dữ liệu** (ví dụ: "${activeStudents}/${totalStudents} em hỏi về X") gợi ý nội dung GV nên ưu tiên tuần sau. Phải có số liệu thực, không chung chung.`
}

export interface RunResult {
  weekStart: string
  generated: number
  skippedNoActivity: number
  skippedExisting: number
  errors: { classId: string; message: string }[]
}

export async function runWeeklyInsights(now: Date = new Date()): Promise<RunResult> {
  const weekStart = previousWeekStartICT(now)
  const { start, endExclusive } = weekRangeUTC(weekStart)

  const allClasses = await db
    .select({ id: classes.id, name: classes.name, grade: classes.grade })
    .from(classes)

  const result: RunResult = {
    weekStart,
    generated: 0,
    skippedNoActivity: 0,
    skippedExisting: 0,
    errors: [],
  }

  for (const c of allClasses) {
    try {
      const [existing] = await db
        .select({ id: weeklyInsights.id })
        .from(weeklyInsights)
        .where(and(eq(weeklyInsights.classId, c.id), eq(weeklyInsights.weekStart, weekStart)))
        .limit(1)
      if (existing) {
        result.skippedExisting++
        continue
      }

      const messages = await db
        .select({
          studentName: students.fullName,
          role: aiMessages.role,
          content: aiMessages.content,
          topicTitle: studyTopics.title,
        })
        .from(aiMessages)
        .innerJoin(aiChats, eq(aiChats.id, aiMessages.chatId))
        .innerJoin(studySessions, eq(studySessions.id, aiChats.sessionId))
        .innerJoin(students, eq(students.id, studySessions.studentId))
        .leftJoin(studyTopics, eq(studyTopics.id, studySessions.topicId))
        .where(
          and(
            eq(students.classId, c.id),
            gte(aiMessages.createdAt, start),
            lt(aiMessages.createdAt, endExclusive),
            isNull(students.deletedAt),
          ),
        )
        .orderBy(asc(aiMessages.createdAt))

      if (messages.length === 0) {
        result.skippedNoActivity++
        continue
      }

      // Count total enrolled students in this class (not just active ones)
      const [enrolledRow] = await db
        .select({ total: count(students.id) })
        .from(students)
        .where(and(eq(students.classId, c.id), isNull(students.deletedAt)))
      const totalStudents = Number(enrolledRow?.total ?? 0)

      const { object, modelUsed } = await generateObjectWithFallback({
        schema: insightSchema,
        prompt: buildPrompt(c.name, c.grade, totalStudents, messages),
      })

      await db.insert(weeklyInsights).values({
        classId: c.id,
        weekStart,
        topErrors: object.topErrors,
        studentAttention: object.studentAttention,
        teachingSuggestions: object.teachingSuggestions,
        suggestedFocus: object.suggestedFocus,
        generatedByModel: modelUsed,
      })

      result.generated++
    } catch (e) {
      result.errors.push({
        classId: c.id,
        message: e instanceof Error ? e.message : String(e),
      })
    }
  }

  return result
}
