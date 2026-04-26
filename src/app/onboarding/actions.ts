"use server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { db } from "@/db"
import { parents, teachers } from "@/db/schema"
import { err, type Result } from "@/lib/types/result"
import { requireUser } from "@/server/auth"

const Input = z.object({
  role: z.enum(["teacher", "parent"]),
  fullName: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .max(20)
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

  const email = user.email
  if (!email) return err("VALIDATION", "Tài khoản chưa có email")

  try {
    if (parsed.data.role === "teacher") {
      await db
        .insert(teachers)
        .values({
          authUserId: user.id,
          fullName: parsed.data.fullName,
          email,
        })
        .onConflictDoNothing()
    } else {
      await db
        .insert(parents)
        .values({
          authUserId: user.id,
          fullName: parsed.data.fullName,
          email,
          phone: parsed.data.phone,
        })
        .onConflictDoNothing()
    }
  } catch (e) {
    return err("DB", e instanceof Error ? e.message : "Không tạo được hồ sơ")
  }

  // Throw NEXT_REDIRECT — must be outside try/catch
  redirect(parsed.data.role === "teacher" ? "/teacher/dashboard" : "/parent/home")
}
