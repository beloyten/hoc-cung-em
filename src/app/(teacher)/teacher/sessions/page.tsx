// src/app/(teacher)/teacher/sessions/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { aiChats, classes, students, studySessions, studyTopics } from "@/db/schema"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { BackLink, EmptyState, PageContainer, PageHeader } from "@/components/page-layout"
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

const OUTCOME_VI: Record<
  string,
  { label: string; tone: "default" | "secondary" | "destructive" | "outline" }
> = {
  completed: { label: "Hoàn thành", tone: "default" },
  abandoned: { label: "Bỏ dở", tone: "outline" },
  needs_help: { label: "Cần hỗ trợ", tone: "destructive" },
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
    <PageContainer>
      <BackLink href="/teacher/dashboard">Bảng điều khiển</BackLink>
      <PageHeader
        className="mt-2"
        title="Lịch sử học"
        description={`50 phiên học gần nhất giữa học sinh và ${AI_PERSONA_NAME}.`}
      />

      {visible.length === 0 ? (
        <EmptyState
          icon="💬"
          title="Chưa có phiên học nào"
          description={`Khi phụ huynh bắt đầu trò chuyện cùng ${AI_PERSONA_NAME}, các phiên học sẽ hiện ở đây.`}
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((s) => {
            const outcome = s.outcome ? OUTCOME_VI[s.outcome] : null
            return (
              <li
                key={s.sessionId}
                className="bg-card hover:border-primary/30 rounded-2xl border p-4 shadow-sm transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{s.studentName}</p>
                      <span className="text-muted-foreground text-xs">· Lớp {s.className}</span>
                      {outcome && (
                        <Badge variant={outcome.tone} className="text-xs">
                          {outcome.label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
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
            )
          })}
        </ul>
      )}
    </PageContainer>
  )
}
