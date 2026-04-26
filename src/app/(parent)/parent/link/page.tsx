// src/app/(parent)/parent/link/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { and, eq, isNull } from "drizzle-orm"
import { db } from "@/db"
import { classes, students } from "@/db/schema"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthError, requireParent } from "@/server/auth"
import { lookupClassByCodeAction } from "./actions"
import { LinkChildForm } from "./link-child-form"

export const metadata: Metadata = {
  title: "Liên kết với con",
}

export default async function ParentLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>
}) {
  try {
    await requireParent()
  } catch (e) {
    if (e instanceof AuthError) {
      redirect(e.code === "UNAUTHENTICATED" ? "/login" : "/onboarding")
    }
    throw e
  }

  const sp = await searchParams
  const code = sp.code?.toUpperCase()

  let foundClass: {
    id: string
    name: string
    classStudents: Array<{ id: string; fullName: string }>
  } | null = null

  if (code) {
    const [cls] = await db
      .select({ id: classes.id, name: classes.name })
      .from(classes)
      .where(eq(classes.joinCode, code))
      .limit(1)

    if (cls) {
      const list = await db
        .select({ id: students.id, fullName: students.fullName })
        .from(students)
        .where(and(eq(students.classId, cls.id), isNull(students.deletedAt)))
      foundClass = { ...cls, classStudents: list }
    }
  }

  return (
    <main className="container mx-auto max-w-xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Liên kết với con</h1>
        <p className="text-muted-foreground text-sm">
          Nhập mã lớp do giáo viên cung cấp để tìm con của bạn.
        </p>
      </div>

      <form
        action={lookupClassByCodeAction}
        className="bg-card mb-6 space-y-3 rounded-2xl border p-5 shadow-sm"
      >
        <Label htmlFor="code">Mã lớp</Label>
        <Input
          id="code"
          name="code"
          placeholder="Ví dụ: K7M2P9"
          defaultValue={code ?? ""}
          required
          autoComplete="off"
          className="uppercase"
        />
        {sp.error === "invalid_code" && (
          <p className="text-destructive text-xs">Mã không hợp lệ.</p>
        )}
        <Button type="submit">Tìm lớp</Button>
      </form>

      {code && !foundClass && (
        <p className="text-destructive text-sm">
          Không tìm thấy lớp với mã <strong>{code}</strong>. Hãy kiểm tra lại với giáo viên.
        </p>
      )}

      {foundClass && foundClass.classStudents.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Lớp <strong>{foundClass.name}</strong> hiện chưa có học sinh nào.
        </p>
      )}

      {foundClass && foundClass.classStudents.length > 0 && (
        <div className="bg-card rounded-2xl border p-5 shadow-sm">
          <p className="mb-3 text-sm">
            Lớp <strong>{foundClass.name}</strong> · chọn con của bạn:
          </p>
          <LinkChildForm classId={foundClass.id} students={foundClass.classStudents} />
        </div>
      )}

      <div className="mt-6">
        <Link href="/parent/home" className={buttonVariants({ variant: "ghost" })}>
          ← Về trang chính
        </Link>
      </div>
    </main>
  )
}
