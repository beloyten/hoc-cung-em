// src/app/(parent)/parent/home/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/sign-out-button"
import { AI_PERSONA_NAME, APP_NAME } from "@/lib/constants"
import { AuthError, requireParent } from "@/server/auth"

export const metadata: Metadata = {
  title: "Trang chính — Phụ huynh",
}

export default async function ParentHomePage() {
  let parentName: string
  try {
    const { parent } = await requireParent()
    parentName = parent.fullName
  } catch (e) {
    if (e instanceof AuthError) {
      redirect(e.code === "UNAUTHENTICATED" ? "/login" : "/onboarding")
    }
    throw e
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Xin chào, {parentName}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Hôm nay {AI_PERSONA_NAME} sẽ đồng hành cùng con · {APP_NAME}
          </p>
        </div>
        <SignOutButton />
      </div>

      <Link
        href="/parent/chat"
        className="from-primary/90 to-primary group hover:to-primary/90 mb-4 block rounded-2xl bg-linear-to-br p-6 text-white shadow-md transition-all hover:shadow-lg"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase opacity-80">
              Bắt đầu buổi học
            </p>
            <h2 className="mt-1 text-xl font-semibold">Trò chuyện cùng {AI_PERSONA_NAME}</h2>
            <p className="mt-2 text-sm opacity-90">
              Cô Mây gợi ý từng bước để con tự tìm ra đáp án — không cho đáp số ngay.
            </p>
          </div>
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </Link>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/parent/upload"
          className="bg-card hover:border-primary/40 group flex flex-col gap-2 rounded-2xl border p-5 shadow-sm transition-colors"
        >
          <span className="text-2xl" aria-hidden="true">
            📷
          </span>
          <span className="font-medium">Tải ảnh vở</span>
          <span className="text-muted-foreground text-xs">Cô giáo sẽ xem & phản hồi</span>
        </Link>
        <Link
          href="/parent/reports"
          className="bg-card hover:border-primary/40 group flex flex-col gap-2 rounded-2xl border p-5 shadow-sm transition-colors"
        >
          <span className="text-2xl" aria-hidden="true">
            📈
          </span>
          <span className="font-medium">Báo cáo tuần</span>
          <span className="text-muted-foreground text-xs">Xem tiến bộ của con từng tuần</span>
        </Link>
        <Link
          href="/parent/link"
          className="bg-card hover:border-primary/40 group flex flex-col gap-2 rounded-2xl border p-5 shadow-sm transition-colors"
        >
          <span className="text-2xl" aria-hidden="true">
            👨‍👩‍👧
          </span>
          <span className="font-medium">Liên kết với con</span>
          <span className="text-muted-foreground text-xs">Nhập mã lớp & chọn con</span>
        </Link>
      </div>
    </main>
  )
}
