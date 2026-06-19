"use client"
import { useRef, useState } from "react"
import { SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const SAMPLE_QUESTIONS = [
  "Tuần này em nào đang gặp khó nhất?",
  "5 câu hỏi phổ biến nhất của lớp là gì?",
  "Học sinh nào chưa hoạt động 14 ngày qua?",
]

interface TeacherQueryWidgetProps {
  classId: string
  className: string
}

export function TeacherQueryWidget({ classId, className }: TeacherQueryWidgetProps) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  async function ask(q: string) {
    if (!q.trim() || loading) return
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setAnswer("")
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/teacher-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, question: q.trim() }),
        signal: ctrl.signal,
      })

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null
        setError(json?.error ?? "Có lỗi xảy ra. Vui lòng thử lại.")
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setError("Không đọc được phản hồi.")
        return
      }

      const decoder = new TextDecoder()
      let text = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setAnswer(text)
      }
      // Flush remaining bytes (important for multi-byte UTF-8 characters at chunk boundaries)
      const tail = decoder.decode()
      if (tail) {
        text += tail
        setAnswer(text)
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError("Không thể kết nối. Vui lòng thử lại.")
      }
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void ask(question)
  }

  return (
    <div className="bg-card rounded-2xl border p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SparklesIcon className="text-primary h-4 w-4" />
        <h3 className="text-sm font-semibold">Hỏi về lớp {className}</h3>
      </div>

      {/* Sample questions */}
      <div className="mb-3 flex flex-wrap gap-2">
        {SAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              setQuestion(q)
              void ask(q)
            }}
            disabled={loading}
            className="text-primary border-primary/30 hover:bg-primary/5 rounded-full border px-3 py-1 text-xs transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Hỏi bất kỳ điều gì về lớp học…"
          rows={2}
          className="flex-1 resize-none text-sm"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              void ask(question)
            }
          }}
        />
        <Button
          type="submit"
          size="sm"
          disabled={loading || !question.trim()}
          className="self-end transition-transform duration-100 active:scale-[0.97]"
        >
          {loading ? "Đang phân tích…" : "Hỏi"}
        </Button>
      </form>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {answer !== null && (
        <div className="bg-muted/50 mt-4 rounded-xl p-4">
          <p className="text-muted-foreground mb-1 text-xs font-medium">Phân tích AI</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {answer}
            {loading && <span className="animate-pulse">▌</span>}
          </p>
        </div>
      )}

      <p className="text-muted-foreground mt-3 text-xs">
        AI chỉ trả lời dựa trên dữ liệu thực của lớp — không suy đoán ngoài dữ liệu.
      </p>
    </div>
  )
}
