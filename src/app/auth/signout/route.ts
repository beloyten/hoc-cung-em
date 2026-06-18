// src/app/auth/signout/route.ts
// QUAN TRỌNG: KHÔNG dùng createClient() từ server.ts ở đây.
// cookies() từ next/headers KHÔNG merge vào NextResponse.redirect() trong Route Handler,
// nên cleared cookie sẽ không đến được browser → user vẫn còn session cũ.
// Giải pháp: set cookie trực tiếp lên response object (giống pattern trong callback/route.ts).
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin
  let response = NextResponse.redirect(`${origin}/`, { status: 303 })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.redirect(`${origin}/`, { status: 303 })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  await supabase.auth.signOut()
  return response
}
