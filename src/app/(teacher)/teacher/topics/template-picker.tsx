"use client"
import { useState } from "react"
import { BookOpenIcon, CheckIcon } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { TopicTemplate } from "@/db/schema"

interface TemplatePickerProps {
  grade: number
  subject: string
  onSelect: (template: TopicTemplate) => void
}

export function TemplatePicker({ grade, subject, onSelect }: TemplatePickerProps) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<TopicTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [preview, setPreview] = useState<TopicTemplate | null>(null)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      setLoading(true)
      setTemplates([])
      fetch(`/api/topic-templates?grade=${grade}&subject=${subject}`)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.json() as Promise<TopicTemplate[]>
        })
        .then((data) => setTemplates(Array.isArray(data) ? data : []))
        .catch(() => setTemplates([]))
        .finally(() => setLoading(false))
    }
  }

  function handleSelect(t: TopicTemplate) {
    setSelected(t.id)
    setPreview(t)
  }

  function handleApply() {
    if (!preview) return
    onSelect(preview)
    setOpen(false)
    setSelected(null)
    setPreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
        <BookOpenIcon className="mr-1.5 h-3.5 w-3.5" />
        Chọn từ thư viện
      </DialogTrigger>

      <DialogContent
        className="flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden p-0"
        showCloseButton
      >
        <DialogHeader className="shrink-0 border-b px-4 pt-4 pb-3">
          <DialogTitle>Thư viện mẫu — Khối {grade}</DialogTitle>
          <p className="text-muted-foreground text-xs">
            Chọn một mẫu để điền sẵn vào form. Bạn có thể sửa toàn bộ trước khi lưu.
          </p>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto px-4 py-3">
          {loading && <p className="text-muted-foreground py-8 text-center text-sm">Đang tải…</p>}
          {!loading && templates.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Chưa có mẫu nào cho khối {grade}.
            </p>
          )}
          {!loading &&
            templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelect(t)}
                className={[
                  "group flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition-colors",
                  selected === t.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50 border-transparent",
                ].join(" ")}
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current">
                  {selected === t.id && <CheckIcon className="text-primary h-2.5 w-2.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.title}</p>
                  {t.description && (
                    <p className="text-muted-foreground mt-0.5 text-xs">{t.description}</p>
                  )}
                  {t.context && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs italic">
                      🤖 {t.context.slice(0, 120)}
                      {t.context.length > 120 ? "…" : ""}
                    </p>
                  )}
                </div>
              </button>
            ))}
        </div>

        <div className="bg-muted/50 shrink-0 border-t px-4 py-3">
          <Button onClick={handleApply} disabled={!selected} className="w-full sm:w-auto">
            Dùng mẫu này
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
