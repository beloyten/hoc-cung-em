# Environment Variables — HocCungEm

> File này là **single source of truth** cho mọi env variable.

---

## 1. `.env.example`

Copy file này thành `.env.local` và điền:

```env
# ===== App =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HocCungEm

# ===== Supabase =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SECRET_KEY=sb_secret_xxx

# ===== Database (Drizzle) =====
# Dùng Transaction pooler (port 6543)
DATABASE_URL=postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# ===== Google Gemini =====
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...

# ===== Resend =====
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@hoccungem.vn

# ===== Sentry =====
# DSN public — an toàn lộ ra client (chỉ cho phép gửi event vào project này)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.us.sentry.io/xxx
SENTRY_DSN=https://xxx@xxx.ingest.us.sentry.io/xxx
SENTRY_ORG=hoc-cung-em
SENTRY_PROJECT=hoc-cung-em
# AUTH TOKEN — TUYỆT ĐỐI BÍ MẬT, chỉ để upload source maps khi build
# Đặt vào Vercel env (Production + Preview), KHÔNG commit vào repo
# Giá trị thật lưu trong .env.local (đã gitignore) và 1Password
SENTRY_AUTH_TOKEN=sntryu_xxx

# ===== Cron =====
# Random secret để verify cron call
CRON_SECRET=<random-32-char-string>

# ===== AI Config =====
AI_MODEL_PRIMARY=gemini-2.0-flash
AI_MODEL_BACKUP=gemini-1.5-flash
AI_MAX_MESSAGES_PER_HOUR=30
```

---

## 2. Bảng giải thích

| Variable                               | Public? | Bắt buộc      | Dùng ở đâu                |
| -------------------------------------- | ------- | ------------- | ------------------------- |
| `NEXT_PUBLIC_APP_URL`                  | ✅      | ✅            | Email links, OG tags      |
| `NEXT_PUBLIC_APP_NAME`                 | ✅      | ✅            | UI text                   |
| `NEXT_PUBLIC_SUPABASE_URL`             | ✅      | ✅            | Supabase client           |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅      | ✅            | Supabase client (anon)    |
| `SUPABASE_SECRET_KEY`                  | ❌      | ✅            | Server-only — cron, admin |
| `DATABASE_URL`                         | ❌      | ✅            | Drizzle                   |
| `GOOGLE_GENERATIVE_AI_API_KEY`         | ❌      | ✅            | AI SDK server-side        |
| `RESEND_API_KEY`                       | ❌      | ✅            | Send email                |
| `RESEND_FROM_EMAIL`                    | ❌      | ✅            | Email sender              |
| `NEXT_PUBLIC_SENTRY_DSN`               | ✅      | ⚠️            | Sentry browser            |
| `SENTRY_DSN`                           | ❌      | ⚠️            | Sentry server             |
| `SENTRY_AUTH_TOKEN`                    | ❌      | ⚠️ build-only | Sentry source maps upload |
| `CRON_SECRET`                          | ❌      | ✅            | Verify cron caller        |

---

## 3. Validation runtime

```ts
// src/lib/env.ts
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
```

App sẽ crash sớm nếu thiếu env quan trọng → tốt hơn lỗi runtime sau này.

---

## 4. Vercel deployment

Set env ở: **Vercel project → Settings → Environment Variables**

3 scope: `Development`, `Preview`, `Production`.

| Var                   | Dev                               | Preview     | Prod         |
| --------------------- | --------------------------------- | ----------- | ------------ |
| `NEXT_PUBLIC_APP_URL` | localhost                         | preview URL | hoccungem.vn |
| `DATABASE_URL`        | dev DB                            | dev DB      | prod DB      |
| Tất cả còn lại        | giống nhau hoặc separate cho prod |             |              |

---

## 5. Rotate keys

Khi nào rotate?

- Khi 1 nhân viên nghỉ
- Khi nghi ngờ leak (push lên public repo nhầm)
- Định kỳ: 6 tháng/lần

Quy trình:

1. Tạo key mới ở dashboard service
2. Update Vercel env
3. Redeploy
4. Verify hoạt động
5. Revoke key cũ

→ Đọc tiếp: [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)
