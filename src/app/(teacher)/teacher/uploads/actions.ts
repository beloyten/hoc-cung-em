// src/app/(teacher)/teacher/uploads/actions.ts
"use server"
import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { classes, notebookUploads, students, teacherReviews } from "@/db/schema"
import { err, ok, type Result } from "@/lib/types/result"
import { requireTeacher } from "@/server/auth"

const reviewSchema = z.object({
  uploadId: z.string().uuid(),
  rating: z.enum(["good", "needs_support"]),
  note: z.string().max(1000).optional(),
})

async function assertTeacherOwnsUpload(teacherId: string, uploadId: string): Promise<string> {
  const [row] = await db
    .select({ id: notebookUploads.id })
    .from(notebookUploads)
    .innerJoin(students, eq(students.id, notebookUploads.studentId))
    .innerJoin(classes, eq(classes.id, students.classId))
    .where(and(eq(notebookUploads.id, uploadId), eq(classes.teacherId, teacherId)))
    .limit(1)
  if (!row) throw new Error("FORBIDDEN")
  return row.id
}

export async function reviewUploadAction(
  formData: FormData,
): Promise<Result<{ reviewId: string }>> {
  const { teacher } = await requireTeacher()
  const parsed = reviewSchema.safeParse({
    uploadId: formData.get("uploadId"),
    rating: formData.get("rating"),
    note: (formData.get("note") as string | null) ?? undefined,
  })
  if (!parsed.success) return err("VALIDATION", "Dữ liệu không hợp lệ.")

  try {
    await assertTeacherOwnsUpload(teacher.id, parsed.data.uploadId)
  } catch {
    return err("FORBIDDEN", "Bạn không có quyền chấm bài này.")
  }

  // Upsert (uploadId is unique on teacher_reviews)
  const [existing] = await db
    .select({ id: teacherReviews.id })
    .from(teacherReviews)
    .where(eq(teacherReviews.uploadId, parsed.data.uploadId))
    .limit(1)

  let reviewId: string
  if (existing) {
    const [updated] = await db
      .update(teacherReviews)
      .set({
        rating: parsed.data.rating,
        note: parsed.data.note ?? null,
        teacherId: teacher.id,
      })
      .where(eq(teacherReviews.id, existing.id))
      .returning({ id: teacherReviews.id })
    reviewId = updated!.id
  } else {
    const [created] = await db
      .insert(teacherReviews)
      .values({
        uploadId: parsed.data.uploadId,
        teacherId: teacher.id,
        rating: parsed.data.rating,
        note: parsed.data.note ?? null,
      })
      .returning({ id: teacherReviews.id })
    reviewId = created!.id
  }

  revalidatePath("/teacher/uploads")
  revalidatePath(`/teacher/uploads/${parsed.data.uploadId}`)
  return ok({ reviewId })
}
