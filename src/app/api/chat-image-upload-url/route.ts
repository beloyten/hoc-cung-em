// POST /api/chat-image-upload-url
// Tạo presigned Supabase Storage upload URL cho ảnh đề bài trong chat.
// Client upload thẳng lên Supabase (bypass Vercel), tránh giới hạn body 4.5 MB.
import { NextResponse } from "next/server"
import { z } from "zod"
import { and, eq, isNull } from "drizzle-orm"
import { AuthError, requireParent } from "@/server/auth"
import { adminSupabase, NOTEBOOK_BUCKET } from "@/lib/supabase/admin"
import { db } from "@/db"
import { aiChats, studySessions } from "@/db/schema"

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"])
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

const bodySchema = z.object({
  chatId: z.string().uuid(),
  file: z.object({
    name: z.string().min(1).max(260),
    mimeType: z.string().min(1),
    size: z.number().int().min(1),
  }),
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

  const { chatId, file } = body

  if (!ALLOWED_MIME.has(file.mimeType)) {
    return NextResponse.json(
      { error: "Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP." },
      { status: 400 },
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ảnh không được lớn hơn 5 MB." }, { status: 400 })
  }

  // Kiểm tra parent sở hữu chat này
  const [chat] = await db
    .select({ id: aiChats.id })
    .from(aiChats)
    .innerJoin(studySessions, eq(studySessions.id, aiChats.sessionId))
    .where(
      and(
        eq(aiChats.id, chatId),
        eq(aiChats.createdByParentId, parent.id),
        isNull(studySessions.deletedAt),
      ),
    )
    .limit(1)

  if (!chat) {
    return NextResponse.json({ error: "Không tìm thấy cuộc trò chuyện." }, { status: 403 })
  }

  const ext = getExt(file.name, file.mimeType)
  const path = `chat/${chatId}/${Date.now()}${ext}`

  const sb = adminSupabase()
  const { data, error } = await sb.storage.from(NOTEBOOK_BUCKET).createSignedUploadUrl(path)
  if (error || !data) {
    console.error("[chat-image-upload-url] createSignedUploadUrl error", error)
    return NextResponse.json(
      { error: "Không thể chuẩn bị upload. Vui lòng thử lại." },
      { status: 500 },
    )
  }

  return NextResponse.json({ signedUploadUrl: data.signedUrl, path })
}

function getExt(name: string, mime: string): string {
  const m = name.toLowerCase().match(/\.[a-z0-9]+$/)
  if (m) return m[0]
  if (mime === "image/jpeg") return ".jpg"
  if (mime === "image/png") return ".png"
  if (mime === "image/webp") return ".webp"
  return ".bin"
}
