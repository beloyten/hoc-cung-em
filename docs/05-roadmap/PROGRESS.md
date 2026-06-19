# Progress Tracker — HocCungEm

> Lịch sử sprint thi đấu (kết thúc 04/05/2026). Roadmap tiếp theo xem [ROADMAP.md](ROADMAP.md).

**Cập nhật lần cuối:** 19/06/2026

---

## Phase 1 — Topic Library (đang làm)

### Đã làm (19/06/2026)

- ✅ Bug fix: "Đổi vai trò" trên login page bị link sai (`/login` thay vì `/login?role=teacher`)
- ✅ `src/db/schema/topic-templates.ts` — schema mới, reuse `subjectEnum` từ study-topics
- ✅ `src/db/schema/index.ts` — export topic-templates
- ✅ `src/db/seed-templates.ts` — 15 Grade 4 Math templates với context đầy đủ
- ✅ `package.json` — thêm script `db:seed-templates`
- ✅ `src/db/rls-policies.sql` — thêm policy cho `topic_templates` (SELECT cho authenticated)
- ✅ Docs: ROADMAP.md v3.0, PROGRESS.md

### Còn lại — cần làm khi có node_modules hoạt động

```bash
# 1. Generate migration từ schema mới
pnpm db:generate
# (nếu trên network drive cần: node node_modules/drizzle-kit/bin.cjs generate)

# 2. Apply migration lên Supabase
pnpm db:migrate

# 3. Apply RLS policy mới cho topic_templates
pnpm db:rls

# 4. Seed 15 templates
pnpm db:seed-templates
```

Sau đó: Phase 1 tiếp tục với UI (API route + tab "Thư viện mẫu" trong teacher dashboard).

---

## Tổng quan

| Ngày | Mục tiêu                | Trạng thái  | %    |
| ---- | ----------------------- | ----------- | ---- |
| D0   | Docs + scaffold         | ✅ done     | 100% |
| D1   | Auth + Schema + RLS     | ✅ done     | 100% |
| D2   | Class + Student + Topic | ✅ done     | 100% |
| D3   | Chat AI                 | ✅ done     | 100% |
| D4   | Guard + Upload          | ✅ done     | 100% |
| D5   | Dashboard GV            | ✅ done     | 100% |
| D6   | Cron Insight + Report   | ✅ done     | 100% |
| D7   | Polish + PWA            | 🟡 đang làm | 70%  |
| D8   | Slides + Rehearsal      | ❌          | 0%   |
| D9   | Trình bày               | ❌          | 0%   |

---

## D0 — 25/04 chi tiết

### Docs

- ✅ README.md
- ✅ 01-product/\* (6 files)
- ✅ 02-pedagogy/\* (4 files)
- ✅ 03-architecture/\* (8 files)
- ✅ 04-development/\* (7 files)
- 🟡 05-roadmap/\* (đang viết)
- ❌ 06-competition/\*
- ❌ 07-operations/\*
- ❌ 08-presentation/\*

### Code

- ❌ Scaffold Next.js
- ❌ Setup deps
- ❌ First deploy

---

## Modules tracker

| Module                         | Owner | Status | Note                           |
| ------------------------------ | ----- | ------ | ------------------------------ |
| Auth (Supabase)                | AI    | ✅     | parent + teacher flows         |
| DB schema (Drizzle)            | AI    | ✅     | 13 tables + indexes            |
| RLS policies                   | AI    | ✅     | applied via migrate            |
| Class management               | AI    | ✅     | join code K7M2P9               |
| Student management             | AI    | ✅     | seed 5 hs cho 4A1              |
| Topic CRUD                     | AI    | ✅     | feeds Cô Mây context           |
| Parent linking                 | AI    | ✅     | teacher verify                 |
| Chat Cô Mây                    | AI    | ✅     | gemini-2.5-flash, AI SDK v6    |
| System prompt v2.0             | AI    | ✅     | few-shot examples, tighter rules |
| Rate limiting                  | AI    | ✅     | 30 msg/hr/parent, 429 + UI lock  |
| AI Guard                       | AI    | ✅     | passed/retried/fallback badges |
| Upload notebook                | AI    | ✅     | 6 ảnh, 10MB, signed URL 30′    |
| Vision (ảnh đề bài trong chat) | AI    | ⏭️     | post-MVP                       |
| Teacher dashboard              | AI    | ✅     | classes + pending links        |
| Review tick                    | AI    | ✅     | good / needs_support + note    |
| Weekly insight cron            | AI    | ✅     | Sun 22:00 UTC                  |
| Weekly report cron             | AI    | ✅     | Sun 23:00 UTC                  |
| Email (Resend)                 | AI    | ✅     | HTML+text, vi-VN               |
| PWA (Serwist)                  | AI    | ✅     | manifest + install prompt      |
| Landing page                   | AI    | ✅     | polished — banner, chat demo, 3 roles |
| Privacy page                   | AI    | ✅     | /privacy, linked từ footer     |

---

## Bugs / Issues

| #   | Mô tả                                                            | Ngày  | Status   |
| --- | ---------------------------------------------------------------- | ----- | -------- |
| 1   | AI SDK v6 `convertToModelMessages` returns Promise — mất `await` | 26/04 | ✅ fixed |
| 2   | shadcn Button không có `asChild` — dùng `buttonVariants()`       | 26/04 | ✅ fixed |
| 3   | `useRef().current` trong render — chuyển sang `useMemo`          | 26/04 | ✅ fixed |
| 4   | `server-only` trong tsx script — inline createClient cho seed    | 26/04 | ✅ fixed |
| 5   | Tailwind v4: `bg-gradient-to-b` → `bg-linear-to-b`               | 26/04 | ✅ fixed |
| 6   | A11y: `<select>`/`<input file>` thiếu label                      | 26/04 | ✅ fixed |
| 7   | signout không clear cookie trên browser → không vào /login được  | 18/06 | ✅ fixed |
| 8   | 2nd AI message crash — debug logging + try/catch quanh streamText | 19/06 | 🟡 logging added, chờ reproduce |

---

## Decisions

| #   | Decision                     | Ngày  | Lý do                               |
| --- | ---------------------------- | ----- | ----------------------------------- |
| 1   | Dùng Next.js thay Nuxt       | 25/04 | 1 codebase fullstack, deploy Vercel |
| 2   | Drizzle + Supabase JS hybrid | 25/04 | Type-safe + Auth/Storage tiện       |
| 3   | Bỏ PostHog cho MVP           | 25/04 | Vercel Analytics đủ                 |
| 4   | Brand: HocCungEm             | 25/04 | Ngắn, dễ nhớ, Việt                  |
| 5   | AI persona: Cô Mây           | 25/04 | Mềm, gần gũi, không hù dọa          |
| 6   | "Tự học" thay "BTVN"         | 25/04 | Tuân thủ TT 28/2020                 |

---

## Quota usage

| Service          | Limit           | Đã dùng | %   |
| ---------------- | --------------- | ------- | --- |
| Supabase DB      | 500MB           | 0       | 0%  |
| Supabase Storage | 1GB             | 0       | 0%  |
| Gemini           | 1500 req/day    | 0       | 0%  |
| Resend           | 3000/month      | 0       | 0%  |
| Sentry           | 5k errors/month | 0       | 0%  |
| Vercel           | 100GB bw        | 0       | 0%  |

→ Đọc tiếp: [DAILY_LOG.md](DAILY_LOG.md)
