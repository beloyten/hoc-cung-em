// src/server/storage/notebooks.ts
// Storage helpers cho notebook-uploads bucket.
import "server-only"
import { adminSupabase, NOTEBOOK_BUCKET } from "@/lib/supabase/admin"

export const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
])
export const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
export const MAX_FILES = 6

export interface StoredImage {
  path: string
}

function extOf(name: string, mime: string): string {
  const lower = name.toLowerCase()
  const m = lower.match(/\.[a-z0-9]+$/)
  if (m) return m[0]
  if (mime === "image/jpeg") return ".jpg"
  if (mime === "image/png") return ".png"
  if (mime === "image/webp") return ".webp"
  if (mime === "image/heic") return ".heic"
  if (mime === "image/heif") return ".heif"
  return ".bin"
}

export async function uploadNotebookImages(args: {
  studentId: string
  uploadId: string
  files: File[]
}): Promise<StoredImage[]> {
  const sb = adminSupabase()
  const out: StoredImage[] = []
  let i = 0
  for (const f of args.files) {
    const ext = extOf(f.name, f.type)
    const path = `student-${args.studentId}/${args.uploadId}/${i}${ext}`
    const buf = Buffer.from(await f.arrayBuffer())
    const { error } = await sb.storage
      .from(NOTEBOOK_BUCKET)
      .upload(path, buf, { contentType: f.type, upsert: false })
    if (error) throw new Error(`Upload thất bại: ${error.message}`)
    out.push({ path })
    i++
  }
  return out
}

export async function signedNotebookUrl(path: string, expiresIn = 60 * 30): Promise<string> {
  const sb = adminSupabase()
  const { data, error } = await sb.storage.from(NOTEBOOK_BUCKET).createSignedUrl(path, expiresIn)
  if (error || !data) throw new Error(`Không tạo được signed URL: ${error?.message ?? "unknown"}`)
  return data.signedUrl
}
