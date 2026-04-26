// src/server/email/client.ts
import "server-only"
import { Resend } from "resend"

let _resend: Resend | null = null

export function resend(): Resend {
  if (_resend) return _resend
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error("Missing RESEND_API_KEY")
  _resend = new Resend(key)
  return _resend
}

export function fromEmail(): string {
  const v = process.env.RESEND_FROM_EMAIL
  if (!v) throw new Error("Missing RESEND_FROM_EMAIL")
  return v
}

export function appUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ??
    "http://localhost:3000"
  )
}
