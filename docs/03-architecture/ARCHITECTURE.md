# Kiến trúc tổng thể — HocCungEm

## 1. Sơ đồ kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                        NGƯỜI DÙNG                               │
│   👨‍👩‍👧 Phụ huynh (mobile PWA)    👩‍🏫 Giáo viên (web)              │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       VERCEL EDGE                               │
│   • CDN tĩnh (PWA assets)                                       │
│   • Edge functions (auth check, rate limit)                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS 15 (App Router) — 1 deployment            │
│                                                                 │
│  ┌─────────────────┐   ┌──────────────────┐  ┌──────────────┐  │
│  │ Server          │   │ Server Actions   │  │ Route        │  │
│  │ Components      │   │ (mutations)      │  │ Handlers     │  │
│  │ (RSC)           │   │                  │  │ (API)        │  │
│  └─────────────────┘   └──────────────────┘  └──────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Client Components (chat, upload, charts)                 │  │
│  │ TanStack Query · React Hook Form · Zod                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────┬──────────────────┬───────────────────┬───────────────────┘
      │                  │                   │
      ▼                  ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌────────────────────┐
│  SUPABASE    │  │  GEMINI 2.0  │  │  RESEND            │
│  (Singapore) │  │  Flash API   │  │  (email reports)   │
│              │  │              │  │                    │
│  • Postgres  │  │  • Chat      │  │                    │
│  • Auth      │  │  • Vision    │  │                    │
│  • Storage   │  │              │  │                    │
│  • RLS       │  │              │  │                    │
└──────────────┘  └──────────────┘  └────────────────────┘
                       │
                       ▼
                ┌──────────────┐
                │ AI GUARD     │  ← hậu kiểm output
                │ (in-app)     │
                └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   OBSERVABILITY                                 │
│   • Sentry (errors)                                             │
│   • Vercel Analytics (web vitals + traffic)                     │
│   • PostHog (optional, post-MVP)                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Các luồng chính (data flows)

### Flow A — Phụ huynh chat với AI Socratic
```
[PH chụp ảnh đề + gõ câu hỏi]
    ↓ (POST /api/chat — Route Handler)
[Server: validate Zod + check RLS]
    ↓
[Upload ảnh tạm sang Supabase Storage]
    ↓
[Gọi Gemini Vision API (streaming)]
    ↓
[AI Guard hậu kiểm chunks]
    ↓ (stream về client)
[PH thấy AI trả lời từng từ]
    ↓
[Lưu phiên chat vào DB: chat_sessions, chat_messages]
```

### Flow B — Phụ huynh upload ảnh vở
```
[PH chọn ảnh vở + chủ đề + ngày]
    ↓ (Server Action)
[Validate file type, size, MIME]
    ↓
[Upload lên Supabase Storage (bucket: study-notebooks)]
    ↓
[Insert row vào notebook_uploads]
    ↓
[Show success + thumbnail]
```

### Flow C — Giáo viên xem dashboard
```
[GV mở /teacher/dashboard]
    ↓ (Server Component)
[Drizzle query: lấy stats lớp tuần này]
    ↓
[Render dashboard SSR (fast first paint)]
    ↓
[Client Component: charts (Recharts) hydrate]
```

### Flow D — Insight engine (weekly cron)
```
[Vercel Cron triggers Sunday 20:00]
    ↓ (POST /api/cron/weekly-insights)
[For each active class:]
    ↓
[Drizzle: lấy log AI + ảnh upload tuần qua]
    ↓
[Gemini: tổng hợp top 3 lỗi sai + gợi ý điều chỉnh]
    ↓
[Insert insights vào DB]
    ↓
[For each parent:]
    ↓
[Gemini: sinh báo cáo tuần cá nhân hóa]
    ↓
[Resend: gửi email + lưu in-app]
```

---

## 3. Tách layer

| Layer | Trách nhiệm | Tech |
|---|---|---|
| **Presentation** | UI, render, interaction | React (RSC + Client) + shadcn/ui + Tailwind |
| **Application** | Business logic, orchestration | Server Actions + Route Handlers |
| **Domain** | Entities, rules, validation | TypeScript types + Zod schemas |
| **Infrastructure** | DB access, external APIs, auth | Drizzle, Supabase JS, Gemini SDK, Resend SDK |

→ Code organized theo layer trong folder `src/` (xem [FOLDER_STRUCTURE.md](../04-development/FOLDER_STRUCTURE.md)).

---

## 4. Các quyết định kiến trúc quan trọng (ADRs ngắn)

### ADR-001: Chọn Next.js App Router thay vì Pages Router
- **Quyết định:** Dùng App Router
- **Lý do:** Server Actions giảm boilerplate, RSC tối ưu performance, hỗ trợ streaming AI tốt hơn
- **Trade-off:** Learning curve nhẹ với dev quen Pages

### ADR-002: Drizzle ORM cho data layer + Supabase JS cho auth/storage
- **Quyết định:** Tách rõ — Drizzle làm CRUD, Supabase JS làm auth + storage
- **Lý do:** Type-safety của Drizzle + tiện lợi của Supabase Auth/Storage
- **Trade-off:** 2 client cùng connect 1 DB (Drizzle dùng `postgres-js`, Supabase JS dùng REST)

### ADR-003: PWA thay vì Native App
- **Quyết định:** PWA only cho MVP
- **Lý do:** 1 codebase, không qua App Store, install dễ
- **Trade-off:** Không truy cập được mọi API native (chấp nhận được cho usecase)

### ADR-004: Single Next.js deployment
- **Quyết định:** Backend + frontend cùng 1 Next.js app
- **Lý do:** Đơn giản, deploy 1-click, server actions invoke trực tiếp
- **Trade-off:** Coupling — sau scale có thể tách microservices

### ADR-005: Gemini 2.0 Flash là model chính
- **Quyết định:** Gemini làm model mặc định, GPT-4o-mini làm fallback (optional)
- **Lý do:** Free tier hào phóng, vision tốt cho chữ viết tay VN, tiếng Việt OK
- **Trade-off:** Phụ thuộc Google; mitigate bằng abstraction qua Vercel AI SDK

### ADR-006: Server-side AI Guard
- **Quyết định:** AI Guard chạy server-side, mọi response qua nó trước khi stream về client
- **Lý do:** Không tin client-side validation; bảo đảm Socratic principle
- **Trade-off:** Tăng nhẹ latency (chấp nhận được)

### ADR-007: RLS bật mặc định
- **Quyết định:** Tất cả bảng có dữ liệu HS đều có RLS policies
- **Lý do:** Defense-in-depth; lỗi code không leak data
- **Trade-off:** Phải dùng Supabase JWT context; Drizzle gọi qua connection có user context

### ADR-008: Soft delete only
- **Quyết định:** Không xóa cứng dữ liệu HS (chỉ `deleted_at`)
- **Lý do:** Audit trail, recovery, tuân thủ Luật Trẻ em
- **Trade-off:** DB lớn dần, cần periodic cleanup sau MVP

---

## 5. Quy ước môi trường

| Env | Domain | DB | Mục đích |
|---|---|---|---|
| **dev** | localhost:3000 | Supabase project (cùng) hoặc local | Phát triển |
| **preview** | `[branch]-hoccungem.vercel.app` | Supabase project (cùng) | Review PR |
| **production** | `hoccungem.vercel.app` | Supabase project (cùng) | Pilot thật |

> **Note MVP:** Dùng 1 Supabase project cho cả 3 env (đơn giản, đủ pilot). Sau pilot tách production riêng.

---

## 6. Scaling considerations (post-MVP)

Không xử lý trong MVP, nhưng cần biết:

| Vấn đề | Khi nào | Giải pháp |
|---|---|---|
| Gemini rate limit | > 100 PH active | Upgrade paid tier hoặc multi-key rotation |
| Supabase free tier | > 500MB DB | Upgrade Pro $25/tháng |
| Cold start Vercel | > 1k MAU | Upgrade Pro |
| Cron precision | Cần real-time | Upstash QStash |
| Image storage | > 1GB | Move to Cloudinary / R2 |

→ Đọc tiếp: [TECH_STACK.md](TECH_STACK.md)
