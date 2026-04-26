"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTopicAction } from "./actions"

export function TopicCreateForm({ classId }: { classId: string }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set("classId", classId)
    const form = e.currentTarget
    start(async () => {
      const res = await createTopicAction(fd)
      if (!res.ok) {
        setError(res.error.message)
        return
      }
      form.reset()
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="classId" value={classId} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label htmlFor={`title-${classId}`}>Tiêu đề</Label>
          <Input
            id={`title-${classId}`}
            name="title"
            placeholder="Ví dụ: Phép cộng trong phạm vi 1000"
            required
          />
        </div>
        <div>
          <Label htmlFor={`week-${classId}`}>Tuần</Label>
          <Input id={`week-${classId}`} name="weekNumber" type="number" min={1} max={52} required />
        </div>
        <div>
          <Label htmlFor={`start-${classId}`}>Bắt đầu</Label>
          <Input id={`start-${classId}`} name="startDate" type="date" required />
        </div>
        <div>
          <Label htmlFor={`end-${classId}`}>Kết thúc</Label>
          <Input id={`end-${classId}`} name="endDate" type="date" required />
        </div>
      </div>
      <div>
        <Label htmlFor={`desc-${classId}`}>Mô tả ngắn (cho phụ huynh đọc)</Label>
        <Textarea id={`desc-${classId}`} name="description" rows={2} />
      </div>
      <div>
        <Label htmlFor={`ctx-${classId}`}>
          Ngữ cảnh cho Cô Mây (cách giải thích, các điểm cần nhấn)
        </Label>
        <Textarea
          id={`ctx-${classId}`}
          name="context"
          rows={3}
          placeholder="Ví dụ: Tuần này lớp đang học cộng có nhớ. Khuyến khích đặt tính dọc..."
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Đang lưu..." : "Lưu chủ đề"}
      </Button>
    </form>
  )
}
