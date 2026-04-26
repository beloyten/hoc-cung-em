"use client"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { startChatAction } from "./actions"

export function StartSessionButton({
  studentId,
  disabled,
}: {
  studentId: string
  disabled?: boolean
}) {
  const [pending, start] = useTransition()
  return (
    <Button
      disabled={disabled || pending}
      onClick={() => start(() => startChatAction({ studentId }).then(() => {}))}
    >
      {pending ? "Đang mở..." : "Bắt đầu học"}
    </Button>
  )
}
