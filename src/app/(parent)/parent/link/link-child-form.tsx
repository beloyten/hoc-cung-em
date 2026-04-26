"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { linkChildAction } from "./actions"

const RELATIONSHIPS = [
  { value: "mother", label: "Mẹ" },
  { value: "father", label: "Bố" },
  { value: "guardian", label: "Người giám hộ" },
  { value: "other", label: "Khác" },
] as const

export function LinkChildForm({
  classId,
  students,
}: {
  classId: string
  students: Array<{ id: string; fullName: string }>
}) {
  const router = useRouter()
  const [studentId, setStudentId] = useState<string>(students[0]?.id ?? "")
  const [relationship, setRelationship] =
    useState<(typeof RELATIONSHIPS)[number]["value"]>("mother")
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!studentId) return
    start(async () => {
      const res = await linkChildAction({ classId, studentId, relationship })
      if (!res.ok) {
        setError(res.error.message)
        return
      }
      router.push("/parent/chat")
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Chọn con</Label>
        <div className="grid gap-2">
          {students.map((s) => (
            <label
              key={s.id}
              className={
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm " +
                (studentId === s.id ? "border-primary bg-primary/5" : "")
              }
            >
              <input
                type="radio"
                name="student"
                value={s.id}
                checked={studentId === s.id}
                onChange={() => setStudentId(s.id)}
              />
              <span>{s.fullName}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mối quan hệ</Label>
        <div className="flex flex-wrap gap-2">
          {RELATIONSHIPS.map((r) => (
            <Button
              key={r.value}
              type="button"
              variant={relationship === r.value ? "default" : "outline"}
              size="sm"
              onClick={() => setRelationship(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" disabled={pending || !studentId}>
        {pending ? "Đang liên kết..." : "Liên kết"}
      </Button>
      <p className="text-muted-foreground text-xs">
        Giáo viên sẽ xác nhận liên kết của bạn trước khi bạn có thể trò chuyện cùng Cô Mây.
      </p>
    </form>
  )
}
