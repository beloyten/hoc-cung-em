// src/app/(parent)/parent/upload/actions.ts
"use server"
import { revalidatePath } from "next/cache"
import { and, eq, desc } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { notebookUploads, parentStudents, studyTopics, students } from "@/db/schema"
import { err, ok, type Result } from "@/lib/types/result"
import { requireParent } from "@/server/auth"

const saveSchema = z.object({
  uploadId: z.string().uuid(),
  studentId: z.string().uuid(),
  imagePaths: z.array(z.string().min(1)).min(1).max(6),
  note: z.string().max(1000).optional(),
})

/**
 * Lưu metadata sau khi client đã upload ảnh trực tiếp lên Supabase Storage.
 * Server Action này không nhận file — chỉ nhận đường dẫn đã được upload.
 */
export async function saveNotebookUploadAction(data: {
  uploadId: string
  studentId: string
  imagePaths: string[]
  note?: string
}): Promise<Result<{ uploadId: string }>> {
  const { parent } = await requireParent()

  const parsed = saveSchema.safeParse(data)
  if (!parsed.success) {
    return err("VALIDATION", "Dữ liệu không hợp lệ.")
  }
  const { uploadId, studentId, imagePaths, note } = parsed.data

  const [link] = await db
    .select({ id: parentStudents.id })
    .from(parentStudents)
    .where(and(eq(parentStudents.parentId, parent.id), eq(parentStudents.studentId, studentId)))
    .limit(1)
  if (!link) return err("FORBIDDEN", "Bạn chưa liên kết với học sinh này.")

  const [s] = await db
    .select({ classId: students.classId })
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1)
  if (!s) return err("NOT_FOUND", "Không tìm thấy học sinh.")

  const [latestTopic] = await db
    .select({ id: studyTopics.id })
    .from(studyTopics)
    .where(eq(studyTopics.classId, s.classId))
    .orderBy(desc(studyTopics.weekNumber))
    .limit(1)

  const [row] = await db
    .insert(notebookUploads)
    .values({
      id: uploadId,
      studentId,
      topicId: latestTopic?.id,
      uploadedByParentId: parent.id,
      imagePaths,
      note: note ?? null,
    })
    .returning({ id: notebookUploads.id })

  if (!row) return err("DB", "Không lưu được kết quả upload.")

  revalidatePath("/parent/upload")
  return ok({ uploadId: row.id })
}
