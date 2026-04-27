// src/app/auth/callback/route.ts
// Magic link callback — exchange code for session, then route by role.
//
// QUAN TRỌNG: KHÔNG dùng createClient() từ server.ts ở đây.
// cookies() từ next/headers KHÔNG merge vào NextResponse.redirect() trong Route Handler,
// nên session cookie sẽ không đến được browser → user vẫn thấy chưa đăng nhập.
// Giải pháp: set cookie trực tiếp lên response object (giống pattern trong proxy.ts).
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get("code")
  const next = searchParams.get("next")

  // Luôn dùng APP_URL từ env để tránh Vercel/Cloudflare forward trả về http:// thay vì https://
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  // /onboarding tự redirect theo role (teacher → /teacher/dashboard, parent → /parent/home)
  const redirectTo = next?.startsWith("/") ? `${origin}${next}` : `${origin}/onboarding`
  let response = NextResponse.redirect(redirectTo)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Bước 1: update request cookies để các lần đọc tiếp trong cùng request thấy session
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Bước 2: tạo lại response redirect và gắn cookies vào để browser nhận được session
          response = NextResponse.redirect(redirectTo)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  return response
}
