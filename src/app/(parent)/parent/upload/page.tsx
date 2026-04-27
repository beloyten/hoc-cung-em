// src/app/(parent)/parent/upload/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq, inArray } from "drizzle-orm"
import { db } from "@/db"
import { notebookUploads, parentStudents, students } from "@/db/schema"
import {
  BackLink,
  EmptyState,
  PageContainer,
  PageHeader,
  SectionHeader,
} from "@/components/page-layout"
import { AuthError, requireParent } from "@/server/auth"
import { signedNotebookUrl } from "@/server/storage/notebooks"
import { UploadForm } from "./upload-form"

export const metadata: Metadata = {
  title: "Tải ảnh vở của con",
}

export default async function ParentUploadPage() {
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

  const myChildren = await db
    .select({ id: students.id, fullName: students.fullName })
    .from(parentStudents)
    .innerJoin(students, eq(students.id, parentStudents.studentId))
    .where(eq(parentStudents.parentId, parentId))

  const studentIds = myChildren.map((c) => c.id)
  const childNameById = new Map(myChildren.map((c) => [c.id, c.fullName]))

  const uploads =
    studentIds.length === 0
      ? []
      : await db
          .select({
            id: notebookUploads.id,
            studentId: notebookUploads.studentId,
            imagePaths: notebookUploads.imagePaths,
            note: notebookUploads.note,
            uploadedAt: notebookUploads.uploadedAt,
          })
          .from(notebookUploads)
          .where(inArray(notebookUploads.studentId, studentIds))
          .orderBy(desc(notebookUploads.uploadedAt))
          .limit(20)

  const visible = uploads.filter((u) => !!u.imagePaths?.length)
  // Tạo signed URL ảnh đầu tiên để hiển thị thumbnail
  const thumbs = await Promise.all(
    visible.map(async (u) => {
      const first = u.imagePaths[0]
      if (!first) return { id: u.id, url: null }
      try {
        const url = await signedNotebookUrl(first, 60 * 30)
        return { id: u.id, url }
      } catch {
        return { id: u.id, url: null }
      }
    }),
  )
  const thumbById = new Map(thumbs.map((t) => [t.id, t.url]))

  return (
    <PageContainer size="sm">
      <BackLink href="/parent/home">Trang chính</BackLink>
      <PageHeader
        className="mt-2"
        title="Tải ảnh vở của con"
        description="Cô giáo sẽ xem và phản hồi từng bài. Ảnh được lưu riêng tư cho lớp."
      />

      <section className="bg-card mb-10 rounded-2xl border p-6 shadow-sm">
        <UploadForm childrenList={myChildren} />
      </section>

      <SectionHeader title="Đã tải gần đây" count={visible.length} />
      {visible.length === 0 ? (
        <EmptyState
          icon="📷"
          title="Chưa có ảnh vở nào"
          description="Khi bạn tải ảnh, cô giáo sẽ thấy và phản hồi."
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {visible.map((u) => {
            const thumb = thumbById.get(u.id)
            return (
              <li
                key={u.id}
                className="bg-card hover:border-primary/40 group overflow-hidden rounded-xl border shadow-sm transition-colors"
              >
                <Link href={`/parent/upload/${u.id}`} className="block">
                  <div className="relative aspect-square w-full bg-gray-100">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt="vở của con"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">
                        📷
                      </div>
                    )}
                    {u.imagePaths.length > 1 && (
                      <span className="absolute top-1.5 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        {u.imagePaths.length} ảnh
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-sm font-medium">
                      {childNameById.get(u.studentId) ?? ""}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Intl.DateTimeFormat("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      }).format(new Date(u.uploadedAt))}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </PageContainer>
  )
}
