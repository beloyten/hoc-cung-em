# AI Integration — HocCungEm

> Sử dụng **Vercel AI SDK v4** (package `ai`) + **@ai-sdk/google ^3.x** + **Google Gemini 2.5 Flash**. Tất cả AI logic ở `src/server/ai/`.

---

## 1. Tổng quan

| Use case               | API                         | Mode                                         | Streaming |
| ---------------------- | --------------------------- | -------------------------------------------- | --------- |
| Chat Socratic với HS   | `/api/chat`                 | `streamText` → `toUIMessageStreamResponse()` | ✅        |
| Chat image upload      | `/api/chat-image-upload`    | multipart → Supabase Storage → signed URL    | —         |
| Teacher analytic query | `/api/teacher-query`        | `streamText` → `toTextStreamResponse()`      | ✅        |
| Parent child summary   | `/api/parent-child-summary` | `generateObject` với summarySchema           | ❌        |
| Weekly insight cron    | cron job (Monday 7am ICT)   | `generateObject` với insightSchema           | ❌        |
| Weekly report email    | cron job                    | `generateObject` + Resend                    | ❌        |

---

## 2. Model

```ts
// src/server/ai/client.ts
export const FLASH = "gemini-2.5-flash" // model thực tế dùng
export const FLASH_BACKUP = "gemini-2.0-flash" // fallback nếu cần
```

Tất cả calls dùng `google(FLASH)` từ `@ai-sdk/google`.

---

## 3. Prompt system (`src/server/ai/prompts.ts`)

### Versioning

- `SYSTEM_PROMPT_VERSION = "v3.0"` — lưu trong `ai_chats.prompt_version`
- `systemPromptV1` — giữ nguyên cho reference (Toán lớp 4 hardcode)
- `systemPromptV2` — **production** (grade + subject aware)

### `systemPromptV2(ctx: SessionContext)`

```ts
interface SessionContext {
  studentName?: string
  topicTitle?: string
  topicContext?: string
  grade?: number // 1–5, default 4
  subject?: string // 'math'|'vietnamese'|'science'|'history_geography'|'social_studies'
}
```

- Cô Mây tự giới thiệu theo môn: "gia sư AI dạy **Tiếng Việt lớp 3**"
- `subjectGuidance(subject, grade)` — per-subject pedagogy notes
  - Grade 1–2: câu ngắn, từ đơn giản, ví dụ đồ vật/con vật
  - Grade 3: câu vừa phải, ví dụ thực tế
  - Math: gợi ý từng bước tính toán
  - Vietnamese: đọc hiểu → hỏi đoạn văn nói về gì; chính tả → quy tắc, không đọc chính tả
  - Science: liên hệ hiện tượng với thực tế, hỏi "Tại sao con nghĩ vậy?"
  - History/Geography: gợi mở sự kiện, để em tự nhớ
  - Social Studies: liên hệ cuộc sống hàng ngày

### Teacher analytic prompt (inline trong `/api/teacher-query`)

- System scope: chỉ data lớp đó — `ai_messages`, `weekly_insights`, student activity
- Tối đa 200 từ/câu trả lời
- Không suy đoán ngoài dữ liệu; nếu không đủ data thì nói thẳng

---

## 4. AI Guard (`src/server/ai/guard.ts`)

Validate output Gemini **trước khi lưu DB và stream ra client**.

```
Guard check → passed: persist + stream
            → violated: log guard_status='fallback', dùng FALLBACK_RESPONSE
```

`FALLBACK_RESPONSE`: "Cô đang nghĩ cách hỏi con cho dễ hiểu hơn..."

---

## 5. Multimodal chat — Image in Chat (Phase 3)

Flow:

1. Client: camera button → `POST /api/chat-image-upload` (multipart FormData)
2. Server: validate MIME (jpg/png/webp), max 5MB, verify parent owns chatId
3. Upload → Supabase Storage: `chat/{chatId}/{timestamp}.ext`
4. Trả về signed URL (60 phút) → client stores in `pendingImageUrls` Map
5. Khi gửi message: `imageUrl` injected vào body qua `DefaultChatTransport.fetch`
6. `/api/chat`: `toCoreMessages()` attach `{type:"image", image: new URL(imageUrl)}` vào last user message

```ts
// Attach image to last user message for Gemini multimodal
content: [
  { type: "image", image: new URL(imageUrl) },
  { type: "text", text },
]
```

---

## 6. Structured output

### Weekly Insight cron (`src/server/cron/weekly-insights.ts`)

```ts
const insightSchema = z.object({
  topErrors: z.array(z.string()).max(5),
  studentAttention: z
    .array(
      z.object({
        studentName: z.string(),
        note: z.string(),
      }),
    )
    .max(5),
  teachingSuggestions: z.array(z.string()).max(5),
  // Phase 5 — data-driven, có số liệu cụ thể
  suggestedFocus: z.string().min(1).max(400),
})
```

`buildPrompt(className, grade, totalStudents, items)`:

- `totalStudents` = DB count của enrolled students, **không phải** count từ messages tuần đó
- `activeStudents` = Set từ user-role messages tuần đó
- `suggestedFocus` yêu cầu AI nêu số liệu cụ thể (vd: "12/20 em hỏi về X")

### Parent Child Summary (`/api/parent-child-summary`)

```ts
const summarySchema = z.object({
  headline: z.string().max(120), // 1 câu tổng quan
  activeTopics: z.array(z.string()).max(3),
  strengths: z.array(z.string()).max(3),
  needsAttention: z.array(z.string()).max(3),
  parentTip: z.string().max(200), // gợi ý cụ thể cho PH hôm nay
})
```

- Edge case: 0 activity → trả static JSON không gọi AI
- Error handling: `generateObject` trong try/catch → 503 nếu Gemini fail

---

## 7. Rate limiting

- `MAX_MSG_PER_HOUR = parseInt(AI_MAX_MESSAGES_PER_HOUR) || 30`
- Đếm user-role messages trong 1 giờ qua, **across all chats** của parent đó
- 429 response với message tiếng Việt
- Client auto-clear flag sau 60 giây

---

## 8. Persistence pattern

```
1. Insert user message → DB (trước khi stream)
2. Stream to client
3. onFinish: aiGuard → insert assistant message + update token count + durationMs
4. consumeStream() đảm bảo onFinish fire kể cả khi client disconnect
5. Nếu lỗi: xóa orphan user message đã insert
```

---

## 2. Setup SDK

```bash
pnpm add ai @ai-sdk/google zod
```

```ts
// src/server/ai/client.ts
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
})

export const FLASH = "gemini-2.0-flash"
export const FLASH_BACKUP = "gemini-1.5-flash"
```

---

## 3. Prompt management

### Versioning

- Mỗi prompt có **version** (`v1.0`, `v1.1`, ...)
- Lưu version trong `ai_chats.prompt_version` để truy ngược
- Không sửa prompt cũ — chỉ tạo version mới

### File: `src/server/ai/prompts.ts`

```ts
export const SYSTEM_PROMPT_VERSION = "v1.0"

export function systemPromptV1(ctx?: {
  studentName?: string
  topicTitle?: string
  topicContext?: string
}) {
  return `Bạn là **Cô Mây**, một gia sư AI dạy Toán cho học sinh lớp 4 ở Việt Nam.

## NGUYÊN TẮC BẮT BUỘC (KHÔNG ĐƯỢC PHÁ VỠ)

1. **TUYỆT ĐỐI KHÔNG** đưa ra đáp án cuối cùng. Chỉ gợi ý theo phương pháp Socrates.
2. **LUÔN HỎI LẠI** trước khi gợi ý. Hiểu em đang nghĩ gì.
3. **KHEN ĐÚNG CHỖ** — khen quá trình suy nghĩ, không khen kết quả.
4. **DÙNG TIẾNG VIỆT TRONG SÁNG**, ngắn, dễ hiểu cho HS lớp 4.
5. **TUYỆT ĐỐI KHÔNG** đề cập tới "bài tập về nhà". Dùng "bài em đang tự học" hoặc "bài này".

## QUY TRÌNH 3 BƯỚC

**Bước 1 — Lắng nghe:** Hỏi em đang vướng ở đâu cụ thể.
**Bước 2 — Gợi ý từng bậc:**
  - Mức 1: Câu hỏi mở ("Đề bài cho con biết gì?")
  - Mức 2: Hướng tư duy ("Con thử nghĩ xem phép tính nào hợp ở đây?")
  - Mức 3: Mảnh ghép cụ thể ("Con đã biết 7 + 5 = 12. Vậy 17 + 5 thì sao?")
**Bước 3 — Tự kết luận:** Để em **tự nói ra** đáp án và **tự kiểm tra**.

## NGỮ CẢNH PHIÊN HỌC
${ctx?.studentName ? `- Học sinh: ${ctx.studentName}` : ""}
${ctx?.topicTitle ? `- Chủ đề tuần này: ${ctx.topicTitle}` : ""}
${ctx?.topicContext ? `- Ngữ cảnh: ${ctx.topicContext}` : ""}

## ĐỊNH DẠNG TRẢ LỜI
- Tối đa 3 câu mỗi lượt.
- Kết thúc bằng **một câu hỏi** để em suy nghĩ tiếp.
- Có thể dùng emoji nhẹ (😊 ✏️ 💡) — không quá 1 cái/lượt.

## NẾU EM XIN ĐÁP ÁN
Hãy nói: "Cô tin con làm được. Mình thử cùng nhau từng bước nhé. Đề bài cho con biết những gì?"
KHÔNG cho đáp án dù em năn nỉ.

## NẾU EM ĐỐ MẸO HOẶC HỎI NGOÀI TOÁN
Trả lời ngắn gọn, rồi đưa em quay lại bài: "Mình quay lại bài Toán nhé, cô đợi con đó 😊"
`
}
```

---

## 4. AI Guard

> AI Guard = lớp validate output của AI **trước khi gửi ra cho HS**.

### Vi phạm cần chặn

1. Đáp án trực tiếp (vd: "Đáp số là 22")
2. Bài giải đầy đủ (vd: "Em làm thế này: 17 + 5 = 22")
3. Ngôn ngữ "bài tập về nhà"
4. Nội dung không phù hợp tuổi
5. Toán quá nâng cao (lớp 6+)

### File: `src/server/ai/guard.ts`

```ts
const FORBIDDEN_PATTERNS: Array<{ regex: RegExp; reason: string }> = [
  { regex: /đáp số\s*(là|=|:)/i, reason: "direct_answer" },
  { regex: /=\s*\d+\s*[\.\n]/, reason: "computed_result" }, // "= 22."
  { regex: /bài tập về nhà|btvn|bài về nhà/i, reason: "btvn_term" },
  { regex: /^.{0,30}=\s*\d+/m, reason: "leading_equation" },
]

export type GuardResult =
  | { status: "passed"; text: string }
  | { status: "violated"; reason: string; text: string }

export function aiGuard(text: string): GuardResult {
  for (const { regex, reason } of FORBIDDEN_PATTERNS) {
    if (regex.test(text)) {
      return { status: "violated", reason, text }
    }
  }
  return { status: "passed", text }
}

export const FALLBACK_RESPONSE =
  "Cô đang nghĩ cách hỏi con cho dễ hiểu hơn. Con thử đọc lại đề và nói cho cô biết em hiểu gì nhé! 😊"
```

### Flow trong chat handler

```
1. Stream từ Gemini
2. Khi onFinish → chạy aiGuard(fullText)
3. Nếu violated:
   a. Lần 1: Retry với system prompt + reminder "Đừng đưa đáp án"
   b. Lần 2: Retry tiếp
   c. Lần 3: Trả FALLBACK_RESPONSE, log guard_status='fallback'
4. Nếu passed: persist với guard_status='passed'
```

---

## 5. Vision (ảnh vở / ảnh đề bài)

```ts
import { generateText } from "ai"
import { google, FLASH } from "./client"

export async function analyzeNotebookImage(imageUrl: string) {
  const { text } = await generateText({
    model: google(FLASH),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Đây là ảnh vở Toán của HS lớp 4. Hãy trích:
1. Đề bài (nếu có)
2. Bài làm của HS
3. Lỗi sai phổ biến (nếu có) — không sửa giúp, chỉ nhận diện

Trả lời bằng JSON: { "problem": "...", "studentWork": "...", "errors": ["..."] }`,
          },
          { type: "image", image: imageUrl },
        ],
      },
    ],
  })
  return JSON.parse(text)
}
```

---

## 6. Structured output (insight, weekly report)

```ts
import { generateObject } from "ai"
import { z } from "zod"

const InsightSchema = z.object({
  topErrors: z
    .array(
      z.object({
        topic: z.string(),
        count: z.number(),
        examples: z.array(z.string()).max(3),
      }),
    )
    .max(5),
  studentAttention: z
    .array(
      z.object({
        studentName: z.string(),
        reason: z.string(),
      }),
    )
    .max(5),
  teachingSuggestions: z.array(z.string()).max(3),
})

export async function generateWeeklyInsight(classData: any) {
  const { object } = await generateObject({
    model: google(FLASH),
    schema: InsightSchema,
    prompt: `Phân tích dữ liệu tự học tuần qua của lớp 4 và trả về insight cho GV: ${JSON.stringify(classData)}`,
  })
  return object
}
```

---

## 7. Rate limit & cost control

### Gemini free tier

- **15 RPM**, **1500 req/day**, **1M token context**
- Đủ cho pilot 1 lớp ~30 HS

### Strategy

1. **App-level rate limit**: 30 chat msg / parent / hour
2. **Cache topic context** ở chat init (không gửi lại mỗi lượt)
3. **Stop early** khi guard fail → tiết kiệm token
4. **Insight cron** chạy 1 lần/tuần — batch xử lý

### Monitoring

- Log `total_tokens` mỗi chat
- Dashboard theo dõi token / day
- Alert khi > 80% quota

---

## 8. Fallback strategy

| Tình huống           | Xử lý                                                      |
| -------------------- | ---------------------------------------------------------- |
| Gemini timeout > 15s | Trả thông báo "Cô Mây đang bận, em thử lại sau 1 phút nhé" |
| Gemini API down      | Switch sang `gemini-1.5-flash` (backup)                    |
| Cả 2 down            | Hiện UI "Hệ thống đang bảo trì" + báo lên Sentry           |
| Quota hết            | Hiện thông báo cho PH, gợi ý gửi ảnh vở thay               |

---

## 9. Privacy & data

- **KHÔNG** gửi tên HS đầy đủ vào AI prompt — dùng nickname hoặc viết tắt
- **KHÔNG** gửi info nhận diện cá nhân (địa chỉ, SĐT) vào prompt
- Tắt **Gemini training on user data** (mặc định API tier đã không train)
- Lưu chat log tối đa 90 ngày (cron xóa cũ)

---

## 10. Test prompt

### File: `src/server/ai/__tests__/prompt.test.ts`

20 test case cho prompt v1.0:

- 5 case HS xin đáp án trực tiếp → AI phải từ chối
- 5 case HS sai số học → AI gợi ý đúng bậc
- 5 case HS chán/bỏ cuộc → AI khuyến khích
- 5 case edge: HS hỏi linh tinh, dùng tiếng Anh, viết tắt

→ Đọc tiếp: [SECURITY_PRIVACY.md](SECURITY_PRIVACY.md)
