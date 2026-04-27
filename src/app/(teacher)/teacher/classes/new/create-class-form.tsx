"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClassAction } from "./actions"

const GRADE_OPTIONS = [1, 2, 3, 4, 5]

export function CreateClassForm() {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await createClassAction(fd)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="class-name">Tên lớp</Label>
          <Input
            id="class-name"
            name="name"
            required
            placeholder="vd: 4A1"
            maxLength={50}
            disabled={pending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="class-grade">Khối</Label>
          <select
            id="class-grade"
            name="grade"
            title="Chọn khối lớp"
            defaultValue={4}
            disabled={pending}
            className="border-input bg-background h-9 w-full rounded-md border px-3 py-1 text-sm"
          >
            {GRADE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                Khối {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="student-names">
          Danh sách học sinh{" "}
          <span className="text-muted-foreground font-normal">(mỗi em 1 dòng, tối đa 60)</span>
        </Label>
        <textarea
          id="student-names"
          name="studentNames"
          rows={8}
          disabled={pending}
          placeholder={"Nguyễn An\nTrần Bình\nLê Châu\n..."}
          className="border-input bg-background placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm leading-relaxed"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Đang tạo…" : "Tạo lớp"}
        </Button>
        <Button type="button" variant="outline" disabled={pending} onClick={() => history.back()}>
          Huỷ
        </Button>
      </div>
    </form>
  )
}
