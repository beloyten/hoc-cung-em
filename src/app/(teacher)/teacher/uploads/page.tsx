// src/app/(teacher)/teacher/uploads/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { classes, notebookUploads, students, teacherReviews } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { AuthError, requireTeacher } from "@/server/auth"
import { signedNotebookUrl } from "@/server/storage/notebooks"

export const metadata: Metadata = {
  title: "Vở học sinh",
}

export default async function TeacherUploadsPage() {
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

  const rows = await db
    .select({
      uploadId: notebookUploads.id,
      imagePaths: notebookUploads.imagePaths,
      uploadedAt: notebookUploads.uploadedAt,
      studentName: students.fullName,
      className: classes.name,
      reviewId: teacherReviews.id,
      rating: teacherReviews.rating,
    })
    .from(notebookUploads)
    .innerJoin(students, eq(students.id, notebookUploads.studentId))
    .innerJoin(classes, eq(classes.id, students.classId))
    .leftJoin(teacherReviews, eq(teacherReviews.uploadId, notebookUploads.id))
    .where(eq(classes.teacherId, teacherId))
    .orderBy(desc(notebookUploads.uploadedAt))
    .limit(40)

  const visible = rows.filter((r) => r.imagePaths?.length)

  const thumbs = await Promise.all(
    visible.map(async (r) => {
      const first = r.imagePaths[0]
      if (!first) return { id: r.uploadId, url: null }
      try {
        return { id: r.uploadId, url: await signedNotebookUrl(first, 60 * 30) }
      } catch {
        return { id: r.uploadId, url: null }
      }
    }),
  )
  const thumbById = new Map(thumbs.map((t) => [t.id, t.url]))

  const pending = visible.filter((r) => !r.reviewId)
  const reviewed = visible.filter((r) => r.reviewId)

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Vở học sinh</h1>
        <p className="text-muted-foreground text-sm">
          Phụ huynh tải ảnh vở của con. Cô vào chấm và để lại nhận xét ngắn.
        </p>
      </header>

      <h2 className="mb-3 text-lg font-semibold">
        Chờ chấm{pending.length > 0 ? ` (${pending.length})` : ""}
      </h2>
      {pending.length === 0 ? (
        <p className="text-muted-foreground mb-6 text-sm">Không có vở nào đang chờ.</p>
      ) : (
        <ul className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {pending.map((r) => (
            <li key={r.uploadId} className="bg-card overflow-hidden rounded-xl border shadow-sm">
              <Link href={`/teacher/uploads/${r.uploadId}`} className="block">
                {thumbById.get(r.uploadId) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbById.get(r.uploadId) ?? ""}
                    alt="vở"
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="bg-muted aspect-square w-full" />
                )}
                <div className="p-2 text-xs">
                  <p className="font-medium">{r.studentName}</p>
                  <p className="text-muted-foreground">
                    {r.className} ·{" "}
                    {new Intl.DateTimeFormat("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    }).format(new Date(r.uploadedAt))}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mb-3 text-lg font-semibold">Đã chấm</h2>
      {reviewed.length === 0 ? (
        <p className="text-muted-foreground text-sm">Chưa chấm vở nào.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {reviewed.map((r) => (
            <li key={r.uploadId} className="bg-card overflow-hidden rounded-xl border shadow-sm">
              <Link href={`/teacher/uploads/${r.uploadId}`} className="block">
                {thumbById.get(r.uploadId) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbById.get(r.uploadId) ?? ""}
                    alt="vở"
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="bg-muted aspect-square w-full" />
                )}
                <div className="p-2 text-xs">
                  <p className="font-medium">{r.studentName}</p>
                  <p className="text-muted-foreground">
                    {r.rating === "good" ? "Tốt" : r.rating === "needs_support" ? "Cần hỗ trợ" : ""}
                  </p>
                </div>
              </Link>
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
