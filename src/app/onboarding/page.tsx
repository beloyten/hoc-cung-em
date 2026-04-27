// src/app/onboarding/page.tsx
// Sau khi đăng nhập lần đầu — user chọn vai trò và tạo profile.
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { OnboardingForm } from "./onboarding-form"
import { getCurrentRole, getCurrentUser } from "@/server/auth"

export const metadata: Metadata = {
  title: "Hoàn tất hồ sơ",
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const role = await getCurrentRole()
  if (role === "teacher") redirect("/teacher/dashboard")
  if (role === "parent") redirect("/parent/home")

  const { role: rawRole } = await searchParams
  const presetRole = rawRole === "parent" || rawRole === "teacher" ? rawRole : undefined

  return (
    <main className="container mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-4 py-8">
      <div className="bg-card w-full rounded-2xl border p-6 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold">Chào mừng!</h1>
        <p className="text-muted-foreground mb-6 text-sm">Hoàn tất hồ sơ để bắt đầu sử dụng.</p>
        <OnboardingForm email={user.email ?? ""} phone={user.phone ?? ""} presetRole={presetRole} />
      </div>
    </main>
  )
}
