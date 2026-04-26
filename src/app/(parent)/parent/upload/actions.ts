// src/app/(parent)/parent/upload/actions.ts
"use server"
import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { notebookUploads, parentStudents, studyTopics, students } from "@/db/schema"
import { desc } from "drizzle-orm"
import { err, ok, type Result } from "@/lib/types/result"
import { requireParent } from "@/server/auth"
import {
  ALLOWED_MIME,
  MAX_BYTES,
  MAX_FILES,
  uploadNotebookImages,
} from "@/server/storage/notebooks"

const inputSchema = z.object({
  studentId: z.string().uuid(),
  note: z.string().max(1000).optional(),
})

export async function uploadNotebookAction(
  formData: FormData,
): Promise<Result<{ uploadId: string }>> {
  const { parent } = await requireParent()

  const parsed = inputSchema.safeParse({
    studentId: formData.get("studentId"),
    note: (formData.get("note") as string | null) ?? undefined,
  })
  if (!parsed.success) {
    return err("VALIDATION", "Dữ liệu không hợp lệ.")
  }
  const { studentId, note } = parsed.data

  // PH có liên kết với HS này không
  const [link] = await db
    .select({ id: parentStudents.id })
    .from(parentStudents)
    .where(and(eq(parentStudents.parentId, parent.id), eq(parentStudents.studentId, studentId)))
    .limit(1)
  if (!link) return err("FORBIDDEN", "Bạn chưa liên kết với học sinh này.")

  const rawFiles = formData.getAll("files")
  const files = rawFiles.filter((v): v is File => v instanceof File && v.size > 0)
  if (files.length === 0) return err("VALIDATION", "Hãy chọn ít nhất 1 ảnh.")
  if (files.length > MAX_FILES) {
    return err("VALIDATION", `Tối đa ${MAX_FILES} ảnh mỗi lần tải.`)
  }
  for (const f of files) {
    if (!ALLOWED_MIME.has(f.type)) {
      return err("VALIDATION", `Chỉ chấp nhận ảnh JPG/PNG/WEBP/HEIC.`)
    }
    if (f.size > MAX_BYTES) {
      return err("VALIDATION", `Mỗi ảnh không quá 10MB.`)
    }
  }

  // Mặc định gán topic mới nhất của lớp HS
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

  const uploadId = randomUUID()

  let stored
  try {
    stored = await uploadNotebookImages({ studentId, uploadId, files })
  } catch (e) {
    return err("STORAGE", e instanceof Error ? e.message : "Tải ảnh thất bại.")
  }

  const [row] = await db
    .insert(notebookUploads)
    .values({
      id: uploadId,
      studentId,
      topicId: latestTopic?.id,
      uploadedByParentId: parent.id,
      imagePaths: stored.map((s) => s.path),
      note: note ?? null,
    })
    .returning({ id: notebookUploads.id })

  if (!row) return err("DB", "Không lưu được upload.")

  revalidatePath("/parent/upload")
  return ok({ uploadId: row.id })
}
