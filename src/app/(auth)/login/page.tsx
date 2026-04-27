// src/app/(auth)/login/page.tsx
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "./login-form"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: `Đăng nhập vào ${APP_NAME} bằng OTP qua SMS hoặc magic link email.`,
}

const ROLE_LABELS = {
  parent: "Phụ huynh / Học sinh",
  teacher: "Giáo viên",
} as const

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role: rawRole } = await searchParams
  const role = rawRole === "parent" || rawRole === "teacher" ? rawRole : undefined

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
        <h1 className="mb-1 text-xl font-semibold">Đăng nhập / Đăng ký</h1>
        {role ? (
          <p className="text-muted-foreground mb-6 text-sm">
            Bạn đăng nhập với vai trò{" "}
            <span className="text-foreground font-medium">{ROLE_LABELS[role]}</span>.{" "}
            <Link href="/login" className="underline underline-offset-2">
              Đổi vai trò
            </Link>
          </p>
        ) : (
          <p className="text-muted-foreground mb-6 text-sm">
            Phụ huynh dùng số điện thoại sẽ tiện hơn. Giáo viên có thể đăng nhập bằng email.
          </p>
        )}
        <LoginForm role={role} />
      </div>

      <p className="text-muted-foreground mt-6 text-center text-xs">
        Không cần mật khẩu — đăng nhập an toàn bằng OTP (one-time password).
      </p>
    </main>
  )
}
