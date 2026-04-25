# Deployment — HocCungEm

---

## 1. Production stack

```
[Người dùng] → [Cloudflare DNS] → [Vercel Edge] → [Next.js (Vercel sin1)]
                                                      ↓
                                                  [Supabase sin1]
                                                  [Gemini API]
                                                  [Resend API]
```

---

## 2. First-time deploy

### 2.1 Supabase production
```bash
# Apply migrations
DATABASE_URL="postgresql://...prod..." pnpm drizzle-kit migrate

# Apply RLS
psql "$PROD_DATABASE_URL" -f src/db/rls-policies.sql

# (Optional) seed
DATABASE_URL="..." pnpm tsx src/db/seed.ts
```

### 2.2 Vercel project
1. Import GitHub repo
2. Framework: Next.js (auto)
3. Region: Singapore (sin1)
4. Set env variables (Production scope) — copy từ `.env.local`
5. Add custom domain `hoccungem.vn`

### 2.3 Cron jobs
File `vercel.json`:
```json
{
  "crons": [
    { "path": "/api/cron/weekly-insights", "schedule": "0 6 * * 1" },
    { "path": "/api/cron/weekly-reports",  "schedule": "0 7 * * 1" },
    { "path": "/api/cron/cleanup-old",     "schedule": "0 3 * * *" }
  ]
}
```

→ Cron tự động chạy theo schedule. Verify ở Vercel → Cron tab.

### 2.4 Sentry
```bash
# CI sẽ upload source map khi build có SENTRY_AUTH_TOKEN
pnpm build
```

Verify: chế tạo lỗi test → Vercel logs → Sentry dashboard có alert.

---

## 3. Subsequent deploys

```bash
git push origin main
# Vercel auto build & deploy ~2 phút
```

Theo dõi:
- Vercel dashboard → Deployments
- Sentry → tăng vọt error?
- Vercel Analytics → traffic bình thường?

---

## 4. Schema migration on production

⚠️ **Risky.** Quy trình:

1. **Backup** Supabase DB (Dashboard → Backups → Manual backup)
2. **Test migration trên branch DB** (Supabase có Preview Branches — Pro plan)
3. **Maintenance window**: post status "Hệ thống bảo trì 5 phút" lên app
4. **Apply migration:**
   ```bash
   DATABASE_URL="$PROD" pnpm drizzle-kit migrate
   ```
5. **Apply RLS update** (nếu có)
6. **Smoke test** core flows (chat, upload, dashboard)
7. **Remove maintenance banner**

Nếu migration phá: restore từ backup (mất data từ thời điểm backup).

---

## 5. Rollback

### Code
- Vercel → Deployments → Promote bản trước

### DB
- Restore backup trong Supabase dashboard

---

## 6. Monitoring

| Metric | Tool | Alert threshold |
|---|---|---|
| Errors | Sentry | > 10 errors / 10 phút → email |
| Uptime | Vercel built-in | down > 1 phút |
| DB CPU | Supabase | > 80% sustain 5 phút |
| Gemini quota | Custom dashboard | > 80% daily limit |
| Storage | Supabase | > 80% bucket capacity |

---

## 7. Custom domain setup

DNS records (Cloudflare hoặc registrar):

| Type | Name | Value |
|---|---|---|
| CNAME | `@` | `cname.vercel-dns.com` |
| CNAME | `www` | `cname.vercel-dns.com` |
| TXT | `@` | Resend verify |
| MX/TXT | Resend DKIM | (Resend tự generate) |

→ Vercel sẽ tự issue SSL.

---

## 8. Post-deploy checklist

- [ ] https://hoccungem.vn load 200ms
- [ ] Login GV / PH thành công
- [ ] Chat AI trả về (test 1 câu)
- [ ] Upload ảnh thành công
- [ ] Email verify nhận được
- [ ] Sentry receive 1 test error
- [ ] Mobile (PWA install banner xuất hiện)
- [ ] Lighthouse PWA ≥ 90, Performance ≥ 80

→ Đọc tiếp: [ROADMAP.md](../05-roadmap/ROADMAP.md)
