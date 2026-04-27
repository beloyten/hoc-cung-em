// src/app/(parent)/parent/chat/page.tsx
// Trang chọn con để bắt đầu trò chuyện với Cô Mây.
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { classes, parentStudents, students } from "@/db/schema"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { BackLink, EmptyState, PageContainer, PageHeader } from "@/components/page-layout"
import { AI_PERSONA_NAME } from "@/lib/constants"
import { AuthError, requireParent } from "@/server/auth"
import { StartSessionButton } from "./start-session-button"

export const metadata: Metadata = {
  title: `Trò chuyện cùng ${AI_PERSONA_NAME}`,
}

export default async function ParentChatIndexPage() {
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

  const linkedStudents = await db
    .select({
      studentId: students.id,
      studentName: students.fullName,
      className: classes.name,
      verified: parentStudents.verifiedByTeacher,
    })
    .from(parentStudents)
    .innerJoin(students, eq(students.id, parentStudents.studentId))
    .innerJoin(classes, eq(classes.id, students.classId))
    .where(and(eq(parentStudents.parentId, parentId)))

  return (
    <PageContainer size="sm">
      <BackLink href="/parent/home">Trang chính</BackLink>
      <PageHeader
        className="mt-2"
        title={`Trò chuyện cùng ${AI_PERSONA_NAME}`}
        description={`Chọn con để ${AI_PERSONA_NAME} hỗ trợ học bài.`}
      />

      {linkedStudents.length === 0 ? (
        <EmptyState
          icon="👨‍👩‍👧"
          title="Bạn chưa liên kết với con nào"
          description="Nhập mã lớp do giáo viên cung cấp để bắt đầu."
          action={
            <Link href="/parent/link" className={buttonVariants()}>
              Liên kết với con
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {linkedStudents.map((s) => (
            <li
              key={s.studentId}
              className="bg-card flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{s.studentName}</p>
                  {!s.verified && (
                    <Badge variant="outline" className="text-xs">
                      Chờ giáo viên xác nhận
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">Lớp {s.className}</p>
              </div>
              <StartSessionButton studentId={s.studentId} disabled={!s.verified} />
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  )
}
