# Folder Structure — HocCungEm

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
