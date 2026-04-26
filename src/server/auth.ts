// src/server/auth.ts
// Auth helpers cho Server Actions và Server Components.
// Throw error nếu không đủ quyền — caller catch và trả về Result.
import "server-only"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { parents, teachers } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"

export class AuthError extends Error {
  constructor(
    public code: "UNAUTHENTICATED" | "NOT_A_TEACHER" | "NOT_A_PARENT",
    message?: string,
  ) {
    super(message ?? code)
    this.name = "AuthError"
  }
}

export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new AuthError("UNAUTHENTICATED")
  return user
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function requireTeacher() {
  const user = await requireUser()
  const [teacher] = await db.select().from(teachers).where(eq(teachers.authUserId, user.id))
  if (!teacher) throw new AuthError("NOT_A_TEACHER")
  return { user, teacher }
}

export async function requireParent() {
  const user = await requireUser()
  const [parent] = await db.select().from(parents).where(eq(parents.authUserId, user.id))
  if (!parent) throw new AuthError("NOT_A_PARENT")
  return { user, parent }
}

export async function getCurrentRole(): Promise<"teacher" | "parent" | null> {
  const user = await getCurrentUser()
  if (!user) return null
  const [t] = await db
    .select({ id: teachers.id })
    .from(teachers)
    .where(eq(teachers.authUserId, user.id))
  if (t) return "teacher"
  const [p] = await db
    .select({ id: parents.id })
    .from(parents)
    .where(eq(parents.authUserId, user.id))
  if (p) return "parent"
  return null
}
