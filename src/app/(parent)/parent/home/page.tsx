// src/app/(parent)/parent/home/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/sign-out-button"
import { buttonVariants } from "@/components/ui/button"
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Xin chào, {parentName}</h1>
          <p className="text-muted-foreground text-sm">
            Hôm nay {AI_PERSONA_NAME} sẽ đồng hành cùng con · {APP_NAME}
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="bg-card rounded-2xl border p-6 shadow-sm">
        <p className="text-muted-foreground mb-4 text-sm">
          Bắt đầu một buổi học cùng {AI_PERSONA_NAME} — cô sẽ gợi ý từng bước để con tự tìm ra đáp
          án.
        </p>
        <Link href="/parent/chat" className={buttonVariants({ variant: "default" })}>
          Trò chuyện cùng {AI_PERSONA_NAME}
        </Link>
        <Link href="/parent/link" className={"ml-2 " + buttonVariants({ variant: "outline" })}>
          Liên kết với con
        </Link>
        <Link href="/parent/reports" className={"ml-2 " + buttonVariants({ variant: "outline" })}>
          Báo cáo tuần
        </Link>
        <Link href="/parent/upload" className={"ml-2 " + buttonVariants({ variant: "outline" })}>
          Tải ảnh vở
        </Link>
      </div>
    </main>
  )
}
