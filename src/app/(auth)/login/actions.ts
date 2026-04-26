"use server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { err, ok, type Result } from "@/lib/types/result"

const EmailSchema = z.string().email("Email không hợp lệ")

export async function sendMagicLink(rawEmail: string): Promise<Result<{ email: string }>> {
  const parsed = EmailSchema.safeParse(rawEmail)
  if (!parsed.success) {
    return err("VALIDATION", parsed.error.issues[0]?.message ?? "Email không hợp lệ")
  }

  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return err("AUTH_FAILED", error.message)
  }

  return ok({ email: parsed.data })
}
