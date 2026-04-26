// src/app/(parent)/parent/chat/page.tsx
// Trang chọn con để bắt đầu trò chuyện với Cô Mây.
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { classes, parentStudents, students } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
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
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Trò chuyện cùng {AI_PERSONA_NAME}</h1>
        <p className="text-muted-foreground text-sm">
          Chọn con để {AI_PERSONA_NAME} hỗ trợ học bài.
        </p>
      </div>

      {linkedStudents.length === 0 ? (
        <div className="bg-card rounded-2xl border p-6 shadow-sm">
          <p className="mb-3 text-sm">
            Bạn chưa liên kết với con nào. Liên hệ giáo viên để lấy mã lớp và liên kết.
          </p>
          <Link href="/parent/home" className="text-primary underline-offset-4 hover:underline">
            Quay lại trang chính
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {linkedStudents.map((s) => (
            <li
              key={s.studentId}
              className="bg-card flex items-center justify-between rounded-2xl border p-4 shadow-sm"
            >
              <div>
                <p className="font-medium">{s.studentName}</p>
                <p className="text-muted-foreground text-xs">
                  Lớp {s.className}
                  {s.verified ? "" : " · chờ giáo viên xác nhận"}
                </p>
              </div>
              <StartSessionButton studentId={s.studentId} disabled={!s.verified} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <Link href="/parent/home" className={buttonVariants({ variant: "ghost" })}>
          ← Quay lại
        </Link>
      </div>
    </main>
  )
}
