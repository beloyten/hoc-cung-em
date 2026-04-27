"use server"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { classes, students } from "@/db/schema"
import { requireTeacher, AuthError } from "@/server/auth"

const classSchema = z.object({
  name: z.string().trim().min(1, "Tên lớp không được trống").max(50),
  grade: z.coerce.number().int().min(1).max(5),
  // danh sách tên học sinh, mỗi dòng 1 em
  studentNames: z
    .string()
    .transform((v) =>
      v
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .pipe(z.string().min(1).array().max(60)),
})

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

async function uniqueJoinCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateJoinCode()
    const existing = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.joinCode, code))
      .limit(1)
    if (existing.length === 0) return code
  }
  throw new Error("Không tạo được mã lớp. Hãy thử lại.")
}

export async function createClassAction(formData: FormData): Promise<{ error?: string }> {
  let teacher: { id: string }
  try {
    ;({ teacher } = await requireTeacher())
  } catch (e) {
    if (e instanceof AuthError) return { error: "Bạn chưa đăng nhập với vai trò giáo viên." }
    throw e
  }

  const parsed = classSchema.safeParse({
    name: formData.get("name"),
    grade: formData.get("grade"),
    studentNames: formData.get("studentNames"),
  })
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ."
    return { error: msg }
  }

  const joinCode = await uniqueJoinCode()

  const [classRow] = await db
    .insert(classes)
    .values({
      teacherId: teacher.id,
      name: parsed.data.name,
      grade: parsed.data.grade,
      joinCode,
    })
    .returning()

  if (!classRow) return { error: "Không tạo được lớp. Hãy thử lại." }

  if (parsed.data.studentNames.length > 0) {
    await db.insert(students).values(
      parsed.data.studentNames.map((name, i) => ({
        classId: classRow.id,
        fullName: name,
        studentCode: `HS${String(i + 1).padStart(2, "0")}`,
      })),
    )
  }

  redirect("/teacher/dashboard")
}
