// src/app/(parent)/parent/reports/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq, inArray } from "drizzle-orm"
import { db } from "@/db"
import { parentStudents, students, weeklyReports } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
import { BackLink, EmptyState, PageContainer, PageHeader } from "@/components/page-layout"
import { AI_PERSONA_NAME } from "@/lib/constants"
import { AuthError, requireParent } from "@/server/auth"

export const metadata: Metadata = {
  title: "Báo cáo tuần",
}

function formatWeek(weekStart: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(weekStart))
}

function bullets(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string")
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
    <PageContainer size="sm">
      <BackLink href="/parent/home">Trang chính</BackLink>
      <PageHeader
        className="mt-2"
        title="Báo cáo tuần"
        description={`Tóm tắt tiến bộ của con sau mỗi tuần học cùng ${AI_PERSONA_NAME}.`}
      />

      {studentIds.length === 0 ? (
        <EmptyState
          icon="👨‍👩‍👧"
          title="Bạn chưa liên kết với con"
          description="Liên kết với con để nhận báo cáo tuần."
          action={
            <Link href="/parent/link" className={buttonVariants()}>
              Liên kết với con
            </Link>
          }
        />
      ) : reports.length === 0 ? (
        <EmptyState
          icon="📈"
          title="Chưa có báo cáo nào"
          description="Báo cáo đầu tiên sẽ gửi vào cuối tuần học đầu tiên của con."
        />
      ) : (
        <ul className="space-y-4">
          {reports.map((r) => {
            const highlights = bullets(r.progressHighlights)
            const improve = bullets(r.areasToImprove)
            const actions = bullets(r.suggestedActions)
            return (
              <li key={r.id} className="bg-card rounded-2xl border p-5 shadow-sm">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b pb-3">
                  <p className="font-semibold">{studentNameById.get(r.studentId) ?? "Con"}</p>
                  <p className="text-muted-foreground text-xs">Tuần {formatWeek(r.weekStart)}</p>
                </div>
                <p className="mb-4 text-sm">{r.summary}</p>

                <div className="space-y-3">
                  {highlights.length > 0 && (
                    <ReportBlock icon="✨" title="Điểm tiến bộ" items={highlights} tone="good" />
                  )}
                  {improve.length > 0 && (
                    <ReportBlock icon="🎯" title="Cần luyện thêm" items={improve} tone="warn" />
                  )}
                  {actions.length > 0 && (
                    <ReportBlock
                      icon="💡"
                      title="Gợi ý cho phụ huynh"
                      items={actions}
                      tone="info"
                    />
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </PageContainer>
  )
}

function ReportBlock({
  icon,
  title,
  items,
  tone,
}: {
  icon: string
  title: string
  items: string[]
  tone: "good" | "warn" | "info"
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50/60"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50/60"
        : "border-sky-200 bg-sky-50/60"
  return (
    <div className={`rounded-xl border p-3 ${toneClass}`}>
      <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
        <span aria-hidden="true">{icon}</span>
        {title}
      </p>
      <ul className="ml-5 list-disc space-y-0.5 text-sm">
        {items.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  )
}
