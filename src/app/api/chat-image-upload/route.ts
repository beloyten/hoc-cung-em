// POST /api/chat-image-upload
// Upload 1 ảnh đề bài vào chat — trả về signed URL cho Gemini Vision.
import { NextResponse } from "next/server"
import { AuthError, requireParent } from "@/server/auth"
import { adminSupabase, NOTEBOOK_BUCKET } from "@/lib/supabase/admin"
import { db } from "@/db"
import { aiChats, studySessions } from "@/db/schema"
import { and, eq, isNull } from "drizzle-orm"

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"])
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

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

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 })
  }

  const chatId = formData.get("chatId")
  const file = formData.get("file")

  if (typeof chatId !== "string" || !chatId) {
    return NextResponse.json({ error: "Thiếu chatId." }, { status: 400 })
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Thiếu file." }, { status: 400 })
  }

  // Validate MIME + size
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP." }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ảnh không được lớn hơn 5 MB." }, { status: 400 })
  }

  // Verify this parent owns the chat
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

  // Upload to Supabase Storage under chat/ prefix
  const ext = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg"
  const path = `chat/${chatId}/${Date.now()}${ext}`
  const buf = Buffer.from(await file.arrayBuffer())

  const sb = adminSupabase()
  const { error: uploadError } = await sb.storage
    .from(NOTEBOOK_BUCKET)
    .upload(path, buf, { contentType: file.type, upsert: false })

  if (uploadError) {
    console.error("[chat-image-upload] upload error", uploadError)
    return NextResponse.json({ error: "Upload thất bại. Vui lòng thử lại." }, { status: 500 })
  }

  // Signed URL valid 1 hour — enough for Gemini to fetch
  const { data, error: signError } = await sb.storage
    .from(NOTEBOOK_BUCKET)
    .createSignedUrl(path, 60 * 60)

  if (signError || !data) {
    return NextResponse.json({ error: "Không tạo được URL ảnh." }, { status: 500 })
  }

  return NextResponse.json({ imageUrl: data.signedUrl })
}
