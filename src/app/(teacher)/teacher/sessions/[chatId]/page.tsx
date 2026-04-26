// src/app/(teacher)/teacher/sessions/[chatId]/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { asc, eq } from "drizzle-orm"
import { db } from "@/db"
import { aiChats, aiMessages, classes, students, studySessions, studyTopics } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { AI_PERSONA_NAME } from "@/lib/constants"
import { AuthError, requireTeacher } from "@/server/auth"

export const metadata: Metadata = {
  title: "Xem phiên học",
}

const GUARD_LABEL: Record<string, string> = {
  passed: "Đã kiểm tra",
  retried: "Đã kiểm tra lại",
  fallback: "Đã thay phản hồi",
}

export default async function TeacherSessionDetail({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
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

  const { chatId } = await params

  const [row] = await db
    .select({
      chatId: aiChats.id,
      sessionId: studySessions.id,
      startedAt: studySessions.startedAt,
      studentName: students.fullName,
      className: classes.name,
      topicTitle: studyTopics.title,
      teacherId: classes.teacherId,
    })
    .from(aiChats)
    .innerJoin(studySessions, eq(studySessions.id, aiChats.sessionId))
    .innerJoin(students, eq(students.id, studySessions.studentId))
    .innerJoin(classes, eq(classes.id, students.classId))
    .leftJoin(studyTopics, eq(studyTopics.id, studySessions.topicId))
    .where(eq(aiChats.id, chatId))
    .limit(1)

  if (!row) notFound()
  if (row.teacherId !== teacherId) redirect("/teacher/sessions")

  const messages = await db
    .select({
      id: aiMessages.id,
      role: aiMessages.role,
      content: aiMessages.content,
      guardStatus: aiMessages.guardStatus,
      createdAt: aiMessages.createdAt,
    })
    .from(aiMessages)
    .where(eq(aiMessages.chatId, chatId))
    .orderBy(asc(aiMessages.createdAt))

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-bold">{row.studentName}</h1>
        <p className="text-muted-foreground text-sm">
          Lớp {row.className}
          {row.topicTitle ? ` · ${row.topicTitle}` : ""}
        </p>
        <p className="text-muted-foreground text-xs">
          {new Intl.DateTimeFormat("vi-VN", { dateStyle: "long", timeStyle: "short" }).format(
            new Date(row.startedAt),
          )}
        </p>
      </header>

      <div className="space-y-3">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm">Chưa có tin nhắn nào.</p>
        )}
        {messages.map((m) => {
          const isUser = m.role === "user"
          return (
            <div key={m.id} className={isUser ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  isUser
                    ? "bg-primary text-primary-foreground max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2 text-sm"
                    : "bg-card max-w-[80%] rounded-2xl rounded-tl-sm border px-4 py-2 text-sm shadow-sm"
                }
              >
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  {isUser ? "Học sinh" : AI_PERSONA_NAME}
                  {!isUser && m.guardStatus && (
                    <span className="bg-muted ml-2 inline-block rounded px-1.5 py-0.5 text-[10px]">
                      {GUARD_LABEL[m.guardStatus] ?? m.guardStatus}
                    </span>
                  )}
                </p>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <Link href="/teacher/sessions" className={buttonVariants({ variant: "ghost" })}>
          ← Lịch sử học
        </Link>
      </div>
    </main>
  )
}
