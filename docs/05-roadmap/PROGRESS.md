# Progress Tracker — HocCungEm

> Update mỗi cuối ngày. Format: ✅ done | 🟡 partial | ❌ not started | ⏭️ skipped

**Cập nhật lần cuối:** 25/04/2026 (D0)

---

## Tổng quan

| Ngày | Mục tiêu | Trạng thái | % |
|---|---|---|---|
| D0 | Docs + scaffold | 🟡 đang làm | 50% |
| D1 | Auth + Schema + RLS | ❌ | 0% |
| D2 | Class + Student + Topic | ❌ | 0% |
| D3 | Chat AI | ❌ | 0% |
| D4 | Guard + Upload | ❌ | 0% |
| D5 | Dashboard GV | ❌ | 0% |
| D6 | Cron Insight + Report | ❌ | 0% |
| D7 | Polish + PWA | ❌ | 0% |
| D8 | Slides + Rehearsal | ❌ | 0% |
| D9 | Trình bày | ❌ | 0% |

---

## D0 — 25/04 chi tiết

### Docs
- ✅ README.md
- ✅ 01-product/* (6 files)
- ✅ 02-pedagogy/* (4 files)
- ✅ 03-architecture/* (8 files)
- ✅ 04-development/* (7 files)
- 🟡 05-roadmap/* (đang viết)
- ❌ 06-competition/*
- ❌ 07-operations/*
- ❌ 08-presentation/*

### Code
- ❌ Scaffold Next.js
- ❌ Setup deps
- ❌ First deploy

---

## Modules tracker

| Module | Owner | Status | Note |
|---|---|---|---|
| Auth (Supabase) | AI | ❌ | |
| DB schema (Drizzle) | AI | ❌ | |
| RLS policies | AI | ❌ | |
| Class management | AI | ❌ | |
| Student management | AI | ❌ | |
| Topic CRUD | AI | ❌ | |
| Parent linking | AI | ❌ | |
| Chat Cô Mây | AI | ❌ | Core |
| AI Guard | AI | ❌ | Core |
| Upload notebook | AI | ❌ | Core |
| Vision (ảnh đề bài trong chat) | AI | ❌ | |
| Teacher dashboard | AI | ❌ | |
| Review tick | AI | ❌ | |
| Weekly insight cron | AI | ❌ | |
| Weekly report cron | AI | ❌ | |
| Email (Resend) | AI | ❌ | |
| PWA (Serwist) | AI | ❌ | |
| Landing page | AI | ❌ | |
| Privacy page | AI | ❌ | |

---

## Bugs / Issues

| # | Mô tả | Ngày | Status |
|---|---|---|---|
| — | (chưa có) | | |

---

## Decisions

| # | Decision | Ngày | Lý do |
|---|---|---|---|
| 1 | Dùng Next.js thay Nuxt | 25/04 | 1 codebase fullstack, deploy Vercel |
| 2 | Drizzle + Supabase JS hybrid | 25/04 | Type-safe + Auth/Storage tiện |
| 3 | Bỏ PostHog cho MVP | 25/04 | Vercel Analytics đủ |
| 4 | Brand: HocCungEm | 25/04 | Ngắn, dễ nhớ, Việt |
| 5 | AI persona: Cô Mây | 25/04 | Mềm, gần gũi, không hù dọa |
| 6 | "Tự học" thay "BTVN" | 25/04 | Tuân thủ TT 28/2020 |

---

## Quota usage

| Service | Limit | Đã dùng | % |
|---|---|---|---|
| Supabase DB | 500MB | 0 | 0% |
| Supabase Storage | 1GB | 0 | 0% |
| Gemini | 1500 req/day | 0 | 0% |
| Resend | 3000/month | 0 | 0% |
| Sentry | 5k errors/month | 0 | 0% |
| Vercel | 100GB bw | 0 | 0% |

→ Đọc tiếp: [DAILY_LOG.md](DAILY_LOG.md)
