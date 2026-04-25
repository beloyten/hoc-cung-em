// src/lib/env.ts
// Runtime env validation — app crashes early nếu thiếu biến quan trọng
import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
  SUPABASE_SECRET_KEY: z.string().min(20),
  DATABASE_URL: z.string().url(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(20),
  RESEND_API_KEY: z.string().startsWith("re_"),
  RESEND_FROM_EMAIL: z.string().email(),
  CRON_SECRET: z.string().min(16),
})

export const env = envSchema.parse(process.env)
