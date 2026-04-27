"use server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { db } from "@/db"
import { parents, teachers } from "@/db/schema"
import { err, type Result } from "@/lib/types/result"
import { requireUser } from "@/server/auth"

// Chuẩn hoá số điện thoại VN sang E.164 (giống login/actions.ts)
function normalizePhone(raw: string): string | undefined {
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  const digits = trimmed.replace(/\D/g, "")
  let e164: string
  if (trimmed.startsWith("+")) e164 = `+${digits}`
  else if (digits.startsWith("84")) e164 = `+${digits}`
  else if (digits.startsWith("0")) e164 = `+84${digits.slice(1)}`
  else e164 = `+84${digits}`
  return /^\+84[3-9]\d{8}$/.test(e164) ? e164 : undefined
}

const Input = z.object({
  role: z.enum(["teacher", "parent"]),
  fullName: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
})

export async function completeOnboarding(raw: unknown): Promise<Result<never>> {
  const parsed = Input.safeParse(raw)
  if (!parsed.success) {
    return err("VALIDATION", parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ")
  }

  let user
  try {
    user = await requireUser()
  } catch {
    return err("UNAUTHENTICATED", "Phiên đăng nhập đã hết hạn")
  }

  // Ưu tiên thông tin đã xác minh từ Supabase auth.users; field user nhập chỉ bù khi auth chưa có.
  const verifiedEmail = user.email?.trim() || undefined
  const verifiedPhone = user.phone ? `+${user.phone.replace(/\D/g, "")}` : undefined
  const inputPhone = parsed.data.phone ? normalizePhone(parsed.data.phone) : undefined
  const inputEmail = parsed.data.email
    ? z.string().email().safeParse(parsed.data.email).data
    : undefined

  const finalEmail = verifiedEmail ?? inputEmail
  const finalPhone = verifiedPhone ?? inputPhone

  if (!finalEmail && !finalPhone) {
    return err("VALIDATION", "Cần ít nhất email hoặc số điện thoại")
  }
  if (parsed.data.email && !verifiedEmail && !inputEmail) {
    return err("VALIDATION", "Email không hợp lệ")
  }
  if (parsed.data.phone && !verifiedPhone && !inputPhone) {
    return err("VALIDATION", "Số điện thoại Việt Nam không hợp lệ")
  }

  try {
    if (parsed.data.role === "teacher") {
      await db
        .insert(teachers)
        .values({
          authUserId: user.id,
          fullName: parsed.data.fullName,
          email: finalEmail,
          phone: finalPhone,
        })
        .onConflictDoNothing()
    } else {
      await db
        .insert(parents)
        .values({
          authUserId: user.id,
          fullName: parsed.data.fullName,
          email: finalEmail,
          phone: finalPhone,
        })
        .onConflictDoNothing()
    }
  } catch (e) {
    return err("DB", e instanceof Error ? e.message : "Không tạo được hồ sơ")
  }

  // Throw NEXT_REDIRECT — must be outside try/catch
  redirect(parsed.data.role === "teacher" ? "/teacher/dashboard" : "/parent/home")
}
