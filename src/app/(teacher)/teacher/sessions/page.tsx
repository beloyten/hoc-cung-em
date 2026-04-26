// src/app/(teacher)/teacher/sessions/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { aiChats, classes, students, studySessions, studyTopics } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { AI_PERSONA_NAME } from "@/lib/constants"
import { AuthError, requireTeacher } from "@/server/auth"

export const metadata: Metadata = {
  title: "Lịch sử học của lớp",
}

function formatDateTime(d: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d)
}

export default async function TeacherSessionsPage() {
  let teacherId: string
  try {
    const { teacher } = await requireTeacher()
    teacherId = teacher.id
  } catch (e) {
    if (e instanceof AuthError) {
      redirect(e.code === "UNAUTHENTICATED" ? "/login" : "/onboarding")
    }
    throw e
  }

  const sessions = await db
    .select({
      sessionId: studySessions.id,
      chatId: aiChats.id,
      startedAt: studySessions.startedAt,
      endedAt: studySessions.endedAt,
      outcome: studySessions.outcome,
      totalTokens: aiChats.totalTokens,
      durationMs: aiChats.durationMs,
      studentName: students.fullName,
      className: classes.name,
      topicTitle: studyTopics.title,
    })
    .from(studySessions)
    .innerJoin(students, eq(students.id, studySessions.studentId))
    .innerJoin(classes, eq(classes.id, students.classId))
    .leftJoin(aiChats, eq(aiChats.sessionId, studySessions.id))
    .leftJoin(studyTopics, eq(studyTopics.id, studySessions.topicId))
    .where(eq(classes.teacherId, teacherId))
    .orderBy(desc(studySessions.startedAt))
    .limit(50)

  const visible = sessions.filter((s) => s.sessionId)

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Lịch sử học</h1>
        <p className="text-muted-foreground text-sm">
          50 phiên học gần nhất giữa học sinh và {AI_PERSONA_NAME}.
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Chưa có phiên học nào. Khi phụ huynh bắt đầu trò chuyện cùng {AI_PERSONA_NAME}, các phiên
          sẽ hiện ở đây.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((s) => (
            <li key={s.sessionId} className="bg-card rounded-2xl border p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {s.studentName}
                    <span className="text-muted-foreground"> · Lớp {s.className}</span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatDateTime(new Date(s.startedAt))}
                    {s.topicTitle ? ` · ${s.topicTitle}` : ""}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {s.totalTokens ?? 0} tokens
                    {s.durationMs ? ` · ${Math.round(s.durationMs / 1000)}s` : ""}
                  </p>
                </div>
                {s.chatId && (
                  <Link
                    href={`/teacher/sessions/${s.chatId}`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Xem
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link href="/teacher/dashboard" className={buttonVariants({ variant: "ghost" })}>
          ← Bảng điều khiển
        </Link>
      </div>
    </main>
  )
}
