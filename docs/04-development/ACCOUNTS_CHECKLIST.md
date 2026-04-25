# Accounts Checklist — HocCungEm

> Tất cả tài khoản dịch vụ cần có để chạy production.

---

## 1. Bắt buộc cho MVP

| # | Service | Mục đích | Free tier đủ? | Status |
|---|---|---|---|---|
| 1 | **GitHub** | Source code | ✅ | ☐ |
| 2 | **Vercel** | Hosting + Cron | ✅ Hobby (cá nhân) | ☐ |
| 3 | **Supabase** | DB + Auth + Storage | ✅ Free 500MB DB / 1GB storage | ☐ |
| 4 | **Google AI Studio** | Gemini API | ✅ 15 RPM / 1500 req/day | ☐ |
| 5 | **Resend** | Email transaction | ✅ 3000/month | ☐ |
| 6 | **Sentry** | Error tracking | ✅ Developer 5k errors/month | ☐ |
| 7 | **Domain** (.vn hoặc .com) | URL | ❌ ~300k VND/năm | ☐ |

---

## 2. Optional / sau MVP

| Service | Mục đích | Khi nào cần |
|---|---|---|
| Cloudflare | DNS + DDoS | Khi traffic > 10k DAU |
| Upstash Redis | Rate limit | Khi cần precise rate limit |
| PostHog | Product analytics | Khi muốn funnel chi tiết |
| Tawk.to | Live chat support | Khi có ≥ 5 lớp |

---

## 3. Setup từng service

### 3.1 GitHub
- Tạo repo `hoc-cung-em` (private)
- Branch protection cho `main`
- Add user là sole maintainer

### 3.2 Vercel
- Import từ GitHub
- Project name: `hoc-cung-em`
- Framework: Next.js
- Region: Singapore (sin1)
- Environment variables: copy từ `.env.local`
- Custom domain: `hoccungem.[tld]`

### 3.3 Supabase
- Project: `hoc-cung-em`
- Region: Southeast Asia (Singapore)
- Database password: lưu vào 1Password
- Lấy:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon/publishable key` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `service_role/secret key` → `SUPABASE_SECRET_KEY`
  - Connection string (Transaction pooler) → `DATABASE_URL`

### 3.4 Google AI Studio
- Truy cập https://aistudio.google.com
- Tạo API key
- Lưu → `GOOGLE_GENERATIVE_AI_API_KEY`
- Bật billing (free tier vẫn dùng được, chỉ khi vượt mới tính tiền)

### 3.5 Resend
- Đăng ký tài khoản
- Add domain `hoccungem.[tld]` + verify DNS records
- Tạo API key → `RESEND_API_KEY`
- Sender: `noreply@hoccungem.[tld]`

### 3.6 Sentry
- Tạo organization `hoc-cung-em`
- Tạo project `hoc-cung-em`, platform Next.js
- Lấy `DSN` → `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN`
- Tạo Auth Token (Settings → Auth Tokens) với scopes:
  - `project:read`
  - `project:releases`
  - `org:read`
  → `SENTRY_AUTH_TOKEN`

#### Plan — chọn Developer (Free), KHÔNG phải Business

> Khi mới tạo project, Sentry mặc định bật **Business trial 14 ngày** ($89/mo). **Phải downgrade về Developer (Free)** trước khi trial hết, nếu không sẽ bị tính tiền.

**Cách downgrade:**
1. Vào https://sentry.io/settings/hoc-cung-em/billing/
2. Bấm **"Manage Subscription"** → chọn **Developer** (Free)
3. Xác nhận

**Tại sao Developer đủ cho dự án:**

| Plan | $/mo | Errors | Replays | Spans | Đủ cho HocCungEm? |
|---|---|---|---|---|---|
| **Developer** | **$0** | **5,000** | **50** | **10M** | ✅ thừa cho 1 lớp 30 HS |
| Team | $29 | 50,000 | 500 | 10M | Khi mở rộng > 10 lớp |
| Business | $89 | 50,000 | 500 | 5M | ❌ không cần — chỉ thêm SSO/SAML, retention dài, audit log |

→ Pilot 4A1 (~30 HS, ~50 phiên/ngày) ước tính **< 100 errors/tháng** nếu code chuẩn. Free thừa.

→ Khi nào cần upgrade: chỉ khi mở rộng > 5 lớp **VÀ** có vốn tài trợ. Trước đó: Developer.

### 3.7 Domain
- Mua tại PA Vietnam / Mat Bao / Namecheap
- Suggest:
  - `hoccungem.vn` (chuyên nghiệp, VN)
  - `hoccungem.com` (quốc tế)
- Set DNS records theo Vercel + Resend

---

## 4. Vault credentials

Lưu vào **1Password** (hoặc tương đương) folder `HocCungEm`:
- Mọi password
- Mọi API key
- Database connection string
- Backup codes 2FA

⚠️ **Tuyệt đối** không commit credentials vào Git.

---

## 5. Production deploy checklist (tóm tắt)

- [ ] Domain đã verify ở Vercel
- [ ] DNS DKIM/SPF cho Resend
- [ ] Migration đã chạy trên Supabase production
- [ ] RLS policies đã apply
- [ ] Env vars đã set ở Vercel (Production scope)
- [ ] `SENTRY_AUTH_TOKEN` đã có ở build env
- [ ] Cron jobs trong `vercel.json` (`CRON_SECRET` đã set)
- [ ] Test smoke flow end-to-end với 1 GV + 1 PH thật

→ Đọc tiếp: [ENV_VARIABLES.md](ENV_VARIABLES.md)
