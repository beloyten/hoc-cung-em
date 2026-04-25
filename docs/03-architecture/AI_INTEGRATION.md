# AI Integration — HocCungEm

> Sử dụng **Vercel AI SDK** + **Google Gemini 2.0 Flash**. Tất cả AI logic ở `src/server/ai/`.

---

## 1. Tổng quan

| Use case | Model | Mode | Streaming |
|---|---|---|---|
| Chat Socratic với HS | `gemini-2.0-flash` | text + vision | ✅ |
| Insight tuần cho GV | `gemini-2.0-flash` | text + structured output | ❌ |
| Báo cáo tuần PH | `gemini-2.0-flash` | text + structured output | ❌ |
| Phân tích ảnh vở | `gemini-2.0-flash` | vision | ❌ |
| (Backup) | `gemini-1.5-flash` | — | — |

---

## 2. Setup SDK

```bash
pnpm add ai @ai-sdk/google zod
```

```ts
// src/server/ai/client.ts
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export const FLASH = "gemini-2.0-flash";
export const FLASH_BACKUP = "gemini-1.5-flash";
```

---

## 3. Prompt management

### Versioning
- Mỗi prompt có **version** (`v1.0`, `v1.1`, ...)
- Lưu version trong `ai_chats.prompt_version` để truy ngược
- Không sửa prompt cũ — chỉ tạo version mới

### File: `src/server/ai/prompts.ts`
```ts
export const SYSTEM_PROMPT_VERSION = "v1.0";

export function systemPromptV1(ctx?: {
  studentName?: string;
  topicTitle?: string;
  topicContext?: string;
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
`;
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
  { regex: /=\s*\d+\s*[\.\n]/, reason: "computed_result" },  // "= 22."
  { regex: /bài tập về nhà|btvn|bài về nhà/i, reason: "btvn_term" },
  { regex: /^.{0,30}=\s*\d+/m, reason: "leading_equation" },
];

export type GuardResult =
  | { status: "passed"; text: string }
  | { status: "violated"; reason: string; text: string };

export function aiGuard(text: string): GuardResult {
  for (const { regex, reason } of FORBIDDEN_PATTERNS) {
    if (regex.test(text)) {
      return { status: "violated", reason, text };
    }
  }
  return { status: "passed", text };
}

export const FALLBACK_RESPONSE =
  "Cô đang nghĩ cách hỏi con cho dễ hiểu hơn. Con thử đọc lại đề và nói cho cô biết em hiểu gì nhé! 😊";
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
import { generateText } from "ai";
import { google, FLASH } from "./client";

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
  });
  return JSON.parse(text);
}
```

---

## 6. Structured output (insight, weekly report)

```ts
import { generateObject } from "ai";
import { z } from "zod";

const InsightSchema = z.object({
  topErrors: z.array(z.object({
    topic: z.string(),
    count: z.number(),
    examples: z.array(z.string()).max(3),
  })).max(5),
  studentAttention: z.array(z.object({
    studentName: z.string(),
    reason: z.string(),
  })).max(5),
  teachingSuggestions: z.array(z.string()).max(3),
});

export async function generateWeeklyInsight(classData: any) {
  const { object } = await generateObject({
    model: google(FLASH),
    schema: InsightSchema,
    prompt: `Phân tích dữ liệu tự học tuần qua của lớp 4 và trả về insight cho GV: ${JSON.stringify(classData)}`,
  });
  return object;
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

| Tình huống | Xử lý |
|---|---|
| Gemini timeout > 15s | Trả thông báo "Cô Mây đang bận, em thử lại sau 1 phút nhé" |
| Gemini API down | Switch sang `gemini-1.5-flash` (backup) |
| Cả 2 down | Hiện UI "Hệ thống đang bảo trì" + báo lên Sentry |
| Quota hết | Hiện thông báo cho PH, gợi ý gửi ảnh vở thay |

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
