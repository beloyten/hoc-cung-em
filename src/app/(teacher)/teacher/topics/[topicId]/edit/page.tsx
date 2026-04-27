import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { classes, studyTopics } from "@/db/schema"
import { AuthError, requireTeacher } from "@/server/auth"
import { TopicEditForm } from "./topic-edit-form"

export const metadata: Metadata = {
  title: "Sửa chủ đề",
}

export default async function EditTopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params

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

  const [row] = await db
    .select({
      id: studyTopics.id,
      title: studyTopics.title,
      weekNumber: studyTopics.weekNumber,
      startDate: studyTopics.startDate,
      endDate: studyTopics.endDate,
      description: studyTopics.description,
      context: studyTopics.context,
      classId: studyTopics.classId,
      className: classes.name,
    })
    .from(studyTopics)
    .innerJoin(classes, eq(classes.id, studyTopics.classId))
    .where(and(eq(studyTopics.id, topicId), eq(classes.teacherId, teacherId)))
    .limit(1)

  if (!row) notFound()

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <p className="text-muted-foreground text-sm">Lớp {row.className}</p>
        <h1 className="text-2xl font-bold">Sửa chủ đề</h1>
      </header>

      <section className="bg-card rounded-2xl border p-6 shadow-sm">
        <TopicEditForm
          initial={{
            topicId: row.id,
            title: row.title,
            weekNumber: row.weekNumber,
            startDate: row.startDate,
            endDate: row.endDate,
            description: row.description,
            context: row.context,
          }}
        />
      </section>
    </main>
  )
}
