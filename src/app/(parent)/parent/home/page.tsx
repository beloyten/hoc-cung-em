import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { and, desc, eq, gte, inArray } from "drizzle-orm"
import { db } from "@/db"
import { notebookUploads, parentStudents, students, studyTopics, teacherReviews } from "@/db/schema"
import { SignOutButton } from "@/components/sign-out-button"
import { ChildSummaryWidget } from "@/components/parent/child-summary-widget"
import { AI_PERSONA_NAME, APP_NAME } from "@/lib/constants"
import { AuthError, requireParent } from "@/server/auth"

export const metadata: Metadata = {
  title: "Trang chính — Phụ huynh",
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
}

export default async function ParentHomePage() {
  let parentId: string
  let parentName: string
  try {
    const { parent } = await requireParent()
    parentId = parent.id
    parentName = parent.fullName
  } catch (e) {
    if (e instanceof AuthError) {
      redirect(e.code === "UNAUTHENTICATED" ? "/login" : "/onboarding")
    }
    throw e
  }

  const myStudents = await db
    .select({
      id: students.id,
      fullName: students.fullName,
      classId: students.classId,
      verified: parentStudents.verifiedByTeacher,
    })
    .from(parentStudents)
    .innerJoin(students, eq(students.id, parentStudents.studentId))
    .where(eq(parentStudents.parentId, parentId))

  const verifiedStudents = myStudents.filter((s) => s.verified)
  const topicByClassId = new Map<string, string>()
  if (verifiedStudents.length === 1) {
    const cid = verifiedStudents[0]!.classId
    const [t] = await db
      .select({ title: studyTopics.title })
      .from(studyTopics)
      .where(eq(studyTopics.classId, cid))
      .orderBy(desc(studyTopics.weekNumber))
      .limit(1)
    if (t?.title) topicByClassId.set(cid, t.title)
  }
  const singleStudentTopic =
    verifiedStudents.length === 1 ? topicByClassId.get(verifiedStudents[0]!.classId) : undefined

  let recentReviews: Array<{ studentName: string; uploadId: string }> = []
  if (verifiedStudents.length > 0) {
    const sevenDaysAgo = daysAgo(7)
    recentReviews = await db
      .select({ studentName: students.fullName, uploadId: notebookUploads.id })
      .from(teacherReviews)
      .innerJoin(notebookUploads, eq(notebookUploads.id, teacherReviews.uploadId))
      .innerJoin(students, eq(students.id, notebookUploads.studentId))
      .where(
        and(
          inArray(
            notebookUploads.studentId,
            verifiedStudents.map((s) => s.id),
          ),
          gte(teacherReviews.reviewedAt, sevenDaysAgo),
        ),
      )
      .orderBy(desc(teacherReviews.reviewedAt))
      .limit(3)
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Xin chào, {parentName}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Hôm nay {AI_PERSONA_NAME} sẽ đồng hành cùng con · {APP_NAME}
          </p>
        </div>
        <SignOutButton />
      </div>

      <Link
        href="/parent/chat"
        className="from-primary/90 to-primary group hover:to-primary/90 mb-4 block rounded-2xl bg-linear-to-br p-6 text-white shadow-md transition-all hover:shadow-lg"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase opacity-80">
              Bắt đầu buổi học
            </p>
            <h2 className="mt-1 text-xl font-semibold">Trò chuyện cùng {AI_PERSONA_NAME}</h2>
            <p className="mt-2 text-sm opacity-90">
              Cô Mây gợi ý từng bước để con tự tìm ra đáp án — không cho đáp số ngay.
            </p>
            {singleStudentTopic && (
              <p className="mt-2 text-xs opacity-80">📚 Tuần này: {singleStudentTopic}</p>
            )}
          </div>
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </Link>

      {recentReviews.length > 0 && (
        <Link
          href={`/parent/upload/${recentReviews[0]!.uploadId}`}
          className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 transition-colors hover:bg-amber-100"
        >
          <span className="text-base" aria-hidden="true">
            📝
          </span>
          <span className="flex-1">
            Giáo viên đã chấm vở của <strong>{recentReviews[0]?.studentName}</strong>
            {recentReviews.length > 1 ? ` và ${recentReviews.length - 1} vở khác` : ""} — xem nhận
            xét
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Link
          href="/parent/upload"
          className="bg-card hover:border-primary/40 group flex flex-col gap-2 rounded-2xl border p-5 shadow-sm transition-colors"
        >
          <span className="text-2xl" aria-hidden="true">
            📷
          </span>
          <span className="font-medium">Tải ảnh vở</span>
          <span className="text-muted-foreground text-xs">Cô giáo sẽ xem & phản hồi</span>
        </Link>
        <Link
          href="/parent/reports"
          className="bg-card hover:border-primary/40 group flex flex-col gap-2 rounded-2xl border p-5 shadow-sm transition-colors"
        >
          <span className="text-2xl" aria-hidden="true">
            📈
          </span>
          <span className="font-medium">Báo cáo tuần</span>
          <span className="text-muted-foreground text-xs">Xem tiến bộ của con từng tuần</span>
        </Link>
        <Link
          href="/parent/link"
          className="bg-card hover:border-primary/40 group flex flex-col gap-2 rounded-2xl border p-5 shadow-sm transition-colors"
        >
          <span className="text-2xl" aria-hidden="true">
            👨‍👩‍👧
          </span>
          <span className="font-medium">Liên kết với con</span>
          <span className="text-muted-foreground text-xs">Nhập mã lớp & chọn con</span>
        </Link>
      </div>

      {verifiedStudents.length > 0 && <ChildSummaryWidget students={verifiedStudents} />}
    </main>
  )
}
