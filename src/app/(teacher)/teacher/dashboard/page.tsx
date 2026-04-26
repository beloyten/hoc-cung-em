// src/app/(teacher)/teacher/dashboard/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { and, eq, isNull } from "drizzle-orm"
import { db } from "@/db"
import { classes, parentStudents, students } from "@/db/schema"
import { SignOutButton } from "@/components/sign-out-button"
import { buttonVariants } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"
import { AuthError, requireTeacher } from "@/server/auth"

export const metadata: Metadata = {
  title: "Bảng điều khiển — Giáo viên",
}

export default async function TeacherDashboardPage() {
  let teacherName: string
  let teacherId: string
  try {
    const { teacher } = await requireTeacher()
    teacherName = teacher.fullName
    teacherId = teacher.id
  } catch (e) {
    if (e instanceof AuthError) {
      redirect(e.code === "UNAUTHENTICATED" ? "/login" : "/onboarding")
    }
    throw e
  }

  const teacherClasses = await db
    .select({
      id: classes.id,
      name: classes.name,
      grade: classes.grade,
      joinCode: classes.joinCode,
    })
    .from(classes)
    .where(eq(classes.teacherId, teacherId))

  const pendingLinks = await db
    .select({ id: parentStudents.id })
    .from(parentStudents)
    .innerJoin(students, eq(students.id, parentStudents.studentId))
    .innerJoin(classes, eq(classes.id, students.classId))
    .where(
      and(
        eq(classes.teacherId, teacherId),
        eq(parentStudents.verifiedByTeacher, false),
        isNull(students.deletedAt),
      ),
    )

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Xin chào, {teacherName}</h1>
          <p className="text-muted-foreground text-sm">Bảng điều khiển · {APP_NAME}</p>
        </div>
        <SignOutButton />
      </div>

      <section className="mb-6 grid gap-3 md:grid-cols-2">
        {teacherClasses.map((c) => (
          <div key={c.id} className="bg-card rounded-2xl border p-5 shadow-sm">
            <p className="text-muted-foreground text-xs">Lớp {c.grade}</p>
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="mt-2 text-sm">
              Mã liên kết phụ huynh:{" "}
              <code className="bg-muted rounded px-2 py-1 font-mono text-base">{c.joinCode}</code>
            </p>
          </div>
        ))}
      </section>

      <section className="bg-card mb-6 flex items-center justify-between rounded-2xl border p-5 shadow-sm">
        <div>
          <h3 className="font-semibold">Liên kết phụ huynh</h3>
          <p className="text-muted-foreground text-sm">
            {pendingLinks.length === 0
              ? "Không có yêu cầu nào đang chờ."
              : `${pendingLinks.length} yêu cầu đang chờ duyệt.`}
          </p>
        </div>
        <Link href="/teacher/parents" className={buttonVariants({ variant: "default" })}>
          Mở
        </Link>
      </section>

      <div className="bg-card rounded-2xl border p-6 shadow-sm">
        <p className="text-muted-foreground mb-3 text-sm">Quản lý nội dung Cô Mây dạy con bạn:</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/teacher/topics" className={buttonVariants({ variant: "outline" })}>
            Chủ đề tuần
          </Link>
          <Link href="/teacher/sessions" className={buttonVariants({ variant: "outline" })}>
            Lịch sử học
          </Link>
          <Link href="/teacher/insights" className={buttonVariants({ variant: "outline" })}>
            Insight tuần
          </Link>
          <Link href="/teacher/uploads" className={buttonVariants({ variant: "outline" })}>
            Vở học sinh
          </Link>
        </div>
      </div>
    </main>
  )
}
