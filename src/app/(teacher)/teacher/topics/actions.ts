// src/app/(teacher)/teacher/topics/actions.ts
"use server"
import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { classes, studyTopics } from "@/db/schema"
import { err, ok, type Result } from "@/lib/types/result"
import { requireTeacher } from "@/server/auth"

const createSchema = z.object({
  classId: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  weekNumber: z.coerce.number().int().min(1).max(52),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  context: z.string().trim().max(4000).optional(),
})

async function assertTeacherOwnsClass(teacherId: string, classId: string) {
  const [c] = await db
    .select({ id: classes.id })
    .from(classes)
    .where(and(eq(classes.id, classId), eq(classes.teacherId, teacherId)))
    .limit(1)
  return Boolean(c)
}

export async function createTopicAction(formData: FormData): Promise<Result<{ id: string }>> {
  const parsed = createSchema.safeParse({
    classId: formData.get("classId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    weekNumber: formData.get("weekNumber"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    context: formData.get("context") || undefined,
  })
  if (!parsed.success) return err("VALIDATION", "Dữ liệu không hợp lệ.")

  const { teacher } = await requireTeacher()
  const owns = await assertTeacherOwnsClass(teacher.id, parsed.data.classId)
  if (!owns) return err("FORBIDDEN", "Bạn không dạy lớp này.")

  const [row] = await db
    .insert(studyTopics)
    .values({
      classId: parsed.data.classId,
      title: parsed.data.title,
      description: parsed.data.description,
      weekNumber: parsed.data.weekNumber,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      context: parsed.data.context,
    })
    .returning({ id: studyTopics.id })

  if (!row) return err("DB_ERROR", "Không tạo được chủ đề.")

  revalidatePath("/teacher/topics")
  return ok({ id: row.id })
}

const deleteSchema = z.object({ topicId: z.string().uuid() })

export async function deleteTopicAction(input: {
  topicId: string
}): Promise<Result<{ topicId: string }>> {
  const parsed = deleteSchema.safeParse(input)
  if (!parsed.success) return err("VALIDATION", "Dữ liệu không hợp lệ.")

  const { teacher } = await requireTeacher()

  const [row] = await db
    .select({ id: studyTopics.id, classId: studyTopics.classId })
    .from(studyTopics)
    .where(eq(studyTopics.id, parsed.data.topicId))
    .limit(1)
  if (!row) return err("NOT_FOUND", "Không tìm thấy chủ đề.")
  const owns = await assertTeacherOwnsClass(teacher.id, row.classId)
  if (!owns) return err("FORBIDDEN", "Bạn không có quyền xoá chủ đề này.")

  await db.delete(studyTopics).where(eq(studyTopics.id, parsed.data.topicId))
  revalidatePath("/teacher/topics")
  return ok({ topicId: parsed.data.topicId })
}
