"use client"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { currentWeekDates } from "@/lib/dates"
import type { TopicTemplate } from "@/db/schema"
import { createTopicAction } from "./actions"
import { TemplatePicker } from "./template-picker"

export function TopicCreateForm({
  classId,
  grade,
  subject,
}: {
  classId: string
  grade: number
  subject: string
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const defaults = useMemo(() => currentWeekDates(), [])

  // Controlled values — set when teacher picks a template
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [context, setContext] = useState("")

  function applyTemplate(t: TopicTemplate) {
    setTitle(t.title)
    setDescription(t.description ?? "")
    setContext(t.context ?? "")
  }

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
      setTitle("")
      setDescription("")
      setContext("")
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="classId" value={classId} />

      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          Điền thông tin chủ đề, hoặc chọn từ thư viện mẫu.
        </p>
        <TemplatePicker grade={grade} subject={subject} onSelect={applyTemplate} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`title-${classId}`} className="text-sm font-medium">
          Tiêu đề chủ đề <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`title-${classId}`}
          name="title"
          placeholder="vd: Phép cộng có nhớ trong phạm vi 1000"
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={`week-${classId}`} className="text-sm font-medium">
            Tuần <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`week-${classId}`}
            name="weekNumber"
            type="number"
            min={1}
            max={52}
            defaultValue={defaults.weekNumber}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`start-${classId}`} className="text-sm font-medium">
            Bắt đầu <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`start-${classId}`}
            name="startDate"
            type="date"
            defaultValue={defaults.startDate}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`end-${classId}`} className="text-sm font-medium">
            Kết thúc <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`end-${classId}`}
            name="endDate"
            type="date"
            defaultValue={defaults.endDate}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`desc-${classId}`} className="text-sm font-medium">
          Mô tả ngắn <span className="text-muted-foreground font-normal">— phụ huynh sẽ thấy</span>
        </Label>
        <Textarea
          id={`desc-${classId}`}
          name="description"
          rows={2}
          maxLength={500}
          placeholder="vd: Tuần này lớp ôn cộng có nhớ với số 4 chữ số."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`ctx-${classId}`} className="text-sm font-medium">
          Hướng dẫn cho Cô Mây{" "}
          <span className="text-muted-foreground font-normal">— giúp AI dạy đúng phương pháp</span>
        </Label>
        <Textarea
          id={`ctx-${classId}`}
          name="context"
          rows={4}
          maxLength={4000}
          placeholder="vd: Khuyến khích đặt tính dọc. Khi nhớ, viết số nhớ nhỏ phía trên cột bên trái."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <p className="text-muted-foreground text-xs">
          Cô Mây sẽ dùng nội dung này khi trò chuyện với học sinh để dạy đúng cách lớp đang học.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Đang lưu…" : "Lưu chủ đề"}
        </Button>
      </div>
    </form>
  )
}
