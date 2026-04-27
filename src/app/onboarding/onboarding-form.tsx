"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { completeOnboarding } from "./actions"

type Role = "parent" | "teacher"

export function OnboardingForm({
  email: initialEmail,
  phone: initialPhone,
  presetRole,
}: {
  email: string
  phone: string
  presetRole?: Role
}) {
  const [role, setRole] = useState<Role>(presetRole ?? "parent")
  const [fullName, setFullName] = useState("")
  // Đăng nhập bằng phương tiện nào → khoá field đó (read-only).
  const loggedInVia: "phone" | "email" = initialPhone ? "phone" : "email"
  const [email, setEmail] = useState(initialEmail)
  const [phone, setPhone] = useState(initialPhone)
  const [pending, setPending] = useState(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setErrMsg(null)
    const result = await completeOnboarding({ role, fullName, phone, email })
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
        {presetRole ? (
          <div className="border-primary/30 bg-muted/50 rounded-lg border-2 px-3 py-3 text-sm font-medium">
            {presetRole === "parent" ? "Phụ huynh / Học sinh" : "Giáo viên"}
          </div>
        ) : (
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
        )}
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Số điện thoại{loggedInVia === "phone" ? "" : " (tuỳ chọn)"}</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={pending || loggedInVia === "phone"}
          readOnly={loggedInVia === "phone"}
          required={loggedInVia === "phone"}
          placeholder="09x xxx xxxx"
        />
        {loggedInVia === "phone" ? (
          <p className="text-muted-foreground text-xs">Đã xác minh qua OTP</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">
          Email{loggedInVia === "email" ? "" : " (tuỳ chọn — để nhận báo cáo hàng tuần)"}
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending || loggedInVia === "email"}
          readOnly={loggedInVia === "email"}
          required={loggedInVia === "email"}
          placeholder="ten@example.com"
        />
        {loggedInVia === "email" ? (
          <p className="text-muted-foreground text-xs">Đã xác minh qua magic link</p>
        ) : null}
      </div>

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
