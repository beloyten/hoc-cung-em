// src/app/(teacher)/teacher/dashboard/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { and, count, eq, inArray, isNull } from "drizzle-orm"
import { db } from "@/db"
import { classes, parentStudents, students } from "@/db/schema"
import { SignOutButton } from "@/components/sign-out-button"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { EmptyState, PageContainer, PageHeader, SectionHeader } from "@/components/page-layout"
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

  const classIds = teacherClasses.map((c) => c.id)
  const studentCounts = classIds.length
    ? await db
        .select({ classId: students.classId, n: count(students.id) })
        .from(students)
        .where(and(isNull(students.deletedAt), inArray(students.classId, classIds)))
        .groupBy(students.classId)
    : []
  const studentCountByClass = new Map(studentCounts.map((s) => [s.classId, Number(s.n)]))

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

  const totalStudents = teacherClasses.reduce(
    (acc, c) => acc + (studentCountByClass.get(c.id) ?? 0),
    0,
  )

  return (
    <PageContainer size="lg">
      <PageHeader
        title={`Xin chào, ${teacherName}`}
        description={`Bảng điều khiển · ${APP_NAME}`}
        action={<SignOutButton />}
      />

      {/* Stat strip */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Lớp đang dạy" value={teacherClasses.length} />
        <Stat label="Học sinh" value={totalStudents} />
        <Stat
          label="Phụ huynh chờ duyệt"
          value={pendingLinks.length}
          highlight={pendingLinks.length > 0}
          href={pendingLinks.length > 0 ? "/teacher/parents" : undefined}
        />
      </div>

      <section className="mb-8">
        <SectionHeader
          title="Lớp học"
          action={
            <Link href="/teacher/classes/new" className={buttonVariants({ size: "sm" })}>
              + Tạo lớp mới
            </Link>
          }
        />
        {teacherClasses.length === 0 ? (
          <EmptyState
            icon="🎓"
            title="Bạn chưa có lớp nào"
            description="Tạo lớp đầu tiên để bắt đầu thêm học sinh và mời phụ huynh tham gia."
            action={
              <Link href="/teacher/classes/new" className={buttonVariants()}>
                + Tạo lớp đầu tiên
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {teacherClasses.map((c) => (
              <li
                key={c.id}
                className="bg-card hover:border-primary/30 group rounded-2xl border p-5 shadow-sm transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs">Lớp {c.grade}</p>
                    <h3 className="truncate text-lg font-semibold">{c.name}</h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {studentCountByClass.get(c.id) ?? 0} học sinh
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {c.joinCode}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  Mã trên dùng cho phụ huynh khi liên kết với con.
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-2">
        <SectionHeader
          title="Quản lý lớp"
          description="Mọi việc Cô Mây cần để dạy đúng nội dung."
        />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NavCard
            href="/teacher/topics"
            icon="📚"
            title="Chủ đề tuần"
            description="Đặt nội dung Cô Mây dạy mỗi tuần."
          />
          <NavCard
            href="/teacher/sessions"
            icon="💬"
            title="Lịch sử học"
            description="Xem hội thoại học sinh – Cô Mây."
          />
          <NavCard
            href="/teacher/insights"
            icon="📊"
            title="Insight tuần"
            description="Tổng hợp khái niệm khó cả lớp."
          />
          <NavCard
            href="/teacher/uploads"
            icon="📝"
            title="Vở học sinh"
            description="Chấm vở phụ huynh đã tải lên."
          />
        </ul>
      </section>
    </PageContainer>
  )
}

function Stat({
  label,
  value,
  highlight,
  href,
}: {
  label: string
  value: number
  highlight?: boolean
  href?: string
}) {
  const inner = (
    <div
      className={
        "rounded-2xl border p-4 shadow-sm transition-colors " +
        (highlight ? "border-amber-300 bg-amber-50" : "bg-card hover:border-primary/30")
      }
    >
      <p className={"text-xs " + (highlight ? "text-amber-700" : "text-muted-foreground")}>
        {label}
      </p>
      <p className={"mt-1 text-2xl font-semibold " + (highlight ? "text-amber-900" : "")}>
        {value}
      </p>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

function NavCard({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: string
  title: string
  description: string
}) {
  return (
    <li>
      <Link
        href={href}
        className="bg-card hover:border-primary/40 group flex h-full flex-col gap-2 rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md"
      >
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
        <span className="font-medium">{title}</span>
        <span className="text-muted-foreground text-xs">{description}</span>
      </Link>
    </li>
  )
}
