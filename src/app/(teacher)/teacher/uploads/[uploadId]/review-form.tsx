// src/app/(teacher)/teacher/uploads/[uploadId]/review-form.tsx
"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { reviewUploadAction } from "../actions"

type Rating = "good" | "needs_support"

export function ReviewForm({
  uploadId,
  initialRating,
  initialNote,
}: {
  uploadId: string
  initialRating: Rating | null
  initialNote: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [rating, setRating] = useState<Rating | null>(initialRating)
  const [note, setNote] = useState(initialNote)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    if (!rating) {
      setError("Hãy chọn mức đánh giá")
      return
    }
    const fd = new FormData()
    fd.set("uploadId", uploadId)
    fd.set("rating", rating)
    fd.set("note", note)
    startTransition(async () => {
      const res = await reviewUploadAction(fd)
      if (!res.ok) {
        setError(res.error.message)
        return
      }
      setSaved(true)
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium">Đánh giá</p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={rating === "good" ? "default" : "outline"}
            onClick={() => setRating("good")}
          >
            Tốt
          </Button>
          <Button
            type="button"
            variant={rating === "needs_support" ? "default" : "outline"}
            onClick={() => setRating("needs_support")}
          >
            Cần hỗ trợ
          </Button>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Nhận xét (tuỳ chọn)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Con làm phép cộng phân số rất tốt, cần luyện thêm phép trừ…"
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      {saved && <p className="text-sm text-green-600">Đã lưu</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Đang lưu…" : "Lưu nhận xét"}
      </Button>
    </form>
  )
}
