// src/app/(parent)/parent/link/page.tsx
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { and, eq, isNull } from "drizzle-orm"
import { db } from "@/db"
import { classes, students } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BackLink, PageContainer, PageHeader } from "@/components/page-layout"
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
    <PageContainer size="sm">
      <BackLink href="/parent/home">Trang chính</BackLink>
      <PageHeader
        className="mt-2"
        title="Liên kết với con"
        description="Nhập mã lớp do giáo viên cung cấp để tìm con của bạn."
      />

      <form
        action={lookupClassByCodeAction}
        className="bg-card mb-6 space-y-3 rounded-2xl border p-5 shadow-sm"
      >
        <Label htmlFor="code" className="text-sm font-medium">
          Mã lớp
        </Label>
        <Input
          id="code"
          name="code"
          placeholder="Ví dụ: K7M2P9"
          defaultValue={code ?? ""}
          required
          autoComplete="off"
          inputMode="text"
          maxLength={6}
          className="font-mono text-base tracking-widest uppercase"
        />
        <p className="text-muted-foreground text-xs">
          Mã có 6 ký tự (chữ cái và số), không phân biệt hoa/thường.
        </p>
        {sp.error === "invalid_code" && (
          <p className="text-destructive text-xs">Mã không hợp lệ.</p>
        )}
        <Button type="submit">Tìm lớp</Button>
      </form>

      {code && !foundClass && (
        <div className="border-destructive/30 bg-destructive/5 mb-4 rounded-xl border p-4 text-sm">
          <p className="text-destructive font-medium">
            Không tìm thấy lớp với mã <strong>{code}</strong>
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Hãy kiểm tra lại với giáo viên — mã có thể bị nhập sai hoặc lớp đã đổi mã.
          </p>
        </div>
      )}

      {foundClass && foundClass.classStudents.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Lớp <strong>{foundClass.name}</strong> hiện chưa có học sinh nào.
        </p>
      )}

      {foundClass && foundClass.classStudents.length > 0 && (
        <div className="bg-card rounded-2xl border p-5 shadow-sm">
          <p className="mb-3 text-sm">
            Tìm thấy lớp <strong>{foundClass.name}</strong> · chọn con của bạn:
          </p>
          <LinkChildForm classId={foundClass.id} students={foundClass.classStudents} />
        </div>
      )}
    </PageContainer>
  )
}
