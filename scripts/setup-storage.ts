// scripts/setup-storage.ts
// Tạo bucket "notebook-uploads" (private) nếu chưa tồn tại.
import { config } from "dotenv"
config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const NOTEBOOK_BUCKET = "notebook-uploads"

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY")
    process.exit(1)
  }
  const sb = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: buckets, error: listErr } = await sb.storage.listBuckets()
  if (listErr) {
    console.error("listBuckets failed:", listErr.message)
    process.exit(1)
  }
  const exists = buckets?.some((b) => b.name === NOTEBOOK_BUCKET)
  if (exists) {
    console.log(`Bucket "${NOTEBOOK_BUCKET}" already exists.`)
    return
  }
  const { error } = await sb.storage.createBucket(NOTEBOOK_BUCKET, {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  })
  if (error) {
    console.error("createBucket failed:", error.message)
    process.exit(1)
  }
  console.log(`Bucket "${NOTEBOOK_BUCKET}" created (private).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
