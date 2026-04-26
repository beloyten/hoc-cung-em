// src/app/(parent)/parent/home/page.tsx
import type { Metadata } from "next"
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
        <p className="text-muted-foreground text-sm">
          Liên kết với con, chụp vở, hoặc bắt đầu trò chuyện với {AI_PERSONA_NAME} — sắp triển khai.
        </p>
      </div>
    </main>
  )
}
