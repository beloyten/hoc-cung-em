// src/app/(auth)/login/page.tsx
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "./login-form"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: `Đăng nhập vào ${APP_NAME} bằng magic link gửi qua email.`,
}

export default function LoginPage() {
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
        <h1 className="mb-1 text-xl font-semibold">Đăng nhập</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Chúng tôi sẽ gửi đường link đăng nhập đến email của bạn.
        </p>
        <LoginForm />
      </div>

      <div className="mt-6 flex flex-col gap-2 text-center text-sm">
        <p className="text-muted-foreground">Chưa có tài khoản?</p>
        <div className="flex justify-center gap-3">
          <Link href="/register-parent" className="text-primary font-medium hover:underline">
            Phụ huynh
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link href="/register-teacher" className="text-primary font-medium hover:underline">
            Giáo viên
          </Link>
        </div>
      </div>
    </main>
  )
}
