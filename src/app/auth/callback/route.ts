// src/app/auth/callback/route.ts
// Magic link callback — exchange code for session, then route by role.
import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentRole } from "@/server/auth"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const next = searchParams.get("next")

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  if (next && next.startsWith("/")) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  const role = await getCurrentRole()
  if (role === "teacher") return NextResponse.redirect(`${origin}/teacher/dashboard`)
  if (role === "parent") return NextResponse.redirect(`${origin}/parent/home`)
  // Mới đăng ký nhưng chưa có profile → đi tới onboarding chọn role
  return NextResponse.redirect(`${origin}/onboarding`)
}
