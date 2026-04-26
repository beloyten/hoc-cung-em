// src/app/(parent)/parent/upload/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq, inArray } from "drizzle-orm"
import { db } from "@/db"
import { notebookUploads, parentStudents, students } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
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
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Tải ảnh vở của con</h1>
        <p className="text-muted-foreground text-sm">
          Cô giáo sẽ xem và phản hồi từng bài. Ảnh được lưu riêng tư cho lớp.
        </p>
      </header>

      <section className="bg-card mb-8 rounded-2xl border p-6 shadow-sm">
        <UploadForm childrenList={myChildren} />
      </section>

      <h2 className="mb-3 text-lg font-semibold">Đã tải</h2>
      {visible.length === 0 ? (
        <p className="text-muted-foreground text-sm">Chưa có ảnh nào.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {visible.map((u) => {
            const thumb = thumbById.get(u.id)
            return (
              <li key={u.id} className="bg-card overflow-hidden rounded-xl border shadow-sm">
                <Link href={`/parent/upload/${u.id}`} className="block">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt="vở của con"
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="bg-muted aspect-square w-full" />
                  )}
                  <div className="p-2 text-xs">
                    <p className="font-medium">{childNameById.get(u.studentId) ?? ""}</p>
                    <p className="text-muted-foreground">
                      {new Intl.DateTimeFormat("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      }).format(new Date(u.uploadedAt))}
                      {u.imagePaths.length > 1 ? ` · ${u.imagePaths.length} ảnh` : ""}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-8">
        <Link href="/parent/home" className={buttonVariants({ variant: "ghost" })}>
          ← Trang chính
        </Link>
      </div>
    </main>
  )
}
