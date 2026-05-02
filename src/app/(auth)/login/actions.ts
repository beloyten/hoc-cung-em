"use server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { err, ok, type Result } from "@/lib/types/result"

const EmailSchema = z.string().email("Email không hợp lệ")

// Chuẩn hoá số điện thoại VN sang E.164 (+84...)
// Chấp nhận: 09x, 08x, 03x, 07x, 05x, +84...
const PhoneSchema = z
  .string()
  .min(9, "Số điện thoại không hợp lệ")
  .transform((raw) => {
    const digits = raw.replace(/\D/g, "")
    if (digits.startsWith("84")) return `+${digits}`
    if (digits.startsWith("0")) return `+84${digits.slice(1)}`
    return `+84${digits}`
  })
  .refine((p) => /^\+84[3-9]\d{8}$/.test(p), "Số điện thoại Việt Nam không hợp lệ")

const RoleSchema = z.enum(["parent", "teacher"]).optional()

// Gửi OTP 6 chữ số qua email — KHÔNG dùng magic link để tránh cross-browser (Gmail in-app browser)
export async function sendEmailOTP(
  rawEmail: string,
  rawRole?: string,
): Promise<Result<{ email: string }>> {
  const parsed = EmailSchema.safeParse(rawEmail)
  if (!parsed.success) {
    return err("VALIDATION", parsed.error.issues[0]?.message ?? "Email không hợp lệ")
  }

  const supabase = await createClient()
  // shouldCreateUser: true (default) → tạo user mới nếu chưa có
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: { shouldCreateUser: true },
  })

  if (error) {
    return err("AUTH_FAILED", error.message)
  }

  return ok({ email: parsed.data })
}

export async function verifyEmailOTP(
  rawEmail: string,
  token: string,
  rawRole?: string,
): Promise<Result<{ redirectTo: string }>> {
  const parsedEmail = EmailSchema.safeParse(rawEmail)
  if (!parsedEmail.success) {
    return err("VALIDATION", "Email không hợp lệ")
  }

  const parsedToken = z
    .string()
    .regex(/^\d{6}$/, "Mã OTP gồm 6 chữ số")
    .safeParse(token.trim())
  if (!parsedToken.success) {
    return err("VALIDATION", parsedToken.error.issues[0]?.message ?? "Mã OTP không hợp lệ")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email: parsedEmail.data,
    token: parsedToken.data,
    type: "email",
  })

  if (error) {
    return err("AUTH_FAILED", error.message)
  }

  const role = RoleSchema.safeParse(rawRole).data
  return ok({ redirectTo: role ? `/onboarding?role=${role}` : "/onboarding" })
}

export async function sendPhoneOTP(rawPhone: string): Promise<Result<{ phone: string }>> {
  const parsed = PhoneSchema.safeParse(rawPhone)
  if (!parsed.success) {
    return err("VALIDATION", parsed.error.issues[0]?.message ?? "Số điện thoại không hợp lệ")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    phone: parsed.data,
  })

  if (error) {
    return err("AUTH_FAILED", error.message)
  }

  return ok({ phone: parsed.data })
}

export async function verifyPhoneOTP(
  rawPhone: string,
  token: string,
  rawRole?: string,
): Promise<Result<{ redirectTo: string }>> {
  const parsedPhone = PhoneSchema.safeParse(rawPhone)
  if (!parsedPhone.success) {
    return err("VALIDATION", "Số điện thoại không hợp lệ")
  }

  const parsedToken = z
    .string()
    .regex(/^\d{6}$/, "Mã OTP gồm 6 chữ số")
    .safeParse(token.trim())
  if (!parsedToken.success) {
    return err("VALIDATION", parsedToken.error.issues[0]?.message ?? "Mã OTP không hợp lệ")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    phone: parsedPhone.data,
    token: parsedToken.data,
    type: "sms",
  })

  if (error) {
    return err("AUTH_FAILED", error.message)
  }

  const role = RoleSchema.safeParse(rawRole).data
  return ok({ redirectTo: role ? `/onboarding?role=${role}` : "/onboarding" })
}

export async function sendPhoneOTP(rawPhone: string): Promise<Result<{ phone: string }>> {
  const parsed = PhoneSchema.safeParse(rawPhone)
  if (!parsed.success) {
    return err("VALIDATION", parsed.error.issues[0]?.message ?? "Số điện thoại không hợp lệ")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    phone: parsed.data,
  })

  if (error) {
    return err("AUTH_FAILED", error.message)
  }

  return ok({ phone: parsed.data })
}

export async function verifyPhoneOTP(
  rawPhone: string,
  token: string,
  rawRole?: string,
): Promise<Result<{ redirectTo: string }>> {
  const parsedPhone = PhoneSchema.safeParse(rawPhone)
  if (!parsedPhone.success) {
    return err("VALIDATION", "Số điện thoại không hợp lệ")
  }

  const parsedToken = z
    .string()
    .regex(/^\d{6}$/, "Mã OTP gồm 6 chữ số")
    .safeParse(token.trim())
  if (!parsedToken.success) {
    return err("VALIDATION", parsedToken.error.issues[0]?.message ?? "Mã OTP không hợp lệ")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    phone: parsedPhone.data,
    token: parsedToken.data,
    type: "sms",
  })

  if (error) {
    return err("AUTH_FAILED", error.message)
  }

  const role = RoleSchema.safeParse(rawRole).data
  return ok({ redirectTo: role ? `/onboarding?role=${role}` : "/onboarding" })
}
