// src/lib/supabase/admin.ts
// Admin Supabase client dùng service role key — CHỈ chạy server-side (Server Actions, Route Handlers, scripts).
import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let _admin: SupabaseClient | null = null

export function adminSupabase(): SupabaseClient {
  if (_admin) return _admin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY")
  }
  _admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return _admin
}

export const NOTEBOOK_BUCKET = "notebook-uploads"
