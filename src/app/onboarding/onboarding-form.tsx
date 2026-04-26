"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { completeOnboarding } from "./actions"

export function OnboardingForm({ email }: { email: string }) {
  const [role, setRole] = useState<"teacher" | "parent">("parent")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [pending, setPending] = useState(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setErrMsg(null)
    const result = await completeOnboarding({ role, fullName, phone })
    if (!result.ok) {
      setPending(false)
      setErrMsg(result.error.message)
    }
    // success → server action redirects
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Vai trò</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("parent")}
            className={`rounded-lg border-2 px-3 py-3 text-sm font-medium transition ${
              role === "parent"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            Phụ huynh
          </button>
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`rounded-lg border-2 px-3 py-3 text-sm font-medium transition ${
              role === "teacher"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            Giáo viên
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled readOnly />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">Họ tên</Label>
        <Input
          id="fullName"
          required
          minLength={2}
          maxLength={100}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={pending}
        />
      </div>

      {role === "parent" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Số điện thoại (tuỳ chọn)</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={pending}
          />
        </div>
      ) : null}

      <Button type="submit" disabled={pending || !fullName}>
        {pending ? "Đang lưu..." : "Hoàn tất"}
      </Button>

      {errMsg ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {errMsg}
        </p>
      ) : null}
    </form>
  )
}
