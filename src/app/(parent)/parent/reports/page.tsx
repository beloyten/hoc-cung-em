// src/app/(parent)/parent/reports/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq, inArray } from "drizzle-orm"
import { db } from "@/db"
import { parentStudents, students, weeklyReports } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { AI_PERSONA_NAME } from "@/lib/constants"
import { AuthError, requireParent } from "@/server/auth"

export const metadata: Metadata = {
  title: "Báo cáo tuần",
}

function formatWeek(weekStart: string): string {
  const d = new Date(weekStart)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

function bullets(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string")
  }
  return []
}

export default async function ParentReportsPage() {
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

  const myStudents = await db
    .select({ id: students.id, fullName: students.fullName })
    .from(parentStudents)
    .innerJoin(students, eq(students.id, parentStudents.studentId))
    .where(eq(parentStudents.parentId, parentId))

  const studentIds = myStudents.map((s) => s.id)
  const studentNameById = new Map(myStudents.map((s) => [s.id, s.fullName]))

  const reports =
    studentIds.length === 0
      ? []
      : await db
          .select({
            id: weeklyReports.id,
            studentId: weeklyReports.studentId,
            weekStart: weeklyReports.weekStart,
            summary: weeklyReports.summary,
            progressHighlights: weeklyReports.progressHighlights,
            areasToImprove: weeklyReports.areasToImprove,
            suggestedActions: weeklyReports.suggestedActions,
            generatedAt: weeklyReports.generatedAt,
          })
          .from(weeklyReports)
          .where(inArray(weeklyReports.studentId, studentIds))
          .orderBy(desc(weeklyReports.weekStart))
          .limit(20)

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Báo cáo tuần</h1>
        <p className="text-muted-foreground text-sm">
          Tóm tắt tiến bộ của con sau mỗi tuần học cùng {AI_PERSONA_NAME}.
        </p>
      </header>

      {studentIds.length === 0 && (
        <div className="bg-card rounded-2xl border p-6 text-sm shadow-sm">
          <p className="mb-3">Bạn chưa liên kết với con. Hãy liên kết để nhận báo cáo tuần.</p>
          <Link href="/parent/link" className={buttonVariants({ variant: "default" })}>
            Liên kết với con
          </Link>
        </div>
      )}

      {studentIds.length > 0 && reports.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Chưa có báo cáo. Báo cáo đầu tiên sẽ gửi vào cuối tuần học đầu tiên của con.
        </p>
      )}

      <ul className="space-y-3">
        {reports.map((r) => {
          const highlights = bullets(r.progressHighlights)
          const improve = bullets(r.areasToImprove)
          const actions = bullets(r.suggestedActions)
          return (
            <li key={r.id} className="bg-card rounded-2xl border p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium">{studentNameById.get(r.studentId) ?? "Con"}</p>
                <p className="text-muted-foreground text-xs">Tuần {formatWeek(r.weekStart)}</p>
              </div>
              <p className="mb-3 text-sm">{r.summary}</p>

              {highlights.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold">Điểm tiến bộ</p>
                  <ul className="ml-5 list-disc text-sm">
                    {highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
              {improve.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold">Cần luyện thêm</p>
                  <ul className="ml-5 list-disc text-sm">
                    {improve.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
              {actions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold">Gợi ý cho phụ huynh</p>
                  <ul className="ml-5 list-disc text-sm">
                    {actions.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-8">
        <Link href="/parent/home" className={buttonVariants({ variant: "ghost" })}>
          ← Trang chính
        </Link>
      </div>
    </main>
  )
}
