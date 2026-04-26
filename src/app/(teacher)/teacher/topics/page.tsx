// src/app/(teacher)/teacher/topics/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { classes, studyTopics } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { AuthError, requireTeacher } from "@/server/auth"
import { TopicCreateForm } from "./topic-create-form"
import { DeleteTopicButton } from "./delete-topic-button"

export const metadata: Metadata = {
  title: "Chủ đề tuần",
}

export default async function TeacherTopicsPage() {
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

  const teacherClasses = await db
    .select({ id: classes.id, name: classes.name, grade: classes.grade })
    .from(classes)
    .where(eq(classes.teacherId, teacherId))

  const topicsByClass = await Promise.all(
    teacherClasses.map(async (c) => ({
      class: c,
      topics: await db
        .select()
        .from(studyTopics)
        .where(eq(studyTopics.classId, c.id))
        .orderBy(desc(studyTopics.weekNumber)),
    })),
  )

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Chủ đề tuần</h1>
        <p className="text-muted-foreground text-sm">
          Đặt chủ đề học mỗi tuần để Cô Mây hỗ trợ con đúng nội dung lớp đang học.
        </p>
      </div>

      {teacherClasses.length === 0 && (
        <p className="text-muted-foreground text-sm">Bạn chưa có lớp nào.</p>
      )}

      {topicsByClass.map(({ class: c, topics }) => (
        <section key={c.id} className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">
            Lớp {c.name} <span className="text-muted-foreground text-sm">(Lớp {c.grade})</span>
          </h2>

          <details className="bg-card mb-4 rounded-2xl border p-5 shadow-sm">
            <summary className="cursor-pointer text-sm font-medium">+ Thêm chủ đề mới</summary>
            <div className="mt-4">
              <TopicCreateForm classId={c.id} />
            </div>
          </details>

          {topics.length === 0 ? (
            <p className="text-muted-foreground text-sm">Chưa có chủ đề.</p>
          ) : (
            <ul className="space-y-3">
              {topics.map((t) => (
                <li
                  key={t.id}
                  className="bg-card flex items-start justify-between gap-3 rounded-2xl border p-4 shadow-sm"
                >
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs">
                      Tuần {t.weekNumber} · {t.startDate} → {t.endDate}
                    </p>
                    <p className="font-medium">{t.title}</p>
                    {t.description && (
                      <p className="text-muted-foreground mt-1 text-sm">{t.description}</p>
                    )}
                    {t.context && (
                      <p className="text-muted-foreground mt-2 text-xs italic">
                        Cô Mây sẽ dùng: {t.context.slice(0, 140)}
                        {t.context.length > 140 ? "..." : ""}
                      </p>
                    )}
                  </div>
                  <DeleteTopicButton topicId={t.id} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <div className="mt-8">
        <Link href="/teacher/dashboard" className={buttonVariants({ variant: "ghost" })}>
          ← Bảng điều khiển
        </Link>
      </div>
    </main>
  )
}
