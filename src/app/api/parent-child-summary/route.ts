// POST /api/parent-child-summary
// Structured AI summary of a child's learning activity for parent.
import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { and, desc, eq, gte, isNull } from "drizzle-orm"
import { db } from "@/db"
import {
  aiChats,
  aiMessages,
  classes,
  parentStudents,
  students,
  studySessions,
  studyTopics,
  weeklyReports,
} from "@/db/schema"
import { AuthError, requireParent } from "@/server/auth"
import { FLASH, google } from "@/server/ai/client"

export const runtime = "nodejs"
export const maxDuration = 30

const bodySchema = z.object({
  studentId: z.string().uuid(),
})

const summarySchema = z.object({
  headline: z
    .string()
    .min(1)
    .max(120)
    .describe("1 câu tóm tắt tổng quan tuần học của con (tiếng Việt, ấm áp)."),
  activeTopics: z
    .array(z.string().min(1).max(100))
    .max(3)
    .describe("Tối đa 3 chủ đề/bài con đã hỏi nhiều nhất."),
  strengths: z
    .array(z.string().min(1).max(150))
    .max(3)
    .describe("Tối đa 3 điểm mạnh con thể hiện trong tuần."),
  needsAttention: z
    .array(z.string().min(1).max(150))
    .max(3)
    .describe("Tối đa 3 mảng con cần luyện thêm."),
  parentTip: z
    .string()
    .min(1)
    .max(200)
    .describe("1 gợi ý cụ thể phụ huynh có thể làm cùng con hôm nay (không phải chung chung)."),
})

export type ChildSummaryResult = z.infer<typeof summarySchema>

export async function POST(req: Request) {
  let parsed: z.infer<typeof bodySchema>
  try {
    parsed = bodySchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 })
  }

  let parentId: string
  try {
    const { parent } = await requireParent()
    parentId = parent.id
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 })
    }
    throw e
  }

  // Verify parent is linked to this student
  const [link] = await db
    .select({ id: parentStudents.id })
    .from(parentStudents)
    .where(
      and(eq(parentStudents.parentId, parentId), eq(parentStudents.studentId, parsed.studentId)),
    )
    .limit(1)

  if (!link) {
    return NextResponse.json({ error: "Không tìm thấy học sinh." }, { status: 403 })
  }

  // Fetch student info
  const [student] = await db
    .select({ fullName: students.fullName, classId: students.classId })
    .from(students)
    .where(and(eq(students.id, parsed.studentId), isNull(students.deletedAt)))
    .limit(1)

  if (!student) {
    return NextResponse.json({ error: "Không tìm thấy học sinh." }, { status: 404 })
  }

  // Fetch class info
  const [cls] = await db
    .select({ name: classes.name, grade: classes.grade, subject: classes.subject })
    .from(classes)
    .where(eq(classes.id, student.classId))
    .limit(1)

  // Latest weekly report (if exists)
  const [weeklyReport] = await db
    .select({
      weekStart: weeklyReports.weekStart,
      summary: weeklyReports.summary,
      progressHighlights: weeklyReports.progressHighlights,
      areasToImprove: weeklyReports.areasToImprove,
    })
    .from(weeklyReports)
    .where(eq(weeklyReports.studentId, parsed.studentId))
    .orderBy(desc(weeklyReports.weekStart))
    .limit(1)

  // Recent chat messages (last 14 days)
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  const recentMessages = await db
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
        eq(studySessions.studentId, parsed.studentId),
        gte(aiMessages.createdAt, since),
        isNull(studySessions.deletedAt),
      ),
    )
    .orderBy(desc(aiMessages.createdAt))
    .limit(80)

  if (recentMessages.length === 0 && !weeklyReport) {
    return NextResponse.json({
      headline: `${student.fullName} chưa có hoạt động học trong 2 tuần gần đây.`,
      activeTopics: [],
      strengths: [],
      needsAttention: [],
      parentTip: "Thử khuyến khích con mở app và hỏi Cô Mây một câu bất kỳ về bài học hôm nay!",
    } satisfies ChildSummaryResult)
  }

  // Build prompt context
  const msgLines = recentMessages
    .reverse()
    .slice(0, 60)
    .map(
      (m) =>
        `[${m.role === "user" ? student.fullName : "Cô Mây"}]${m.topicTitle ? ` (${m.topicTitle})` : ""} ${m.content}`,
    )
    .join("\n")

  const reportBlock = weeklyReport
    ? `Báo cáo tuần ${weeklyReport.weekStart}: ${weeklyReport.summary}\nTiến bộ: ${JSON.stringify(weeklyReport.progressHighlights)}\nCần luyện: ${JSON.stringify(weeklyReport.areasToImprove)}`
    : ""

  const prompt = `Phân tích hoạt động học của học sinh ${student.fullName}, ${cls ? `lớp ${cls.grade}` : ""} trong 14 ngày qua.

${reportBlock ? `--- BÁO CÁO TUẦN GẦN NHẤT ---\n${reportBlock}\n` : ""}
--- HỘI THOẠI GẦN ĐÂY (học sinh ↔ Cô Mây) ---
${msgLines}

Hãy tổng hợp theo schema. Văn phong ấm áp, ngắn gọn, tiếng Việt. Tập trung vào kỹ năng (đặt câu hỏi, kiên trì, hiểu khái niệm), không nêu đáp án bài tập.`

  let object: z.infer<typeof summarySchema>
  try {
    ;({ object } = await generateObject({
      model: google(FLASH),
      schema: summarySchema,
      prompt,
    }))
  } catch (e) {
    console.error("[parent-child-summary] generateObject error", e)
    return NextResponse.json(
      { error: "Không thể phân tích lúc này. Vui lòng thử lại sau." },
      { status: 503 },
    )
  }

  return NextResponse.json(object)
}
