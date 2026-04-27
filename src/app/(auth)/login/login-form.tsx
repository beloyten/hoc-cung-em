"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendMagicLink, sendPhoneOTP } from "./actions"

type Tab = "phone" | "email"
type Role = "parent" | "teacher"

export function LoginForm({ role }: { role?: Role }) {
  const router = useRouter()
  // Giáo viên: ưu tiên email; phụ huynh: ưu tiên số điện thoại
  const [tab, setTab] = useState<Tab>(role === "teacher" ? "email" : "phone")
  const roleQuery = role ? `&role=${role}` : ""

  // Phone state
  const [phone, setPhone] = useState("")
  const [phonePending, setPhonePending] = useState(false)
  const [phoneMsg, setPhoneMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  // Email state
  const [email, setEmail] = useState("")
  const [emailPending, setEmailPending] = useState(false)
  const [emailMsg, setEmailMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  async function onPhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPhonePending(true)
    setPhoneMsg(null)
    const result = await sendPhoneOTP(phone)
    setPhonePending(false)
    if (result.ok) {
      // Chuyển sang trang nhập OTP, truyền số điện thoại qua URL
      router.push(`/login/verify?phone=${encodeURIComponent(phone)}${roleQuery}`)
    } else {
      const msg = result.error.message.toLowerCase()
      const friendly =
        msg.includes("rate limit") || msg.includes("too many")
          ? "Bạn đã gửi quá nhiều lần. Vui lòng chờ vài phút rồi thử lại."
          : msg.includes("invalid") || msg.includes("sms provider")
            ? "Số điện thoại không hợp lệ hoặc chưa được hỗ trợ."
            : result.error.message
      setPhoneMsg({ type: "err", text: friendly })
    }
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEmailPending(true)
    setEmailMsg(null)
    const result = await sendMagicLink(email, role)
    setEmailPending(false)
    if (result.ok) {
      setEmailMsg({
        type: "ok",
        text: 'Đã gửi link đăng nhập đến email. Kiểm tra cả mục Spam / Thư rác, đánh dấu "Không phải spam" nếu thấy ở đó.',
      })
    } else {
      const friendly = result.error.message.includes("rate limit")
        ? "Bạn vừa yêu cầu quá nhiều link. Vui lòng chờ vài phút rồi thử lại."
        : result.error.message
      setEmailMsg({ type: "err", text: friendly })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tab switcher */}
      <div className="grid grid-cols-2 rounded-lg border p-1">
        <button
          type="button"
          onClick={() => setTab("phone")}
          className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
            tab === "phone"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Số điện thoại
        </button>
        <button
          type="button"
          onClick={() => setTab("email")}
          className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
            tab === "email"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Email
        </button>
      </div>

      {/* Phone tab */}
      {tab === "phone" && (
        <form onSubmit={onPhoneSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              required
              autoComplete="tel"
              placeholder="09x xxx xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={phonePending}
            />
            <p className="text-muted-foreground text-xs">
              Nhập số điện thoại Việt Nam (đầu 03/05/07/08/09)
            </p>
          </div>
          <Button type="submit" disabled={phonePending || !phone} className="w-full">
            {phonePending ? "Đang gửi..." : "Gửi mã OTP"}
          </Button>
          {phoneMsg && (
            <p
              className={
                phoneMsg.type === "ok"
                  ? "rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                  : "rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
              }
              role="status"
            >
              {phoneMsg.text}
            </p>
          )}
        </form>
      )}

      {/* Email tab */}
      {tab === "email" && (
        <form onSubmit={onEmailSubmit} className="flex flex-col gap-4">
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
              disabled={emailPending}
            />
          </div>
          <Button type="submit" disabled={emailPending || !email} className="w-full">
            {emailPending ? "Đang gửi..." : "Gửi link đăng nhập"}
          </Button>
          {emailMsg && (
            <p
              className={
                emailMsg.type === "ok"
                  ? "rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                  : "rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
              }
              role="status"
            >
              {emailMsg.text}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
