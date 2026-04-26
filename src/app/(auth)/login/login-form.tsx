"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendMagicLink } from "./actions"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setMessage(null)
    const result = await sendMagicLink(email)
    setPending(false)
    if (result.ok) {
      setMessage({
        type: "ok",
        text: "Đã gửi link đăng nhập. Hãy kiểm tra email.",
      })
    } else {
      setMessage({ type: "err", text: result.error.message })
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="ten@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
        />
      </div>

      <Button type="submit" disabled={pending || !email} className="w-full">
        {pending ? "Đang gửi..." : "Gửi link đăng nhập"}
      </Button>

      {message ? (
        <p
          className={
            message.type === "ok"
              ? "rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              : "rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
          }
          role="status"
        >
          {message.text}
        </p>
      ) : null}
    </form>
  )
}
