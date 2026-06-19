# Folder Structure — HocCungEm

> Cập nhật: 19/06/2026 (sau Phase 1–5)

```
hoc-cung-em/
├── docs/                             ← documentation
├── public/
│   └── icons/                        ← PWA icons (192, 512)
│
├── scripts/
│   └── setup-storage.ts              ← Supabase storage bucket setup
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── verify/page.tsx
│   │   │   └── auth/[...supabase]/route.ts
│   │   │
│   │   ├── (teacher)/teacher/
│   │   │   ├── dashboard/page.tsx    ← stats + TeacherQueryWidget (Phase 4)
│   │   │   ├── classes/new/          ← create class (grade 1–5, multi-subject)
│   │   │   ├── topics/               ← CRUD topics + TemplatePicker (Phase 1)
│   │   │   │   ├── page.tsx
│   │   │   │   ├── actions.ts
│   │   │   │   ├── topic-create-form.tsx
│   │   │   │   └── template-picker.tsx
│   │   │   ├── insights/page.tsx     ← weekly insights + suggestedFocus (Phase 5)
│   │   │   ├── sessions/             ← xem chat log của HS
│   │   │   ├── parents/              ← duyệt liên kết PH-HS
│   │   │   └── uploads/              ← review ảnh vở
│   │   │
│   │   ├── (parent)/parent/
│   │   │   ├── home/page.tsx         ← overview + ChildSummaryWidget (Phase 4)
│   │   │   ├── chat/
│   │   │   │   ├── page.tsx          ← chọn topic / tạo session
│   │   │   │   └── [chatId]/page.tsx ← ChatPanel với image upload (Phase 3)
│   │   │   ├── link/                 ← liên kết với lớp
│   │   │   ├── reports/              ← xem báo cáo tuần
│   │   │   └── upload/               ← upload ảnh vở (flow riêng)
│   │   │
│   │   ├── api/
│   │   │   ├── chat/route.ts                ← streaming chat (streamText + multimodal)
│   │   │   ├── chat-image-upload/route.ts   ← upload ảnh đề bài (Phase 3)
│   │   │   ├── teacher-query/route.ts        ← analytic AI cho GV (Phase 4)
│   │   │   ├── parent-child-summary/route.ts ← AI tóm tắt học của con (Phase 4)
│   │   │   ├── topic-templates/route.ts      ← GET templates by grade+subject (Phase 1)
│   │   │   ├── upload-url/route.ts           ← signed URL cho notebook upload
│   │   │   └── cron/
│   │   │       ├── weekly-insights/route.ts  ← cron Monday 7am ICT
│   │   │       └── weekly-reports/route.ts
│   │   │
│   │   ├── onboarding/               ← role-based onboarding flow
│   │   ├── privacy/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx                  ← landing page + AnimatedChatDemo (Phase 3)
│   │   ├── globals.css
│   │   ├── manifest.ts               ← PWA manifest
│   │   └── sw.ts                     ← Serwist service worker
│   │
│   ├── components/
│   │   ├── ui/                       ← shadcn/ui components
│   │   ├── chat/
│   │   │   └── chat-panel.tsx        ← useChat + image upload + framer-motion (Phase 3)
│   │   ├── teacher/
│   │   │   └── teacher-query-widget.tsx ← AI query widget (Phase 4)
│   │   ├── parent/
│   │   │   └── child-summary-widget.tsx ← AI child summary (Phase 4)
│   │   ├── shared/
│   │   │   └── animated-chat-demo.tsx   ← framer-motion demo (Phase 3)
│   │   ├── pwa/
│   │   │   └── install-prompt.tsx
│   │   ├── page-layout.tsx           ← PageContainer, PageHeader, SectionHeader, ...
│   │   └── sign-out-button.tsx
│   │
│   ├── server/
│   │   ├── auth.ts                   ← requireTeacher, requireParent, requireUser
│   │   ├── ai/
│   │   │   ├── client.ts             ← google(), FLASH constant
│   │   │   ├── prompts.ts            ← systemPromptV1 (reference), systemPromptV2 (v3.0)
│   │   │   ├── guard.ts              ← aiGuard(), FALLBACK_RESPONSE
│   │   │   └── sessions.ts           ← startStudySession, loadChatForParent
│   │   ├── cron/
│   │   │   ├── weekly-insights.ts    ← runWeeklyInsights() với suggestedFocus (Phase 5)
│   │   │   ├── weekly-reports.ts
│   │   │   └── week.ts               ← previousWeekStartICT, weekRangeUTC
│   │   ├── email/
│   │   │   └── resend.ts
│   │   └── storage/
│   │       └── notebook.ts
│   │
│   ├── db/
│   │   ├── index.ts                  ← Drizzle instance
│   │   ├── schema/
│   │   │   ├── index.ts              ← barrel exports + subjectEnum re-export
│   │   │   ├── teachers.ts
│   │   │   ├── parents.ts
│   │   │   ├── classes.ts            ← grade, subject
│   │   │   ├── students.ts
│   │   │   ├── parent-students.ts
│   │   │   ├── study-topics.ts       ← subjectEnum, subject field
│   │   │   ├── study-sessions.ts
│   │   │   ├── ai-chats.ts
│   │   │   ├── ai-messages.ts
│   │   │   ├── notebook-uploads.ts
│   │   │   ├── teacher-reviews.ts
│   │   │   ├── weekly-insights.ts    ← suggestedFocus text column (Phase 5)
│   │   │   ├── weekly-reports.ts
│   │   │   ├── audit-logs.ts
│   │   │   └── topic-templates.ts    ← Phase 1
│   │   ├── migrations/
│   │   │   ├── 0001_…               ← initial schema
│   │   │   ├── 0002_add_topic_templates.sql
│   │   │   ├── 0003_expand_subject_enum.sql
│   │   │   └── 0004_add_suggested_focus.sql
│   │   ├── rls-policies.sql          ← SQL source of truth cho RLS
│   │   ├── apply-rls.ts              ← pnpm db:rls
│   │   ├── seed.ts                   ← dev seed data
│   │   └── seed-templates.ts         ← 15 Math + 10 Vietnamese Grade 4 templates
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             ← browser Supabase client
│   │   │   ├── server.ts             ← server Supabase client (cookies)
│   │   │   ├── admin.ts              ← service role client, adminSupabase()
│   │   │   └── middleware.ts         ← refreshSession in middleware
│   │   ├── validators/               ← Zod schemas shared
│   │   ├── types/
│   │   │   └── result.ts             ← Result<T>, ok(), err() pattern
│   │   ├── hooks/                    ← React hooks
│   │   ├── constants.ts              ← APP_NAME, AI_PERSONA_NAME, NOTEBOOK_BUCKET
│   │   ├── dates.ts                  ← date helpers
│   │   ├── env.ts                    ← validated env vars
│   │   └── utils.ts                  ← cn() và misc
│   │
│   ├── proxy.ts                      ← Vercel proxy config
│   └── instrumentation.ts            ← Sentry init
│
├── AGENTS.md / CLAUDE.md             ← Next.js version notice cho AI agents
├── components.json                   ← shadcn config
├── drizzle.config.ts
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── sentry.client.config.ts
├── sentry.edge.config.ts
├── sentry.server.config.ts
├── tsconfig.json
└── vercel.json                       ← cron schedule + edge config
```

---

## Quy ước

### Route groups

- `(auth)` — public pages (login, verify)
- `(teacher)` — requires `teacher` role
- `(parent)` — requires `parent` role

### File naming

- Pages/layouts: `page.tsx`, `layout.tsx` (Next.js convention)
- Components: **kebab-case** (`chat-panel.tsx`, `teacher-query-widget.tsx`)
- Server actions: co-located `actions.ts` trong route folder
- API routes: `route.ts` theo Next.js App Router

### Key patterns

- `Result<T>` = `{ ok: true; data: T } | { ok: false; error: AppError }` — không throw ở business logic
- `requireTeacher()` / `requireParent()` — throw `AuthError` nếu không đúng role
- `adminSupabase()` — service role client, chỉ dùng trên server
- Module-level `Map<chatId, string>` cho `pendingImageUrls` — tránh React ref trong useMemo

### Imports

- Path alias `@/*` → `src/*`
- `import "server-only"` ở đầu mọi file server-only (cron, sessions, ai)

→ Đọc tiếp: [CODING_CONVENTIONS.md](CODING_CONVENTIONS.md)

```
hoc-cung-em/
├── docs/                             ← (đang đọc)
├── public/
│   ├── icons/                        ← PWA icons (192, 512)
│   ├── manifest.json
│   └── og-image.png
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register-teacher/page.tsx
│   │   │   └── register-parent/page.tsx
│   │   ├── (teacher)/
│   │   │   ├── teacher/
│   │   │   │   ├── layout.tsx       ← role guard
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── classes/[id]/page.tsx
│   │   │   │   ├── students/[id]/page.tsx
│   │   │   │   ├── topics/page.tsx
│   │   │   │   ├── insights/page.tsx
│   │   │   │   └── reviews/page.tsx
│   │   ├── (parent)/
│   │   │   ├── parent/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── home/page.tsx
│   │   │   │   ├── chat/[sessionId]/page.tsx
│   │   │   │   ├── upload/page.tsx
│   │   │   │   ├── reports/page.tsx
│   │   │   │   └── settings/data/page.tsx
│   │   ├── api/
│   │   │   ├── chat/route.ts
│   │   │   ├── upload-url/route.ts
│   │   │   └── cron/
│   │   │       ├── weekly-insights/route.ts
│   │   │       └── weekly-reports/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx                  ← landing page
│   │   ├── privacy/page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                       ← shadcn copy-pasted
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ImageInput.tsx
│   │   ├── teacher/
│   │   │   ├── ClassTable.tsx
│   │   │   ├── InsightCard.tsx
│   │   │   └── ReviewQueue.tsx
│   │   ├── parent/
│   │   │   ├── StudentSelector.tsx
│   │   │   ├── UploadCamera.tsx
│   │   │   └── WeeklyReport.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── ConsentBanner.tsx
│   │
│   ├── server/
│   │   ├── actions/                  ← Server Actions
│   │   ├── ai/
│   │   │   ├── client.ts
│   │   │   ├── prompts.ts
│   │   │   ├── guard.ts
│   │   │   ├── insights.ts
│   │   │   └── reports.ts
│   │   ├── auth.ts
│   │   ├── db-helpers.ts
│   │   └── email/
│   │       ├── client.ts
│   │       └── templates/
│   │
│   ├── db/
│   │   ├── index.ts                  ← Drizzle instance
│   │   ├── schema/
│   │   │   ├── teachers.ts
│   │   │   ├── parents.ts
│   │   │   ├── classes.ts
│   │   │   ├── students.ts
│   │   │   └── ... (xem DATABASE_SCHEMA.md)
│   │   ├── migrations/
│   │   ├── rls-policies.sql
│   │   └── seed.ts
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             ← browser client
│   │   │   ├── server.ts             ← server client
│   │   │   └── middleware.ts
│   │   ├── validators/               ← Zod schemas
│   │   ├── utils/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── constants.ts
│   │   └── env.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── middleware.ts                 ← auth + locale
│   └── instrumentation.ts            ← Sentry init
│
├── .env.example
├── .env.local                        ← gitignored
├── .gitignore
├── .prettierrc
├── components.json                   ← shadcn config
├── drizzle.config.ts
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── sentry.*.config.ts
├── serwist.config.ts                 ← PWA
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json                       ← cron schedule
```

---

## Quy ước

### Folder

- `(auth)`, `(teacher)`, `(parent)` — Route groups (không tạo URL segment)
- `__tests__/` — co-located test
- Tên file/folder dùng **kebab-case** trừ component dùng **PascalCase**

### Component

- 1 component = 1 file
- Export default cho component chính
- Co-locate types/hooks nhỏ cùng file

### Imports

- Path alias `@/*` → `src/*`
- Order: external → internal → types → styles

→ Đọc tiếp: [CODING_CONVENTIONS.md](CODING_CONVENTIONS.md)
