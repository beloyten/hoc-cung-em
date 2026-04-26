// src/app/(teacher)/teacher/dashboard/page.tsx
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/sign-out-button"
import { APP_NAME, CLASS_NAME } from "@/lib/constants"
import { AuthError, requireTeacher } from "@/server/auth"

export const metadata: Metadata = {
  title: "Bảng điều khiển — Giáo viên",
}

export default async function TeacherDashboardPage() {
  let teacherName: string
  try {
    const { teacher } = await requireTeacher()
    teacherName = teacher.fullName
  } catch (e) {
    if (e instanceof AuthError) {
      redirect(e.code === "UNAUTHENTICATED" ? "/login" : "/onboarding")
    }
    throw e
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Xin chào, {teacherName}</h1>
          <p className="text-muted-foreground text-sm">
            Bảng điều khiển lớp {CLASS_NAME} · {APP_NAME}
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="bg-card rounded-2xl border p-6 shadow-sm">
        <p className="text-muted-foreground text-sm">
          Các chức năng (chủ đề học, duyệt vở, gợi ý dạy học) sẽ được triển khai tiếp.
        </p>
      </div>
    </main>
  )
}
