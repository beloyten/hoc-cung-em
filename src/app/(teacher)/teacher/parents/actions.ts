// src/app/(teacher)/teacher/parents/actions.ts
"use server"
import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { classes, parentStudents, students } from "@/db/schema"
import { err, ok, type Result } from "@/lib/types/result"
import { requireTeacher } from "@/server/auth"

const verifySchema = z.object({ linkId: z.string().uuid() })

export async function verifyParentLinkAction(input: {
  linkId: string
}): Promise<Result<{ linkId: string }>> {
  const parsed = verifySchema.safeParse(input)
  if (!parsed.success) return err("VALIDATION", "Dữ liệu không hợp lệ.")

  const { teacher } = await requireTeacher()

  // Xác nhận giáo viên này dạy lớp của học sinh được liên kết.
  const [row] = await db
    .select({ linkId: parentStudents.id })
    .from(parentStudents)
    .innerJoin(students, eq(students.id, parentStudents.studentId))
    .innerJoin(classes, eq(classes.id, students.classId))
    .where(and(eq(parentStudents.id, parsed.data.linkId), eq(classes.teacherId, teacher.id)))
    .limit(1)

  if (!row) return err("FORBIDDEN", "Bạn không có quyền duyệt liên kết này.")

  await db
    .update(parentStudents)
    .set({ verifiedByTeacher: true })
    .where(eq(parentStudents.id, parsed.data.linkId))

  revalidatePath("/teacher/parents")
  revalidatePath("/teacher/dashboard")
  return ok({ linkId: parsed.data.linkId })
}
