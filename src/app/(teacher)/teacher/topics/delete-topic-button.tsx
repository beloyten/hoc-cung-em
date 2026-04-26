"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteTopicAction } from "./actions"

export function DeleteTopicButton({ topicId }: { topicId: string }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <Button size="sm" variant="ghost" onClick={() => setConfirming(true)} disabled={pending}>
        Xoá
      </Button>
    )
  }

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await deleteTopicAction({ topicId })
            if (res.ok) router.refresh()
            else setConfirming(false)
          })
        }
      >
        {pending ? "..." : "Chắc chắn"}
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={pending}>
        Huỷ
      </Button>
    </div>
  )
}
