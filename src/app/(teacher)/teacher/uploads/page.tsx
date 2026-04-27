// src/app/(teacher)/teacher/uploads/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { classes, notebookUploads, students, teacherReviews } from "@/db/schema"
import { Badge } from "@/components/ui/badge"
import {
  BackLink,
  EmptyState,
  PageContainer,
  PageHeader,
  SectionHeader,
} from "@/components/page-layout"
import { AuthError, requireTeacher } from "@/server/auth"
import { signedNotebookUrl } from "@/server/storage/notebooks"

export const metadata: Metadata = {
  title: "Vở học sinh",
}

type UploadRow = {
  uploadId: string
  imagePaths: string[]
  uploadedAt: Date
  studentName: string
  className: string
  reviewId: string | null
  rating: string | null
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

  const visible: UploadRow[] = rows.filter((r) => r.imagePaths?.length)

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
    <PageContainer>
      <BackLink href="/teacher/dashboard">Bảng điều khiển</BackLink>
      <PageHeader
        className="mt-2"
        title="Vở học sinh"
        description="Phụ huynh tải ảnh vở của con. Cô vào chấm và để lại nhận xét ngắn."
      />

      <section className="mb-10">
        <SectionHeader title="Chờ chấm" count={pending.length} />
        {pending.length === 0 ? (
          <EmptyState
            icon="✨"
            title="Không có vở nào đang chờ"
            description="Khi phụ huynh tải ảnh vở mới, ảnh sẽ xuất hiện ở đây để cô chấm."
          />
        ) : (
          <UploadGrid items={pending} thumbById={thumbById} showRating={false} />
        )}
      </section>

      <section>
        <SectionHeader title="Đã chấm" count={reviewed.length} />
        {reviewed.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chưa chấm vở nào.</p>
        ) : (
          <UploadGrid items={reviewed} thumbById={thumbById} showRating />
        )}
      </section>
    </PageContainer>
  )
}

function UploadGrid({
  items,
  thumbById,
  showRating,
}: {
  items: UploadRow[]
  thumbById: Map<string, string | null>
  showRating: boolean
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((r) => {
        const url = thumbById.get(r.uploadId)
        return (
          <li
            key={r.uploadId}
            className="bg-card hover:border-primary/40 group overflow-hidden rounded-xl border shadow-sm transition-colors"
          >
            <Link href={`/teacher/uploads/${r.uploadId}`} className="block">
              <div className="relative aspect-square w-full bg-gray-100">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt={`vở ${r.studentName}`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl">📝</div>
                )}
                {r.imagePaths.length > 1 && (
                  <span className="absolute top-1.5 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {r.imagePaths.length} ảnh
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="truncate text-sm font-medium">{r.studentName}</p>
                <p className="text-muted-foreground text-xs">
                  Lớp {r.className} ·{" "}
                  {new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  }).format(new Date(r.uploadedAt))}
                </p>
                {showRating && r.rating && (
                  <Badge
                    variant={r.rating === "good" ? "default" : "secondary"}
                    className="mt-1.5 text-[10px]"
                  >
                    {r.rating === "good" ? "Tốt" : "Cần hỗ trợ"}
                  </Badge>
                )}
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
