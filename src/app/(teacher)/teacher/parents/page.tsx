// src/app/(teacher)/teacher/parents/page.tsx
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { and, eq, isNull } from "drizzle-orm"
import { db } from "@/db"
import { classes, parents, parentStudents, students } from "@/db/schema"
import { Badge } from "@/components/ui/badge"
import {
  BackLink,
  EmptyState,
  PageContainer,
  PageHeader,
  SectionHeader,
} from "@/components/page-layout"
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
    <PageContainer>
      <BackLink href="/teacher/dashboard">Bảng điều khiển</BackLink>
      <PageHeader
        className="mt-2"
        title="Duyệt phụ huynh"
        description="Xác nhận liên kết giữa phụ huynh và học sinh trước khi họ trò chuyện cùng Cô Mây."
      />

      <section className="mb-8">
        <SectionHeader title="Chờ duyệt" count={pending.length} />
        {pending.length === 0 ? (
          <EmptyState
            icon="✅"
            title="Không có yêu cầu nào đang chờ"
            description="Khi có phụ huynh đăng ký liên kết với học sinh, họ sẽ xuất hiện ở đây."
          />
        ) : (
          <ul className="space-y-3">
            {pending.map((r) => (
              <li
                key={r.linkId}
                className="bg-card flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{r.parentName}</p>
                    <Badge variant="secondary" className="text-xs">
                      {RELATIONSHIP_VI[r.relationship] ?? r.relationship}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs break-all">{r.parentEmail}</p>
                  <p className="text-muted-foreground text-xs">
                    Liên kết với <strong>{r.studentName}</strong> · Lớp {r.className}
                  </p>
                </div>
                <VerifyLinkButton linkId={r.linkId} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionHeader title="Đã duyệt" count={verified.length} />
        {verified.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chưa có liên kết nào.</p>
        ) : (
          <ul className="space-y-2">
            {verified.map((r) => (
              <li
                key={r.linkId}
                className="bg-card flex items-center justify-between rounded-xl border px-4 py-2 text-sm"
              >
                <span>
                  <strong>{r.parentName}</strong>{" "}
                  <span className="text-muted-foreground">
                    · {RELATIONSHIP_VI[r.relationship] ?? r.relationship} của {r.studentName}
                  </span>
                </span>
                <span className="text-muted-foreground text-xs">Lớp {r.className}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageContainer>
  )
}
