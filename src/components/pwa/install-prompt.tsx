"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
  prompt(): Promise<void>
}

const DISMISS_KEY = "hcm:pwa-dismissed-at"
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 ngày

export function InstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0)
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_TTL_MS) return

    const onBefore = (e: Event) => {
      e.preventDefault()
      setEvt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener("beforeinstallprompt", onBefore)
    return () => window.removeEventListener("beforeinstallprompt", onBefore)
  }, [])

  if (!visible || !evt) return null

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setVisible(false)
  }

  const install = async () => {
    await evt.prompt()
    await evt.userChoice
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-sm rounded-xl border bg-white p-4 shadow-lg">
      <p className="text-sm font-medium">Cài HocCungEm vào màn hình chính?</p>
      <p className="text-muted-foreground mt-1 text-xs">Mở nhanh, dùng được khi mạng chậm.</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={install} className="flex-1">
          Cài đặt
        </Button>
        <Button size="sm" variant="outline" onClick={dismiss}>
          Để sau
        </Button>
      </div>
    </div>
  )
}
