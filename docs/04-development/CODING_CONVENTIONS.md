# Coding Conventions — HocCungEm

---

## 1. TypeScript

```jsonc
// tsconfig.json highlights
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": false,  // tắt vì shadcn không tương thích
    "verbatimModuleSyntax": true
  }
}
```

### Quy tắc
- **KHÔNG dùng `any`**. Nếu thực sự cần → `unknown` rồi narrow.
- **KHÔNG dùng `as`** trừ khi parse JSON đã validate.
- Type cho mọi function param + return type công khai.
- `interface` cho object shape công khai, `type` cho union/utility.
- Enum → dùng const object + `as const`, **không** dùng `enum` keyword.

```ts
// ✅ Good
export const Outcome = {
  SolvedSelf: "solved_self",
  Partial: "partial",
  GaveUp: "gave_up",
} as const;
export type Outcome = typeof Outcome[keyof typeof Outcome];

// ❌ Bad
export enum Outcome { SolvedSelf, Partial, GaveUp }
```

---

## 2. React / Next.js

- **Server Component mặc định**. Chỉ thêm `"use client"` khi cần interactivity.
- **Server Actions** cho mutation. Tránh fetch từ client.
- Co-locate logic cùng UI khi đơn giản. Tách `server/` khi phức tạp.
- Form: dùng `useFormStatus`, `useActionState` (React 19).

```tsx
// ✅ Server Component fetch + Client form
import { db } from "@/db";
import { CreateTopicForm } from "./CreateTopicForm";

export default async function Page({ params }: { params: { classId: string } }) {
  const topics = await db.query.studyTopics.findMany({ where: eq(/*...*/) });
  return <CreateTopicForm topics={topics} classId={params.classId} />;
}
```

---

## 3. Naming

| Loại | Convention | Ví dụ |
|---|---|---|
| Component | PascalCase | `ClassTable.tsx` |
| Hook | camelCase + `use` | `useUploadProgress.ts` |
| Server action | camelCase verb | `createTopic` |
| File khác | kebab-case | `db-helpers.ts` |
| DB table | snake_case plural | `study_sessions` |
| DB column | snake_case | `started_at` |
| TS field | camelCase | `startedAt` |
| Const | UPPER_SNAKE | `MAX_UPLOAD_MB` |
| Type/Interface | PascalCase | `WeeklyReport` |

---

## 4. Imports

```ts
// 1. External
import { useState } from "react";
import { z } from "zod";

// 2. Internal absolute
import { db } from "@/db";
import { Button } from "@/components/ui/button";

// 3. Internal relative (cùng folder)
import { ChatBubble } from "./ChatBubble";

// 4. Types
import type { Student } from "@/lib/types";

// 5. Styles
import "./styles.css";
```

ESLint plugin `import/order` enforce.

---

## 5. Validation (Zod)

- **Mọi input từ user** đi qua Zod ở entry point (server action / route handler).
- Schema để ở `src/lib/validators/` nếu reuse.

```ts
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});
```

---

## 6. Error handling

```ts
// ✅ Server action — return Result
return ok(data);
return err("CODE", "user-friendly message");

// ✅ Throw cho lỗi không thể recover (auth)
throw new Error("UNAUTHENTICATED");

// ❌ KHÔNG: catch tất rồi return null
try { ... } catch { return null; }
```

Client component dùng `Result` để render UI khác nhau. Throw được capture bởi `error.tsx` boundary.

---

## 7. Database

- **KHÔNG** SQL raw trừ migration / RLS policies.
- Dùng Drizzle query builder.
- Index mọi cột trong WHERE/JOIN thường xuyên.
- Soft delete với `deleted_at`, query luôn filter.

---

## 8. Comments

- Chỉ comment **WHY**, không comment **WHAT** (code đã nói WHAT).
- TODO format: `// TODO(username): mô tả + ngày`
- JSDoc cho public function của lib/utils.

---

## 9. Testing (sau MVP)

- Unit: Vitest
- E2E: Playwright
- AI prompt: snapshot test với fixed seed

---

## 10. Git commit

Conventional Commits:
```
feat(chat): add Cô Mây system prompt v1.0
fix(rls): allow parent to read linked student
chore(deps): bump drizzle to 0.44
docs(pedagogy): clarify ZPD section
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`.

---

## 11. Linting / Formatting

- **ESLint**: `next/core-web-vitals` + custom rules
- **Prettier**: 2 spaces, 100 col, trailing comma `all`, no semi → có semi (chọn có)
- Pre-commit hook: `lint-staged` chạy lint + format trên staged files

→ Đọc tiếp: [GIT_WORKFLOW.md](GIT_WORKFLOW.md)
