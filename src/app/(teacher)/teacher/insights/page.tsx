// src/app/(teacher)/teacher/insights/page.tsx
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { desc, eq, inArray } from "drizzle-orm"
import { db } from "@/db"
import { classes, weeklyInsights } from "@/db/schema"
import { BackLink, EmptyState, PageContainer, PageHeader } from "@/components/page-layout"
import { AuthError, requireTeacher } from "@/server/auth"

export const metadata: Metadata = {
  title: "Insight tuần",
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

interface AttentionItem {
  studentName: string
  note: string
}

function attentionItems(value: unknown): AttentionItem[] {
  if (!Array.isArray(value)) return []
  return value
    .filter(
      (v): v is AttentionItem =>
        typeof v === "object" &&
        v !== null &&
        typeof (v as { studentName?: unknown }).studentName === "string" &&
        typeof (v as { note?: unknown }).note === "string",
    )
    .map((v) => ({ studentName: v.studentName, note: v.note }))
}

export default async function TeacherInsightsPage() {
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

  const myClasses = await db
    .select({ id: classes.id, name: classes.name })
    .from(classes)
    .where(eq(classes.teacherId, teacherId))

  const classIds = myClasses.map((c) => c.id)
  const classNameById = new Map(myClasses.map((c) => [c.id, c.name]))

  const insights =
    classIds.length === 0
      ? []
      : await db
          .select()
          .from(weeklyInsights)
          .where(inArray(weeklyInsights.classId, classIds))
          .orderBy(desc(weeklyInsights.weekStart))
          .limit(20)

  return (
    <PageContainer>
      <BackLink href="/teacher/dashboard">Bảng điều khiển</BackLink>
      <PageHeader
        className="mt-2"
        title="Insight tuần"
        description="Tổng hợp khái niệm khó, học sinh cần chú ý và gợi ý dạy tuần tới."
      />

      {insights.length === 0 ? (
        <EmptyState
          icon="📊"
          title="Chưa có insight nào"
          description="Insight đầu tiên sẽ được tạo vào sáng thứ Hai sau tuần học đầu tiên của lớp."
        />
      ) : (
        <ul className="space-y-4">
          {insights.map((r) => {
            const errors = bullets(r.topErrors)
            const attention = attentionItems(r.studentAttention)
            const teaching = bullets(r.teachingSuggestions)
            return (
              <li key={r.id} className="bg-card rounded-2xl border p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b pb-3">
                  <p className="font-semibold">{classNameById.get(r.classId) ?? "Lớp"}</p>
                  <p className="text-muted-foreground text-xs">
                    Tuần bắt đầu {formatWeek(r.weekStart)}
                  </p>
                </div>

                <div className="space-y-4">
                  {errors.length > 0 && (
                    <InsightBlock
                      icon="⚠️"
                      title="Khái niệm nhiều em vướng"
                      items={errors.map((h, i) => (
                        <span key={i}>{h}</span>
                      ))}
                    />
                  )}
                  {attention.length > 0 && (
                    <InsightBlock
                      icon="👀"
                      title="Học sinh cần chú ý"
                      items={attention.map((a, i) => (
                        <span key={i}>
                          <strong>{a.studentName}:</strong> {a.note}
                        </span>
                      ))}
                    />
                  )}
                  {teaching.length > 0 && (
                    <InsightBlock
                      icon="💡"
                      title="Gợi ý dạy tuần tới"
                      items={teaching.map((h, i) => (
                        <span key={i}>{h}</span>
                      ))}
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

function InsightBlock({
  icon,
  title,
  items,
}: {
  icon: string
  title: string
  items: React.ReactNode[]
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
        <span aria-hidden="true">{icon}</span>
        {title}
      </p>
      <ul className="ml-6 list-disc space-y-1 text-sm">
        {items.map((node, i) => (
          <li key={i}>{node}</li>
        ))}
      </ul>
    </div>
  )
}
