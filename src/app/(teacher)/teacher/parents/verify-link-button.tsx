"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { verifyParentLinkAction } from "./actions"

export function VerifyLinkButton({ linkId }: { linkId: string }) {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        size="sm"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null)
            const res = await verifyParentLinkAction({ linkId })
            if (!res.ok) setError(res.error.message)
          })
        }
      >
        {pending ? "Đang duyệt..." : "Duyệt"}
      </Button>
      {error && <span className="text-destructive text-xs">{error}</span>}
    </div>
  )
}
