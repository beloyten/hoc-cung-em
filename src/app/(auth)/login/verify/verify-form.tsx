"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { verifyPhoneOTP, sendPhoneOTP, verifyEmailOTP, sendEmailOTP } from "../actions"

type Mode = "phone" | "email"

export function VerifyOTPForm({
  identifier,
  mode,
  role,
}: {
  identifier: string
  mode: Mode
  role?: "parent" | "teacher"
}) {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [resendCooldown, setResendCooldown] = useState(60)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const timer = setInterval(() => {
      setResendCooldown((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setMessage(null)
    const result =
      mode === "phone"
        ? await verifyPhoneOTP(identifier, otp, role)
        : await verifyEmailOTP(identifier, otp, role)
    setPending(false)
    if (result.ok) {
      router.push(result.data.redirectTo)
    } else {
      const msg = result.error.message.toLowerCase()
      const friendly =
        msg.includes("invalid") || msg.includes("expired")
          ? "Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại hoặc gửi lại mã."
          : result.error.message
      setMessage({ type: "err", text: friendly })
      setOtp("")
      inputRef.current?.focus()
    }
  }

  async function onResend() {
    setResendCooldown(60)
    setMessage(null)
    if (mode === "phone") {
      await sendPhoneOTP(identifier)
    } else {
      await sendEmailOTP(identifier, role)
    }
    setMessage({ type: "ok", text: "Đã gửi lại mã OTP." })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        ref={inputRef}
        id="otp"
        name="otp"
        type="text"
        inputMode="numeric"
        pattern="\d{6,8}"
        maxLength={8}
        required
        autoComplete="one-time-code"
        placeholder={mode === "phone" ? "Nhập 6 chữ số" : "Nhập mã xác nhận"}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        disabled={pending}
        className="text-center text-2xl tracking-[0.5em]"
      />

      <Button
        type="submit"
        disabled={pending || (mode === "phone" ? otp.length !== 6 : otp.length < 6)}
        className="w-full"
      >
        {pending ? "Đang xác nhận..." : "Xác nhận"}
      </Button>

      <button
        type="button"
        onClick={onResend}
        disabled={resendCooldown > 0}
        className="text-muted-foreground text-sm disabled:cursor-not-allowed"
      >
        {resendCooldown > 0 ? `Gửi lại mã sau ${resendCooldown}s` : "Gửi lại mã OTP"}
      </button>

      {message && (
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
      )}
    </form>
  )
}
