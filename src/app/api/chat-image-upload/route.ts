// Endpoint này đã được thay thế bởi /api/chat-image-upload-url (presigned URL approach).
// Client nên gọi /api/chat-image-upload-url để upload ảnh trực tiếp lên Supabase Storage,
// tránh giới hạn body 4.5 MB của Vercel.
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Endpoint này không còn hoạt động. Vui lòng dùng /api/chat-image-upload-url." },
    { status: 410 },
  )
}
