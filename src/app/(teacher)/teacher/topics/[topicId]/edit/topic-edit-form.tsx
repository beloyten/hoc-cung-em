"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateTopicAction } from "../../actions"

type Initial = {
  topicId: string
  title: string
  weekNumber: number
  startDate: string
  endDate: string
  description: string | null
  context: string | null
}

export function TopicEditForm({ initial }: { initial: Initial }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set("topicId", initial.topicId)
    start(async () => {
      const res = await updateTopicAction(fd)
      if (!res.ok) {
        setError(res.error.message)
        return
      }
      setSavedAt(new Date().toLocaleTimeString("vi-VN"))
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Tiêu đề chủ đề <span className="text-red-500">*</span>
        </Label>
        <Input id="title" name="title" defaultValue={initial.title} required maxLength={200} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="weekNumber" className="text-sm font-medium">
            Tuần <span className="text-red-500">*</span>
          </Label>
          <Input
            id="weekNumber"
            name="weekNumber"
            type="number"
            min={1}
            max={52}
            defaultValue={initial.weekNumber}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Bắt đầu <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={initial.startDate}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            Kết thúc <span className="text-red-500">*</span>
          </Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={initial.endDate} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Mô tả ngắn <span className="text-muted-foreground font-normal">— phụ huynh sẽ thấy</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={2}
          maxLength={500}
          defaultValue={initial.description ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="context" className="text-sm font-medium">
          Hướng dẫn cho Cô Mây{" "}
          <span className="text-muted-foreground font-normal">— giúp AI dạy đúng phương pháp</span>
        </Label>
        <Textarea
          id="context"
          name="context"
          rows={5}
          maxLength={4000}
          defaultValue={initial.context ?? ""}
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {savedAt && !error && <p className="text-sm text-emerald-700">Đã lưu lúc {savedAt}.</p>}

      <div className="flex justify-between gap-2">
        <Link href="/teacher/topics" className={buttonVariants({ variant: "ghost" })}>
          ← Quay lại danh sách
        </Link>
        <Button type="submit" disabled={pending}>
          {pending ? "Đang lưu…" : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  )
}
