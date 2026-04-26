// src/app/(parent)/parent/link/actions.ts
"use server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { and, eq, isNull } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { parentStudents, students } from "@/db/schema"
import { err, ok, type Result } from "@/lib/types/result"
import { requireParent } from "@/server/auth"

const codeSchema = z.string().trim().toUpperCase().min(4).max(20)

export async function lookupClassByCodeAction(formData: FormData): Promise<void> {
  const raw = formData.get("code")
  const parsed = codeSchema.safeParse(raw)
  if (!parsed.success) redirect("/parent/link?error=invalid_code")
  redirect(`/parent/link?code=${encodeURIComponent(parsed.data)}`)
}

const relationshipSchema = z.enum(["mother", "father", "guardian", "other"])

const linkSchema = z.object({
  classId: z.string().uuid(),
  studentId: z.string().uuid(),
  relationship: relationshipSchema,
})

export async function linkChildAction(input: {
  classId: string
  studentId: string
  relationship: string
}): Promise<Result<{ studentId: string }>> {
  const parsed = linkSchema.safeParse(input)
  if (!parsed.success) return err("VALIDATION", "Dữ liệu không hợp lệ.")

  const { parent } = await requireParent()

  // Xác nhận học sinh thuộc lớp đã nhập mã.
  const [student] = await db
    .select({ id: students.id })
    .from(students)
    .where(
      and(
        eq(students.id, parsed.data.studentId),
        eq(students.classId, parsed.data.classId),
        isNull(students.deletedAt),
      ),
    )
    .limit(1)
  if (!student) return err("NOT_FOUND", "Không tìm thấy học sinh trong lớp này.")

  await db
    .insert(parentStudents)
    .values({
      parentId: parent.id,
      studentId: parsed.data.studentId,
      relationship: parsed.data.relationship,
      verifiedByTeacher: false,
    })
    .onConflictDoNothing()

  revalidatePath("/parent/chat")
  revalidatePath("/parent/home")
  return ok({ studentId: parsed.data.studentId })
}
