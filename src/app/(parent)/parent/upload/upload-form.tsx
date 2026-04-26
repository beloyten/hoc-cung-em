// src/app/(parent)/parent/upload/upload-form.tsx
"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { uploadNotebookAction } from "./actions"

interface Child {
  id: string
  fullName: string
}

export function UploadForm({ childrenList }: { childrenList: Child[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [studentId, setStudentId] = useState<string>(childrenList[0]?.id ?? "")
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [note, setNote] = useState("")

  if (childrenList.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Bạn chưa liên kết với con. Hãy liên kết để tải vở.
      </p>
    )
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!studentId) {
      setError("Hãy chọn con")
      return
    }
    if (files.length === 0) {
      setError("Hãy chọn ít nhất 1 ảnh")
      return
    }
    const fd = new FormData()
    fd.set("studentId", studentId)
    fd.set("note", note)
    for (const f of files) fd.append("files", f)
    startTransition(async () => {
      const res = await uploadNotebookAction(fd)
      if (!res.ok) {
        setError(res.error.message)
        return
      }
      setFiles([])
      setNote("")
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Chọn con</label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
        >
          {childrenList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Ảnh vở (tối đa 6, mỗi ảnh ≤10MB)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="text-sm"
        />
        {files.length > 0 && (
          <p className="text-muted-foreground mt-1 text-xs">{files.length} ảnh đã chọn</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Ghi chú (tuỳ chọn)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          maxLength={1000}
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Hôm nay con học bài về phân số…"
        />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Đang tải…" : "Tải lên"}
      </Button>
    </form>
  )
}
