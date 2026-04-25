# Tech Stack — HocCungEm

> Stack được chọn theo nguyên tắc: **pragmatic, type-safe, deploy nhanh, dev nhanh.** Không đuổi theo hype.

---

## 1. Tóm tắt nhanh

| Layer | Tech | Version | Lý do tóm tắt |
|---|---|---|---|
| Runtime | Node.js | 21+ | Modern, hỗ trợ ESM |
| Package manager | pnpm | 10+ | Nhanh hơn npm, disk-efficient |
| Framework | Next.js | 15 (App Router) | Fullstack, RSC, Server Actions |
| Language | TypeScript | 5.5+ strict | Type-safe |
| Styling | Tailwind CSS | 4 | Utility-first, fast iter |
| UI Components | shadcn/ui | latest | Copy-paste, own the code |
| Forms | React Hook Form + Zod | latest | Performant, type-safe |
| Data fetching client | TanStack Query | 5 | Cache, retry, mutation |
| Charts | Recharts | latest | Composable, đủ cho dashboard |
| ORM | Drizzle | latest | Type-safe, SQL-like |
| DB | PostgreSQL | 15 (qua Supabase) | Mature, RLS, JSON support |
| Auth | Supabase Auth | latest | Magic link, OTP, RLS integration |
| Storage | Supabase Storage | latest | S3-compatible, RLS |
| AI | Google Gemini 2.0 Flash | latest | Vision + chat, rẻ |
| AI SDK | Vercel AI SDK | latest | Streaming, provider-agnostic |
| Email | Resend | latest | Modern API, tốt nhất 2026 |
| PWA | Serwist | latest | Kế nhiệm next-pwa, App Router native |
| Hosting (FE+BE) | Vercel | — | 1-click deploy, Edge network |
| Hosting (DB) | Supabase | Free tier | Đủ pilot |
| Errors | Sentry | latest | Stack trace + source map |
| Analytics | Vercel Analytics | — | Built-in, miễn phí |
| Lint | ESLint + typescript-eslint | latest | Code quality |
| Format | Prettier | latest | Auto format |
| Git hooks | Husky + lint-staged | latest | Pre-commit checks |

---

## 2. Frontend stack chi tiết

### 2.1 Next.js 15 (App Router)
**Vì sao:**
- **App Router** ổn định từ 2024, là default cho mọi project mới
- **Server Components** giảm JS client, tốt cho mobile (PH dùng 4G)
- **Server Actions** = thay form submit truyền thống, ít boilerplate
- **Streaming** AI response native support
- **Route Handlers** cho API integrations (cron, webhook)
- **Image Optimization** built-in (cho ảnh vở)

**Khác biệt với Nuxt (bạn quen):**
| Nuxt | Next App Router |
|---|---|
| `pages/` | `app/` |
| `defineEventHandler` | `route.ts` |
| `useFetch` | `fetch()` trong RSC, `useQuery` trong Client |
| `<script setup>` | function component React |
| `useState` Pinia | Zustand / `useState` |
| Middleware Nuxt | `middleware.ts` |

### 2.2 TypeScript strict mode
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### 2.3 Tailwind CSS 4
- v4 ra 2024, faster build, CSS-first config
- Tailwind Variants để compose biến thể
- Dark mode optional (MVP chỉ light mode)

### 2.4 shadcn/ui
- Components: `Button`, `Card`, `Dialog`, `Form`, `Input`, `Sheet` (mobile drawer), `Toast`, `Tabs`, `Avatar`, `Badge`, `Chart`
- Cài thêm khi cần: `pnpm dlx shadcn@latest add [component]`
- Tự sở hữu code → custom dễ

### 2.5 React Hook Form + Zod
```ts
const schema = z.object({
  childName: z.string().min(1),
  classCode: z.string().length(6),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

### 2.6 TanStack Query
- Cache infinite scroll chat history
- Optimistic updates cho upload ảnh vở
- Retry logic cho AI calls

### 2.7 Recharts
- BarChart cho top lỗi sai
- LineChart cho tiến trình tuần
- Heatmap cho kỹ năng (custom với grid Tailwind)

### 2.8 Serwist (PWA)
- `next-pwa` không hỗ trợ App Router tốt → dùng Serwist (kế nhiệm chính thức)
- Manifest, service worker, offline cache

---

## 3. Backend stack chi tiết

### 3.1 Server Actions vs Route Handlers — khi nào dùng cái nào?

| Scenario | Server Action | Route Handler |
|---|---|---|
| Form submit từ client component | ✅ | — |
| Mutation đơn giản (insert/update DB) | ✅ | — |
| Streaming AI response | — | ✅ (cần Response stream) |
| Webhook từ Resend/Stripe | — | ✅ |
| Cron job (Vercel Cron) | — | ✅ |
| Public API cho mobile | — | ✅ |

### 3.2 Drizzle ORM

**Pattern:**
```ts
// schema/students.ts
export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  classId: uuid("class_id").references(() => classes.id),
  fullName: text("full_name").notNull(),
  ...
});

// Query
const list = await db
  .select()
  .from(students)
  .where(eq(students.classId, classId));
```

**Migration flow:**
```bash
pnpm drizzle-kit generate   # tạo SQL migration
pnpm drizzle-kit migrate    # apply lên DB
pnpm drizzle-kit studio     # GUI xem/edit
```

### 3.3 Supabase JS Client

**Dùng cho:**
- Auth: `supabase.auth.signInWithOtp(...)`
- Storage: `supabase.storage.from("notebooks").upload(...)`
- Realtime (nếu cần): `supabase.channel(...)`

**KHÔNG dùng cho:** CRUD DB (đã có Drizzle).

### 3.4 Vercel AI SDK + Gemini

```ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const result = streamText({
  model: google('gemini-2.0-flash'),
  system: SOCRATIC_SYSTEM_PROMPT,
  messages,
  experimental_telemetry: { isEnabled: true },
});

return result.toDataStreamResponse();
```

### 3.5 Resend
```ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'HocCungEm <bao-cao@hoccungem.vercel.app>',
  to: parent.email,
  subject: `Báo cáo tuần ${weekNumber} của ${child.name}`,
  react: WeeklyReportEmail({ ... }),
});
```

---

## 4. Hạ tầng

### 4.1 Vercel
- **Plan:** Hobby (Free)
- **Quotas:** 100GB bandwidth, unlimited deployments, 6000 build minutes
- **Cron:** Vercel Cron (built-in, dùng được trên Hobby với hạn chế)
- **Edge functions:** Auth check ở middleware.ts

### 4.2 Supabase
- **Plan:** Free
- **Quotas:** 500MB DB, 1GB storage, 50k MAU, 5GB egress
- **Region:** Singapore (gần VN nhất)

### 4.3 Google AI Studio (Gemini)
- **Plan:** Free tier
- **Quotas:** 15 RPM, 1M TPM, 1500 req/ngày cho Gemini 2.0 Flash
- **Backup:** Có thể tạo nhiều API key để rotate nếu vượt

### 4.4 Resend
- **Plan:** Free
- **Quotas:** 3000 email/tháng, 100/ngày, 1 domain verified
- **MVP:** Dùng default `onboarding@resend.dev` (không cần verify domain)

### 4.5 Sentry
- **Plan:** Developer (Free)
- **Quotas:** 5k errors/tháng, 10k performance events

---

## 5. Dev tools

### 5.1 VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- PostgreSQL (Microsoft)
- Error Lens
- GitHub Copilot

### 5.2 CLI tools
```bash
node -v       # >= 21
pnpm -v       # >= 10
supabase -v   # CLI
vercel -v     # CLI
```

### 5.3 Drizzle Studio
- Web UI xem/edit DB local
- Chạy: `pnpm drizzle-kit studio`
- Mở: https://local.drizzle.studio

---

## 6. Bảng so sánh — tại sao không chọn cái khác?

| Đã cân nhắc | Không chọn vì |
|---|---|
| Vue + Nuxt | Bạn quen, nhưng AI ecosystem (Vercel AI SDK, shadcn) thiên React mạnh hơn |
| SvelteKit | Bundle nhỏ hơn nhưng ecosystem AI/UI nhỏ hơn nhiều |
| Remix | Tốt nhưng Vercel + Next có integration sâu hơn |
| Express/Fastify riêng | Phải tự setup auth, deploy 2 nơi → tốn thời gian |
| Prisma | Heavier, slower than Drizzle, không phải SQL-like |
| Firebase | NoSQL khó query analytics |
| AWS Amplify | Phức tạp setup, chi phí khó dự đoán |
| OpenAI GPT-4o | Đắt hơn, free tier hạn chế |
| Claude | Đắt hơn, không có free tier dùng được |

---

## 7. Versions cụ thể (lock khi setup)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "drizzle-orm": "^0.36.0",
    "postgres": "^3.4.0",
    "ai": "^4.0.0",
    "@ai-sdk/google": "^1.0.0",
    "resend": "^4.0.0",
    "@sentry/nextjs": "^8.0.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@tanstack/react-query": "^5.59.0",
    "recharts": "^2.13.0",
    "@serwist/next": "^9.0.0",
    "tailwindcss": "^4.0.0",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",
    "drizzle-kit": "^0.27.0",
    "prettier": "^3.3.0",
    "eslint": "^9.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

→ Đọc tiếp: [DATA_MODEL.md](DATA_MODEL.md)
