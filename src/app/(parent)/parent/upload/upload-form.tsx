// src/app/(parent)/parent/upload/upload-form.tsx
"use client"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { uploadNotebookAction } from "./actions"

interface Child {
  id: string
  fullName: string
}

const MAX_FILES = 6

export function UploadForm({ childrenList }: { childrenList: Child[] }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [pending, startTransition] = useTransition()
  const [studentId, setStudentId] = useState<string>(childrenList[0]?.id ?? "")
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [note, setNote] = useState("")

  // Tạo URL preview từ files (derived state)
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])

  // Dọn URL khi previews đổi (tránh leak)
  useEffect(() => {
    return () => {
      previews.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [previews])

  if (childrenList.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Bạn chưa liên kết với con. Hãy liên kết để tải vở.
      </p>
    )
  }

  function pickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? [])
    const merged = [...files, ...list].slice(0, MAX_FILES)
    setFiles(merged)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeAt(idx: number) {
    setFiles((arr) => arr.filter((_, i) => i !== idx))
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
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="upload-student" className="block text-sm font-medium">
          Chọn con
        </label>
        <select
          id="upload-student"
          title="Chọn con"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
        >
          {childrenList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="block text-sm font-medium">Ảnh vở của con</span>
          <span className="text-muted-foreground text-xs">
            {files.length}/{MAX_FILES} · mỗi ảnh ≤10MB
          </span>
        </div>

        <input
          ref={fileInputRef}
          id="upload-files"
          title="Chọn ảnh vở của con"
          aria-label="Chọn ảnh vở của con"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          onChange={pickFiles}
          className="sr-only"
        />

        {files.length === 0 ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="hover:border-primary hover:bg-primary/5 focus-visible:ring-ring flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 px-4 py-10 text-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground h-10 w-10"
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="text-sm font-medium">Chạm để chọn ảnh từ máy</span>
            <span className="text-muted-foreground text-xs">
              JPG, PNG, WEBP, HEIC — tối đa {MAX_FILES} ảnh
            </span>
          </button>
        ) : (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {previews.map((url, i) => (
              <li
                key={url}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Ảnh ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label={`Bỏ ảnh ${i + 1}`}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-90 hover:bg-black/80"
                >
                  ×
                </button>
              </li>
            ))}
            {files.length < MAX_FILES && (
              <li>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-muted-foreground hover:border-primary hover:text-primary flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-xs transition-colors"
                >
                  <span className="text-2xl leading-none">+</span>
                  Thêm ảnh
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="upload-note" className="block text-sm font-medium">
          Ghi chú <span className="text-muted-foreground font-normal">(tuỳ chọn)</span>
        </label>
        <textarea
          id="upload-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          maxLength={1000}
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Hôm nay con học bài về phân số…"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Đang tải lên…" : `Tải lên ${files.length > 0 ? `(${files.length} ảnh)` : ""}`}
      </Button>
    </form>
  )
}
