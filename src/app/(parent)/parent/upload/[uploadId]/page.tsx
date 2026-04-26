// src/app/(parent)/parent/upload/[uploadId]/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { notebookUploads, parentStudents, students, teacherReviews } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { AuthError, requireParent } from "@/server/auth"
import { signedNotebookUrl } from "@/server/storage/notebooks"

export const metadata: Metadata = {
  title: "Ảnh vở",
}

export default async function ParentUploadDetail({
  params,
}: {
  params: Promise<{ uploadId: string }>
}) {
  let parentId: string
  try {
    const { parent } = await requireParent()
    parentId = parent.id
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
      studentId: notebookUploads.studentId,
      imagePaths: notebookUploads.imagePaths,
      note: notebookUploads.note,
      uploadedAt: notebookUploads.uploadedAt,
      studentName: students.fullName,
    })
    .from(notebookUploads)
    .innerJoin(students, eq(students.id, notebookUploads.studentId))
    .where(eq(notebookUploads.id, uploadId))
    .limit(1)

  if (!row) notFound()

  const [link] = await db
    .select({ id: parentStudents.id })
    .from(parentStudents)
    .where(and(eq(parentStudents.parentId, parentId), eq(parentStudents.studentId, row.studentId)))
    .limit(1)
  if (!link) redirect("/parent/upload")

  const [review] = await db
    .select({ rating: teacherReviews.rating, note: teacherReviews.note })
    .from(teacherReviews)
    .where(eq(teacherReviews.uploadId, uploadId))
    .limit(1)

  const urls = await Promise.all(row.imagePaths.map((p) => signedNotebookUrl(p, 60 * 30)))

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <header className="mb-4">
        <h1 className="text-xl font-bold">{row.studentName}</h1>
        <p className="text-muted-foreground text-sm">
          {new Intl.DateTimeFormat("vi-VN", { dateStyle: "long", timeStyle: "short" }).format(
            new Date(row.uploadedAt),
          )}
        </p>
      </header>

      <div className="space-y-3">
        {urls.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={url} alt={`Trang ${i + 1}`} className="w-full rounded-xl border" />
        ))}
      </div>

      {review && (
        <section className="bg-card mt-4 rounded-xl border p-4 shadow-sm">
          <p className="text-xs font-semibold">Nhận xét của cô</p>
          <p className="mt-1 text-sm">{review.rating === "good" ? "Tốt" : "Cần hỗ trợ"}</p>
          {review.note && (
            <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">{review.note}</p>
          )}
        </section>
      )}

      {row.note && (
        <p className="bg-muted mt-4 rounded-xl p-3 text-sm whitespace-pre-wrap">{row.note}</p>
      )}

      <div className="mt-8">
        <Link href="/parent/upload" className={buttonVariants({ variant: "ghost" })}>
          ← Tất cả ảnh vở
        </Link>
      </div>
    </main>
  )
}
