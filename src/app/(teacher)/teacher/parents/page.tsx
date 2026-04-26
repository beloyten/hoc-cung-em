// src/app/(teacher)/teacher/parents/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { and, eq, isNull } from "drizzle-orm"
import { db } from "@/db"
import { classes, parents, parentStudents, students } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { AuthError, requireTeacher } from "@/server/auth"
import { VerifyLinkButton } from "./verify-link-button"

export const metadata: Metadata = {
  title: "Duyệt phụ huynh",
}

const RELATIONSHIP_VI: Record<string, string> = {
  mother: "Mẹ",
  father: "Bố",
  guardian: "Người giám hộ",
  other: "Khác",
}

export default async function TeacherParentsPage() {
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
      linkId: parentStudents.id,
      relationship: parentStudents.relationship,
      verified: parentStudents.verifiedByTeacher,
      createdAt: parentStudents.createdAt,
      parentName: parents.fullName,
      parentEmail: parents.email,
      studentName: students.fullName,
      className: classes.name,
    })
    .from(parentStudents)
    .innerJoin(students, eq(students.id, parentStudents.studentId))
    .innerJoin(classes, eq(classes.id, students.classId))
    .innerJoin(parents, eq(parents.id, parentStudents.parentId))
    .where(and(eq(classes.teacherId, teacherId), isNull(students.deletedAt)))
    .orderBy(parentStudents.createdAt)

  const pending = rows.filter((r) => !r.verified)
  const verified = rows.filter((r) => r.verified)

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Duyệt phụ huynh</h1>
        <p className="text-muted-foreground text-sm">
          Xác nhận liên kết giữa phụ huynh và học sinh trước khi họ trò chuyện cùng Cô Mây.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-base font-semibold">Chờ duyệt ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-muted-foreground text-sm">Không có yêu cầu nào đang chờ.</p>
        ) : (
          <ul className="space-y-3">
            {pending.map((r) => (
              <li
                key={r.linkId}
                className="bg-card flex items-center justify-between rounded-2xl border p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium">
                    {r.parentName}
                    <span className="text-muted-foreground">
                      {" "}
                      · {RELATIONSHIP_VI[r.relationship] ?? r.relationship}
                    </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {r.parentEmail} · liên kết với <strong>{r.studentName}</strong> (Lớp{" "}
                    {r.className})
                  </p>
                </div>
                <VerifyLinkButton linkId={r.linkId} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">Đã duyệt ({verified.length})</h2>
        {verified.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chưa có liên kết nào.</p>
        ) : (
          <ul className="space-y-2">
            {verified.map((r) => (
              <li key={r.linkId} className="text-muted-foreground text-sm">
                {r.parentName} · {r.studentName} (Lớp {r.className})
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8">
        <Link href="/teacher/dashboard" className={buttonVariants({ variant: "ghost" })}>
          ← Bảng điều khiển
        </Link>
      </div>
    </main>
  )
}
