# API Design — HocCungEm

> Next.js App Router: ưu tiên **Server Actions** cho mutation, **Route Handlers** cho cái cần streaming/webhook, **Server Components** cho fetch read-only.

---

## 1. Nguyên tắc

1. **Server Actions** cho 95% mutation (form submit, button click)
2. **Route Handlers** chỉ khi cần:
   - Streaming response (AI chat)
   - Webhook nhận từ ngoài
   - Cron endpoint
   - File upload chunked
3. **Validation đầu vào bằng Zod** ở mọi entry point
4. **Auth check ở mọi server action** (helper `requireUser()`)
5. **Trả về typed result**: `{ ok: true, data } | { ok: false, error }`

---

## 2. Cấu trúc folder

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # POST — AI streaming
│   │   ├── upload-url/route.ts        # POST — signed URL cho ảnh
│   │   ├── cron/
│   │   │   ├── weekly-insights/route.ts
│   │   │   └── weekly-reports/route.ts
│   │   └── webhooks/
│   │       └── resend/route.ts        # email open tracking
│   ├── (teacher)/...
│   ├── (parent)/...
│   └── ...
├── server/
│   ├── actions/
│   │   ├── classes.ts
│   │   ├── students.ts
│   │   ├── topics.ts
│   │   ├── sessions.ts
│   │   ├── uploads.ts
│   │   └── reviews.ts
│   ├── auth.ts                        # requireUser, requireTeacher, requireParent
│   ├── db-helpers.ts
│   └── ai/
│       ├── chat.ts
│       ├── guard.ts
│       └── prompts.ts
└── lib/
    ├── validators/                    # Zod schemas
    └── types/
```

---

## 3. Auth helpers

```ts
// src/server/auth.ts
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { teachers, parents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function requireTeacher() {
  const user = await requireUser();
  const [teacher] = await db.select().from(teachers).where(eq(teachers.authUserId, user.id));
  if (!teacher) throw new Error("NOT_A_TEACHER");
  return { user, teacher };
}

export async function requireParent() {
  const user = await requireUser();
  const [parent] = await db.select().from(parents).where(eq(parents.authUserId, user.id));
  if (!parent) throw new Error("NOT_A_PARENT");
  return { user, parent };
}
```

---

## 4. Result type chuẩn

```ts
// src/lib/types/result.ts
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const err = (code: string, message: string): Result<never> =>
  ({ ok: false, error: { code, message } });
```

---

## 5. Server Actions — danh sách

### `classes.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `createClass` | `{ name, grade }` | `{ classId, joinCode }` | Teacher |
| `regenerateJoinCode` | `{ classId }` | `{ joinCode }` | Teacher |
| `joinClassAsParent` | `{ joinCode, studentId? }` | `{ classId }` | Parent |

### `students.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `addStudent` | `{ classId, fullName, code? }` | `{ studentId }` | Teacher |
| `bulkImportStudents` | `{ classId, csv: string }` | `{ count }` | Teacher |
| `linkParentToStudent` | `{ studentId, relationship }` | `{ linkId }` | Parent |
| `verifyParentLink` | `{ linkId }` | `void` | Teacher |
| `softDeleteStudent` | `{ studentId }` | `void` | Teacher |

### `topics.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `createTopic` | `{ classId, title, weekNumber, dates, context }` | `{ topicId }` | Teacher |
| `updateTopic` | `{ topicId, ...patch }` | `void` | Teacher |
| `listClassTopics` | `{ classId }` | `Topic[]` | Teacher / Parent |

### `sessions.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `startSession` | `{ studentId, topicId? }` | `{ sessionId }` | Parent |
| `endSession` | `{ sessionId, outcome }` | `void` | Parent |
| `listStudentSessions` | `{ studentId, range? }` | `Session[]` | Teacher / Parent |

### `uploads.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `getUploadSignedUrl` | `{ studentId, filename }` | `{ url, path }` | Parent |
| `confirmUpload` | `{ studentId, paths[], topicId?, note? }` | `{ uploadId }` | Parent |
| `listClassUploads` | `{ classId, range? }` | `Upload[]` | Teacher |

### `reviews.ts`
| Action | Input | Output | Auth |
|---|---|---|---|
| `tickReview` | `{ uploadId, rating, note? }` | `void` | Teacher |

---

## 6. Mẫu code Server Action

```ts
// src/server/actions/topics.ts
"use server";

import { z } from "zod";
import { db } from "@/db";
import { studyTopics } from "@/db/schema";
import { requireTeacher } from "@/server/auth";
import { ok, err } from "@/lib/types/result";
import { revalidatePath } from "next/cache";

const CreateTopicInput = z.object({
  classId: z.string().uuid(),
  title: z.string().min(3).max(200),
  weekNumber: z.number().int().min(1).max(52),
  startDate: z.string().date(),
  endDate: z.string().date(),
  context: z.string().max(2000).optional(),
});

export async function createTopic(raw: unknown) {
  try {
    const input = CreateTopicInput.parse(raw);
    const { teacher } = await requireTeacher();

    // Verify class ownership (RLS sẽ chặn nhưng explicit check rõ ràng hơn)
    // ... (db query)

    const [row] = await db.insert(studyTopics).values(input).returning();

    revalidatePath(`/teacher/classes/${input.classId}`);
    return ok({ topicId: row.id });
  } catch (e) {
    if (e instanceof z.ZodError) return err("VALIDATION", e.message);
    return err("INTERNAL", "Không tạo được chủ đề");
  }
}
```

---

## 7. Route Handler — AI Chat (streaming)

```ts
// src/app/api/chat/route.ts
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { requireParent } from "@/server/auth";
import { systemPromptV1 } from "@/server/ai/prompts";
import { aiGuard } from "@/server/ai/guard";

export const runtime = "nodejs";  // không edge — cần DB

export async function POST(req: Request) {
  try {
    const { parent } = await requireParent();
    const { messages, sessionId, studentId } = await req.json();

    // Persist user message + start chat record (để có chatId)
    // ...

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: systemPromptV1(),
      messages,
      onFinish: async ({ text, usage }) => {
        const guarded = aiGuard(text);
        // Persist assistant message với guard_status
        // Update tokens
      },
    });

    return result.toDataStreamResponse();
  } catch (e) {
    return new Response("Unauthorized", { status: 401 });
  }
}
```

---

## 8. Route Handler — Cron

```ts
// src/app/api/cron/weekly-insights/route.ts
// Vercel Cron: schedule trong vercel.json — "0 6 * * 1" (6h sáng thứ 2)

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Loop qua các lớp, generate insight với service role
  // ...

  return Response.json({ ok: true, processed: N });
}
```

`vercel.json`:
```json
{
  "crons": [
    { "path": "/api/cron/weekly-insights", "schedule": "0 6 * * 1" },
    { "path": "/api/cron/weekly-reports", "schedule": "0 7 * * 1" }
  ]
}
```

---

## 9. Error codes (chuẩn)

| Code | Ý nghĩa | HTTP equivalent |
|---|---|---|
| `UNAUTHENTICATED` | Chưa đăng nhập | 401 |
| `FORBIDDEN` | Không có quyền | 403 |
| `NOT_FOUND` | Không tìm thấy | 404 |
| `VALIDATION` | Sai input | 400 |
| `RATE_LIMITED` | Quá nhiều request | 429 |
| `AI_GUARD_FALLBACK` | AI bị guard chặn 3 lần | — |
| `INTERNAL` | Lỗi không rõ | 500 |

---

## 10. Rate limiting (MVP)

- **AI chat:** giới hạn ở app-level — 30 messages / parent / hour (đếm trong DB hoặc memory)
- **Upload ảnh:** 50 ảnh / parent / day
- **Sau MVP:** dùng Upstash Redis cho rate limiting chuẩn

→ Đọc tiếp: [AI_INTEGRATION.md](AI_INTEGRATION.md)
