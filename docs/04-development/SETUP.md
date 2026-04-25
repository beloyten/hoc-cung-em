# Setup — HocCungEm

> Hướng dẫn setup máy local để code dự án.

---

## 1. Yêu cầu

| Tool | Version | Cài thế nào |
|---|---|---|
| **Node.js** | v21.7.3 (LTS gần nhất ≥ 20) | `nvm install 21.7.3` |
| **pnpm** | v10+ | `npm i -g pnpm@10` |
| **Git** | bất kỳ | macOS có sẵn |
| **VS Code** | latest | brew/download |
| **Supabase CLI** | latest | `brew install supabase/tap/supabase` |
| **Vercel CLI** | latest | `pnpm i -g vercel` |

### VS Code extensions
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Drizzle ORM (snippets)  *(không cần — Drizzle Studio dùng trình duyệt)*

---

## 2. Clone repo

```bash
cd ~/Documents/Workings/startup
git clone <repo-url> hoc-cung-em
cd hoc-cung-em
pnpm install
```

---

## 3. Env variables

```bash
cp .env.example .env.local
```

Mở `.env.local` và điền theo [ENV_VARIABLES.md](ENV_VARIABLES.md).

---

## 4. Setup Supabase

### Local Supabase (optional, recommend cho dev)
```bash
supabase init
supabase start
```

### Hoặc dùng Cloud (project đã tạo)
- Project: `hoc-cung-em` (Singapore region)
- Đã có `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, keys → xem [ACCOUNTS_CHECKLIST.md](ACCOUNTS_CHECKLIST.md)

### Apply migrations
```bash
pnpm drizzle-kit migrate
```

### Apply RLS policies
```bash
psql "$DATABASE_URL" -f src/db/rls-policies.sql
```

### Seed dev data
```bash
pnpm tsx src/db/seed.ts
```

---

## 5. Run dev

```bash
pnpm dev
```

Mở http://localhost:3000

---

## 6. Tools hữu ích

```bash
# Drizzle Studio (xem DB qua web)
pnpm drizzle-kit studio

# Tạo migration
pnpm drizzle-kit generate

# Lint
pnpm lint

# Type check
pnpm typecheck

# Format
pnpm format
```

---

## 7. Troubleshooting

| Lỗi | Fix |
|---|---|
| `Cannot find module '@/...'` | Restart TS server: Cmd+Shift+P → "TypeScript: Restart TS Server" |
| `Supabase auth: invalid JWT` | Check `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` đúng project chưa |
| Drizzle migrate báo connection refused | Test `psql "$DATABASE_URL"` trước |
| Gemini "PERMISSION_DENIED" | Check API key có enable Gemini API ở Google AI Studio |
| Port 3000 bị chiếm | `pnpm dev -- -p 3001` |

→ Đọc tiếp: [ACCOUNTS_CHECKLIST.md](ACCOUNTS_CHECKLIST.md)
