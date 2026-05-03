import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { APP_NAME } from "@/lib/constants"
import { VerifyOTPForm } from "./verify-form"

export const metadata: Metadata = {
  title: "Nhập mã OTP",
}

export default async function VerifyOTPPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; email?: string; role?: string }>
}) {
  const { phone, email, role: rawRole } = await searchParams
  if (!phone && !email) redirect("/login")
  const role = rawRole === "parent" || rawRole === "teacher" ? rawRole : undefined
  const mode = phone ? "phone" : "email"
  const identifier = (phone ?? email)!

  return (
    <main className="container mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-4 py-8">
      <Link href="/" className="mb-6 flex flex-col items-center gap-3">
        <Image
          src="/icons/logo.png"
          alt={APP_NAME}
          width={80}
          height={80}
          className="rounded-2xl"
          priority
        />
        <span className="text-2xl font-bold">{APP_NAME}</span>
      </Link>

      <div className="bg-card w-full rounded-2xl border p-6 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold">Nhập mã xác nhận</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          {mode === "phone" ? (
            <>
              Mã OTP 6 chữ số đã được gửi qua SMS đến số{" "}
              <span className="text-foreground font-medium">{identifier}</span>.
            </>
          ) : (
            <>
              Mã xác nhận đã được gửi đến email{" "}
              <span className="text-foreground font-medium">{identifier}</span>. Kiểm tra cả mục
              Spam.
            </>
          )}
        </p>
        <VerifyOTPForm identifier={identifier} mode={mode} role={role} />
      </div>

      <Link
        href="/login"
        className="text-muted-foreground mt-6 text-center text-xs underline-offset-4 hover:underline"
      >
        {mode === "phone" ? "Đổi số điện thoại" : "Đổi email"}
      </Link>
    </main>
  )
}
