// POST /api/notebook-upload-url
// Tạo presigned Supabase Storage upload URLs — client upload thẳng lên Supabase,
// tránh giới hạn 1 MB của Server Actions và giới hạn 4.5 MB của Vercel serverless.
import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { AuthError, requireParent } from "@/server/auth"
import { adminSupabase, NOTEBOOK_BUCKET } from "@/lib/supabase/admin"
import { db } from "@/db"
import { parentStudents } from "@/db/schema"
import { ALLOWED_MIME, MAX_BYTES, MAX_FILES } from "@/server/storage/notebooks"

const fileMetaSchema = z.object({
  name: z.string().min(1).max(260),
  mimeType: z.string().min(1),
  size: z.number().int().min(1),
})

const bodySchema = z.object({
  studentId: z.string().uuid(),
  files: z.array(fileMetaSchema).min(1).max(MAX_FILES),
})

export async function POST(req: Request) {
  let parent: { id: string }
  try {
    ;({ parent } = await requireParent())
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 })
    }
    throw e
  }

  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 })
  }

  const { studentId, files } = body

  for (const f of files) {
    if (!ALLOWED_MIME.has(f.mimeType)) {
      return NextResponse.json(
        { error: "Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc HEIC." },
        { status: 400 },
      )
    }
    if (f.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `Mỗi ảnh không quá ${MAX_BYTES / 1024 / 1024}MB.` },
        { status: 400 },
      )
    }
  }

  // Kiểm tra parent đã liên kết với học sinh chưa
  const [link] = await db
    .select({ id: parentStudents.id })
    .from(parentStudents)
    .where(and(eq(parentStudents.parentId, parent.id), eq(parentStudents.studentId, studentId)))
    .limit(1)

  if (!link) {
    return NextResponse.json({ error: "Bạn chưa liên kết với học sinh này." }, { status: 403 })
  }

  const uploadId = randomUUID()
  const sb = adminSupabase()
  const urls: Array<{ signedUrl: string; path: string }> = []

  for (let i = 0; i < files.length; i++) {
    const f = files[i]!
    const ext = getExt(f.name, f.mimeType)
    const path = `student-${studentId}/${uploadId}/${i}${ext}`
    const { data, error } = await sb.storage.from(NOTEBOOK_BUCKET).createSignedUploadUrl(path)
    if (error || !data) {
      console.error("[notebook-upload-url] createSignedUploadUrl error", error)
      return NextResponse.json(
        { error: "Không thể tạo đường dẫn upload. Vui lòng thử lại." },
        { status: 500 },
      )
    }
    urls.push({ signedUrl: data.signedUrl, path })
  }

  return NextResponse.json({ uploadId, urls })
}

function getExt(name: string, mime: string): string {
  const m = name.toLowerCase().match(/\.[a-z0-9]+$/)
  if (m) return m[0]
  if (mime === "image/jpeg") return ".jpg"
  if (mime === "image/png") return ".png"
  if (mime === "image/webp") return ".webp"
  if (mime === "image/heic") return ".heic"
  if (mime === "image/heif") return ".heif"
  return ".bin"
}
