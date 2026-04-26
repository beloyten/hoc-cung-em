// src/app/(teacher)/teacher/insights/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq, inArray } from "drizzle-orm"
import { db } from "@/db"
import { classes, weeklyInsights } from "@/db/schema"
import { buttonVariants } from "@/components/ui/button"
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
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Insight tuần</h1>
        <p className="text-muted-foreground text-sm">
          Tổng hợp khái niệm khó, học sinh cần chú ý và gợi ý dạy tuần tới.
        </p>
      </header>

      {insights.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Chưa có insight. Insight đầu tiên sẽ được tạo vào sáng thứ Hai sau tuần học đầu tiên.
        </p>
      )}

      <ul className="space-y-3">
        {insights.map((r) => {
          const errors = bullets(r.topErrors)
          const attention = attentionItems(r.studentAttention)
          const teaching = bullets(r.teachingSuggestions)
          return (
            <li key={r.id} className="bg-card rounded-2xl border p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">{classNameById.get(r.classId) ?? "Lớp"}</p>
                <p className="text-muted-foreground text-xs">
                  Tuần bắt đầu {formatWeek(r.weekStart)}
                </p>
              </div>

              {errors.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold">Khái niệm nhiều em vướng</p>
                  <ul className="ml-5 list-disc text-sm">
                    {errors.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
              {attention.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold">Học sinh cần chú ý</p>
                  <ul className="ml-5 list-disc text-sm">
                    {attention.map((a, i) => (
                      <li key={i}>
                        <span className="font-medium">{a.studentName}:</span> {a.note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {teaching.length > 0 && (
                <div>
                  <p className="text-xs font-semibold">Gợi ý dạy tuần tới</p>
                  <ul className="ml-5 list-disc text-sm">
                    {teaching.map((h, i) => (
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
        <Link href="/teacher/dashboard" className={buttonVariants({ variant: "ghost" })}>
          ← Bảng điều khiển
        </Link>
      </div>
    </main>
  )
}
