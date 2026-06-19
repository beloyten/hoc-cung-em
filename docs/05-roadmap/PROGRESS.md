# Progress Tracker — HocCungEm

> Lịch sử sprint thi đấu (kết thúc 04/05/2026). Roadmap tiếp theo xem [ROADMAP.md](ROADMAP.md).

**Cập nhật lần cuối:** 19/06/2026

---

## Phase 1–5 — Hoàn thành (19/06/2026)

### Phase 1 — Topic Library ✅

- ✅ `src/db/schema/topic-templates.ts` — schema mới, reuse `subjectEnum`
- ✅ Migration `0002_add_topic_templates.sql` — tạo bảng `topic_templates`
- ✅ RLS policy `topic_templates_select` cho authenticated users
- ✅ `src/db/seed-templates.ts` — 15 Grade 4 Math + 10 Tiếng Việt lớp 4
- ✅ `GET /api/topic-templates?grade=&subject=` — với subject filter đúng (`eq` trong WHERE)
- ✅ `TemplatePicker` dialog — lazy load, preview, apply
- ✅ `TopicCreateForm` + `topics/page.tsx` — threaded `subject` prop đến picker và API

### Phase 2 — Multi-grade + Multi-subject ✅

- ✅ Migration `0003_expand_subject_enum.sql` — thêm `vietnamese | science | history_geography | social_studies`
- ✅ `systemPromptV2` — grade+subject aware, `subjectGuidance()` per-subject pedagogy notes
- ✅ `loadChatForParent` — trả về `grade` + `subject` (topic subject ưu tiên hơn class subject)
- ✅ Create class form — grade selector 1–5 + subject selector
- ✅ Landing page copy — "Toán lớp 4" → "Tiểu học lớp 1–5"

### Phase 3 — UI/UX + Image in Chat ✅

- ✅ `framer-motion` 12.40.0 installed
- ✅ `/api/chat-image-upload` — multipart, MIME validation, ownership check, signed URL 1hr
- ✅ `chat-panel.tsx` — camera button, file input, thumbnail preview, pendingImageUrls Map
- ✅ `chat/route.ts` — `imageUrl` body param → multimodal Gemini image part
- ✅ `AnimatedChatDemo` — framer-motion state machine, 6-bubble demo script
- ✅ Message bubbles: AnimatePresence entrance, typing indicator 3-dot CSS bounce
- ✅ Micro-interactions: `active:scale-[0.97]` buttons, `hover:-translate-y-0.5` cards

### Phase 4 — AI cho Giáo viên & Phụ huynh ✅ (partial)

- ✅ `/api/teacher-query` — streaming analytic AI, scoped to class data, onError logging
- ✅ `TeacherQueryWidget` — sample chips, streaming reader với UTF-8 flush
- ✅ `/api/parent-child-summary` — generateObject với summarySchema, try/catch → 503
- ✅ `ChildSummaryWidget` — skeleton loading, multi-student selector, sections emerald/amber/sky
- ⏭️ Phase 4.3 School Admin — B2B, postponed

### Phase 5 — Data-informed Lesson Suggestions ✅

- ✅ `suggestedFocus: text` thêm vào `weekly_insights` schema
- ✅ Migration `0004_add_suggested_focus.sql` applied to production
- ✅ Cron `weekly-insights.ts` — `insightSchema` có `suggestedFocus`, `buildPrompt` nhận `grade + totalStudents` (từ DB count, không từ messages)
- ✅ `insights/page.tsx` — sky-colored banner "🎯 Gợi ý ưu tiên tuần sau"
- ✅ `manifest.ts` description update

### Bug fixes trong review lần cuối ✅

- ✅ `weekly-insights.ts` — `totalStudents` dùng DB count thực tế thay vì count từ messages tuần đó
- ✅ `parent-child-summary/route.ts` — `generateObject` wrapped trong try/catch → trả 503
- ✅ `teacher-query/route.ts` — thêm `onError` handler cho logging
- ✅ `teacher-query-widget.tsx` — `TextDecoder` flush sau vòng lặp (multi-byte UTF-8)

---

## Tổng quan Sprint gốc (thi đấu)

| Ngày | Mục tiêu                | Trạng thái | %    |
| ---- | ----------------------- | ---------- | ---- |
| D0   | Docs + scaffold         | ✅ done    | 100% |
| D1   | Auth + Schema + RLS     | ✅ done    | 100% |
| D2   | Class + Student + Topic | ✅ done    | 100% |
| D3   | Chat AI                 | ✅ done    | 100% |
| D4   | Guard + Upload          | ✅ done    | 100% |
| D5   | Dashboard GV            | ✅ done    | 100% |
| D6   | Cron Insight + Report   | ✅ done    | 100% |
| D7   | Polish + PWA            | ✅ done    | 100% |

## Post-competition (Phase 1–5)

| Phase | Feature                       | Trạng thái   |
| ----- | ----------------------------- | ------------ |
| 1     | Topic Library + Templates     | ✅ done      |
| 2     | Multi-grade + Multi-subject   | ✅ done      |
| 3     | Image in Chat + UI Animations | ✅ done      |
| 4     | AI for Teacher + Parent       | ✅ done      |
| 4.3   | School Admin (B2B)            | ⏭️ postponed |
| 5     | Data-informed Suggestions     | ✅ done      |

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

| Module                         | Owner | Status | Note                                  |
| ------------------------------ | ----- | ------ | ------------------------------------- |
| Auth (Supabase)                | AI    | ✅     | parent + teacher flows                |
| DB schema (Drizzle)            | AI    | ✅     | 13 tables + indexes                   |
| RLS policies                   | AI    | ✅     | applied via migrate                   |
| Class management               | AI    | ✅     | join code K7M2P9                      |
| Student management             | AI    | ✅     | seed 5 hs cho 4A1                     |
| Topic CRUD                     | AI    | ✅     | feeds Cô Mây context                  |
| Parent linking                 | AI    | ✅     | teacher verify                        |
| Chat Cô Mây                    | AI    | ✅     | gemini-2.5-flash, AI SDK v6           |
| System prompt v2.0             | AI    | ✅     | few-shot examples, tighter rules      |
| Rate limiting                  | AI    | ✅     | 30 msg/hr/parent, 429 + UI lock       |
| AI Guard                       | AI    | ✅     | passed/retried/fallback badges        |
| Upload notebook                | AI    | ✅     | 6 ảnh, 10MB, signed URL 30′           |
| Vision (ảnh đề bài trong chat) | AI    | ⏭️     | post-MVP                              |
| Teacher dashboard              | AI    | ✅     | classes + pending links               |
| Review tick                    | AI    | ✅     | good / needs_support + note           |
| Weekly insight cron            | AI    | ✅     | Sun 22:00 UTC                         |
| Weekly report cron             | AI    | ✅     | Sun 23:00 UTC                         |
| Email (Resend)                 | AI    | ✅     | HTML+text, vi-VN                      |
| PWA (Serwist)                  | AI    | ✅     | manifest + install prompt             |
| Landing page                   | AI    | ✅     | polished — banner, chat demo, 3 roles |
| Privacy page                   | AI    | ✅     | /privacy, linked từ footer            |

---

## Bugs / Issues

| #   | Mô tả                                                             | Ngày  | Status                          |
| --- | ----------------------------------------------------------------- | ----- | ------------------------------- |
| 1   | AI SDK v6 `convertToModelMessages` returns Promise — mất `await`  | 26/04 | ✅ fixed                        |
| 2   | shadcn Button không có `asChild` — dùng `buttonVariants()`        | 26/04 | ✅ fixed                        |
| 3   | `useRef().current` trong render — chuyển sang `useMemo`           | 26/04 | ✅ fixed                        |
| 4   | `server-only` trong tsx script — inline createClient cho seed     | 26/04 | ✅ fixed                        |
| 5   | Tailwind v4: `bg-gradient-to-b` → `bg-linear-to-b`                | 26/04 | ✅ fixed                        |
| 6   | A11y: `<select>`/`<input file>` thiếu label                       | 26/04 | ✅ fixed                        |
| 7   | signout không clear cookie trên browser → không vào /login được   | 18/06 | ✅ fixed                        |
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
