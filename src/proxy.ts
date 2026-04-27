// src/proxy.ts
// Supabase auth session refresh + route protection
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Routes cần biết user có đăng nhập hay không.
// Mọi route khác (landing, /login, /auth/*, /api/*, asset) đi qua thẳng,
// không gọi supabase.auth.getUser() để tránh rate-limit.
const PROTECTED_PREFIXES = ["/teacher", "/parent", "/onboarding"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  const isLogin = pathname === "/login"

  // Public route + không phải /login → không cần check session ở đây.
  // (Server components vẫn tự gọi requireParent/requireTeacher khi cần.)
  if (!isProtected && !isLogin) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh session nếu hết hạn. Nếu rate-limit (429) thì coi như chưa login
  // và để route handler quyết định, không crash request.
  let user: { id: string } | null = null
  try {
    const result = await supabase.auth.getUser()
    user = result.data.user
  } catch {
    user = null
  }

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // Đã đăng nhập mà ghé /login → đẩy về home (callback sẽ tự route theo role)
  if (user && isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  // Bỏ qua _next, asset tĩnh, api (api tự xử auth), favicon, manifest, icons
  matcher: [
    "/((?!_next/static|_next/image|_next/data|api|auth|favicon\\.ico|manifest\\.webmanifest|sw\\.js|workbox-.*|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
}
