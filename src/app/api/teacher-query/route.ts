// POST /api/teacher-query
// Streaming analytic AI for teachers — answers questions about their class data.
import { streamText } from "ai"
import { z } from "zod"
import { and, count, desc, eq, gte, inArray, isNull } from "drizzle-orm"
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
import { AuthError, requireTeacher } from "@/server/auth"
import { FLASH, google } from "@/server/ai/client"

export const runtime = "nodejs"
export const maxDuration = 30

const bodySchema = z.object({
  classId: z.string().uuid(),
  question: z.string().min(1).max(500),
})

export async function POST(req: Request) {
  let parsed: z.infer<typeof bodySchema>
  try {
    parsed = bodySchema.parse(await req.json())
  } catch {
    return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 })
  }

  let teacherId: string
  try {
    const { teacher } = await requireTeacher()
    teacherId = teacher.id
  } catch (e) {
    if (e instanceof AuthError) {
      return Response.json({ error: "Bạn cần đăng nhập." }, { status: 401 })
    }
    throw e
  }

  // Verify teacher owns this class
  const [cls] = await db
    .select({ id: classes.id, name: classes.name, grade: classes.grade, subject: classes.subject })
    .from(classes)
    .where(and(eq(classes.id, parsed.classId), eq(classes.teacherId, teacherId)))
    .limit(1)

  if (!cls) {
    return Response.json({ error: "Không tìm thấy lớp." }, { status: 403 })
  }

  // Build context: student list
  const studentList = await db
    .select({ id: students.id, fullName: students.fullName })
    .from(students)
    .where(and(eq(students.classId, cls.id), isNull(students.deletedAt)))

  // Active topics
  const recentTopics = await db
    .select({ title: studyTopics.title, weekNumber: studyTopics.weekNumber })
    .from(studyTopics)
    .where(eq(studyTopics.classId, cls.id))
    .orderBy(desc(studyTopics.weekNumber))
    .limit(3)

  // Latest weekly insight
  const [latestInsight] = await db
    .select()
    .from(weeklyInsights)
    .where(eq(weeklyInsights.classId, cls.id))
    .orderBy(desc(weeklyInsights.weekStart))
    .limit(1)

  // Recent chat activity — count messages per student last 14 days
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  const studentIds = studentList.map((s) => s.id)
  const activityRows =
    studentIds.length > 0
      ? await db
          .select({
            studentId: studySessions.studentId,
            msgCount: count(aiMessages.id),
          })
          .from(aiMessages)
          .innerJoin(aiChats, eq(aiChats.id, aiMessages.chatId))
          .innerJoin(studySessions, eq(studySessions.id, aiChats.sessionId))
          .where(
            and(
              inArray(studySessions.studentId, studentIds),
              gte(aiMessages.createdAt, since),
              eq(aiMessages.role, "user"),
            ),
          )
          .groupBy(studySessions.studentId)
      : []

  const activityMap = new Map(activityRows.map((r) => [r.studentId, Number(r.msgCount)]))
  const studentNameById = new Map(studentList.map((s) => [s.id, s.fullName]))

  // Recent sample questions from students (last 7 days, user role only)
  const recentQuestions =
    studentIds.length > 0
      ? await db
          .select({ content: aiMessages.content, studentId: studySessions.studentId })
          .from(aiMessages)
          .innerJoin(aiChats, eq(aiChats.id, aiMessages.chatId))
          .innerJoin(studySessions, eq(studySessions.id, aiChats.sessionId))
          .where(
            and(
              inArray(studySessions.studentId, studentIds),
              gte(aiMessages.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
              eq(aiMessages.role, "user"),
            ),
          )
          .orderBy(desc(aiMessages.createdAt))
          .limit(60)
      : []

  // Format context for the prompt
  const studentLines = studentList
    .map((s) => {
      const msgs = activityMap.get(s.id) ?? 0
      return `- ${s.fullName}: ${msgs} tin nhắn (14 ngày)`
    })
    .join("\n")

  const topicLines = recentTopics.map((t) => `- Tuần ${t.weekNumber}: ${t.title}`).join("\n")

  const insightBlock = latestInsight
    ? `**Insight tuần ${latestInsight.weekStart}:**
- Khái niệm khó: ${JSON.stringify(latestInsight.topErrors)}
- HS cần chú ý: ${JSON.stringify(latestInsight.studentAttention)}
- Gợi ý dạy: ${JSON.stringify(latestInsight.teachingSuggestions)}`
    : "(Chưa có insight — lớp chưa đủ hoạt động)"

  const questionSample = recentQuestions
    .slice(0, 30)
    .map((q) => `[${studentNameById.get(q.studentId) ?? "?"}] ${q.content}`)
    .join("\n")

  const system = `Bạn là trợ lý phân tích lớp học cho giáo viên trên ứng dụng HọcCùngEm.

## DỮ LIỆU LỚP ${cls.name.toUpperCase()} (Khối ${cls.grade})

**Học sinh (${studentList.length} em):**
${studentLines || "(Chưa có học sinh)"}

**Chủ đề gần đây:**
${topicLines || "(Chưa có chủ đề)"}

${insightBlock}

**Câu hỏi HS gửi cho Cô Mây (7 ngày qua):**
${questionSample || "(Chưa có hoạt động)"}

## NGUYÊN TẮC

1. Chỉ trả lời về dữ liệu lớp ${cls.name} ở trên — không suy đoán ngoài dữ liệu.
2. Nếu không đủ dữ liệu, nói thẳng: "Chưa có đủ dữ liệu để trả lời câu này."
3. Văn phong chuyên nghiệp, ngắn gọn, tiếng Việt.
4. Không tư vấn ngoài phạm vi học tập (tâm lý, sức khoẻ, v.v.).
5. Tối đa 200 từ mỗi câu trả lời.`

  const result = streamText({
    model: google(FLASH),
    system,
    messages: [{ role: "user", content: parsed.question }],
    onError: ({ error }) => {
      console.error("[teacher-query:streamText] error", error)
    },
  })

  return result.toTextStreamResponse()
}
