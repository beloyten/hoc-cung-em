// src/app/(teacher)/teacher/uploads/[uploadId]/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { classes, notebookUploads, students, studyTopics, teacherReviews } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { AuthError, requireTeacher } from "@/server/auth"
import { signedNotebookUrl } from "@/server/storage/notebooks"
import { ReviewForm } from "./review-form"

export const metadata: Metadata = {
  title: "Chấm vở",
}

export default async function TeacherUploadDetail({
  params,
}: {
  params: Promise<{ uploadId: string }>
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

  const { uploadId } = await params

  const [row] = await db
    .select({
      id: notebookUploads.id,
      imagePaths: notebookUploads.imagePaths,
      note: notebookUploads.note,
      uploadedAt: notebookUploads.uploadedAt,
      studentName: students.fullName,
      className: classes.name,
      classTeacherId: classes.teacherId,
      topicTitle: studyTopics.title,
    })
    .from(notebookUploads)
    .innerJoin(students, eq(students.id, notebookUploads.studentId))
    .innerJoin(classes, eq(classes.id, students.classId))
    .leftJoin(studyTopics, eq(studyTopics.id, notebookUploads.topicId))
    .where(eq(notebookUploads.id, uploadId))
    .limit(1)

  if (!row) notFound()
  if (row.classTeacherId !== teacherId) redirect("/teacher/uploads")

  const [existingReview] = await db
    .select({
      id: teacherReviews.id,
      rating: teacherReviews.rating,
      note: teacherReviews.note,
    })
    .from(teacherReviews)
    .where(eq(teacherReviews.uploadId, uploadId))
    .limit(1)

  const urls = await Promise.all(row.imagePaths.map((p) => signedNotebookUrl(p, 60 * 30)))

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <header className="mb-4">
        <h1 className="text-xl font-bold">{row.studentName}</h1>
        <p className="text-muted-foreground text-sm">
          {row.className}
          {row.topicTitle ? ` · ${row.topicTitle}` : ""}
        </p>
        <p className="text-muted-foreground text-xs">
          {new Intl.DateTimeFormat("vi-VN", { dateStyle: "long", timeStyle: "short" }).format(
            new Date(row.uploadedAt),
          )}
        </p>
      </header>

      <div className="mb-6 space-y-3">
        {urls.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={url} alt={`Trang ${i + 1}`} className="w-full rounded-xl border" />
        ))}
      </div>

      {row.note && (
        <p className="bg-muted mb-6 rounded-xl p-3 text-sm whitespace-pre-wrap">
          <span className="text-muted-foreground text-xs">Ghi chú phụ huynh: </span>
          {row.note}
        </p>
      )}

      <section className="bg-card rounded-2xl border p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Chấm bài</h2>
        <ReviewForm
          uploadId={uploadId}
          initialRating={existingReview?.rating ?? null}
          initialNote={existingReview?.note ?? ""}
        />
      </section>

      <div className="mt-6">
        <Link href="/teacher/uploads" className={buttonVariants({ variant: "ghost" })}>
          ← Vở học sinh
        </Link>
      </div>
    </main>
  )
}
