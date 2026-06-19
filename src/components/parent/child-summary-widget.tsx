"use client"
import { useState } from "react"
import { SparklesIcon } from "lucide-react"
import type { ChildSummaryResult } from "@/app/api/parent-child-summary/route"

interface ChildSummaryWidgetProps {
  students: Array<{ id: string; fullName: string }>
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="mt-1 space-y-0.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-1.5 text-sm">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function ChildSummaryWidget({ students }: ChildSummaryWidgetProps) {
  const [selectedId, setSelectedId] = useState<string>(students[0]?.id ?? "")
  const [summary, setSummary] = useState<ChildSummaryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchSummary(studentId: string) {
    if (loading) return
    setLoading(true)
    setSummary(null)
    setError(null)
    try {
      const res = await fetch("/api/parent-child-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      })
      const data = (await res.json()) as ChildSummaryResult & { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Có lỗi xảy ra. Vui lòng thử lại.")
        return
      }
      setSummary(data)
    } catch {
      setError("Không thể kết nối. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  if (students.length === 0) return null

  return (
    <div className="bg-card rounded-2xl border p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <SparklesIcon className="text-primary h-4 w-4" />
        <h2 className="text-sm font-semibold">Hỏi AI về con</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {students.length > 1 && (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={loading}
            title="Chọn con"
            className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          disabled={loading || !selectedId}
          onClick={() => void fetchSummary(selectedId)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-100 active:scale-[0.97] disabled:opacity-50"
        >
          {loading
            ? "Đang phân tích…"
            : `Tóm tắt tuần của ${students.find((s) => s.id === selectedId)?.fullName ?? "con"}`}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {loading && (
        <div className="mt-4 animate-pulse space-y-2">
          <div className="bg-muted h-4 w-3/4 rounded" />
          <div className="bg-muted h-4 w-1/2 rounded" />
          <div className="bg-muted h-4 w-2/3 rounded" />
        </div>
      )}

      {summary && !loading && (
        <div className="mt-4 space-y-4">
          <p className="leading-snug font-medium">{summary.headline}</p>

          {summary.activeTopics.length > 0 && (
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Chủ đề đã học
              </p>
              <BulletList items={summary.activeTopics} />
            </div>
          )}

          {summary.strengths.length > 0 && (
            <div className="text-emerald-700">
              <p className="text-xs font-semibold tracking-wide uppercase opacity-70">
                Điểm nổi bật
              </p>
              <BulletList items={summary.strengths} />
            </div>
          )}

          {summary.needsAttention.length > 0 && (
            <div className="text-amber-700">
              <p className="text-xs font-semibold tracking-wide uppercase opacity-70">
                Cần luyện thêm
              </p>
              <BulletList items={summary.needsAttention} />
            </div>
          )}

          {summary.parentTip && (
            <div className="rounded-xl bg-sky-50 p-3">
              <p className="text-xs font-semibold text-sky-700">💡 Gợi ý cho bạn hôm nay</p>
              <p className="mt-1 text-sm text-sky-800">{summary.parentTip}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-muted-foreground mt-3 text-xs">
        Phân tích dựa trên hội thoại thực của con với Cô Mây trong 14 ngày qua.
      </p>
    </div>
  )
}
