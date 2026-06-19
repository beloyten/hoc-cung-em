# Product Roadmap v4.0 — HocCungEm

> **Cập nhật:** 19/06/2026
> **Chế độ:** Post-competition → Product
> **Trạng thái:** Phase 1–5 hoàn thành ✅ — codebase sẵn sàng production

---

## Hiện trạng (19/06/2026)

**Đã ship (Phases 1–5):**

- Auth: Phone OTP + Email OTP (Supabase)
- Roles: teacher / parent, middleware guard
- Teacher: tạo lớp (grade 1–5, multi-subject), thêm HS, tạo topic, review ảnh
- Topic Library: 15 template Toán lớp 4 + 10 template Tiếng Việt lớp 4, filter theo grade+subject
- Multi-subject: enum `math | vietnamese | science | history_geography | social_studies`
- Parent: chat Cô Mây (Socratic, multimodal, rate-limited 30 msg/hr), upload ảnh vở
- Chat: gửi ảnh đề bài trong chat (camera button → upload → Gemini Vision)
- AI grade+subject-aware: `systemPromptV2` với per-subject pedagogy notes, grade 1–2 simplification
- Teacher AI Query: `/api/teacher-query` — hỏi về lớp mình bằng ngôn ngữ tự nhiên, streaming
- Parent Child Summary: `/api/parent-child-summary` — AI tóm tắt tuần học của con theo schema cố định
- Data-informed suggestions: `suggested_focus` trong weekly insight cron (Phase 5)
- Cron: weekly insight (với `suggestedFocus`) + weekly report email (Resend)
- Landing page: animated chat demo (framer-motion), scroll animations, micro-interactions
- PWA: sw.ts (Serwist) + install prompt + manifest
- Deploy: Vercel production

**Giới hạn / todo tiếp theo:**

- Templates: chưa có Khoa học, Lịch sử-Địa lý, Tự nhiên-Xã hội; các grade ngoài lớp 4 chưa có templates
- School Admin layer (Phase 4.3): B2B, cần pilot trước
- Monetization: Stripe chưa tích hợp
- Domain: chưa chuyển sang .vn / .com

**DB migrations đã apply:**

- `0001_…` — schema ban đầu
- `0002_add_topic_templates` — bảng `topic_templates`
- `0003_expand_subject_enum` — thêm 4 subject values
- `0004_add_suggested_focus` — cột `suggested_focus` trong `weekly_insights`

---

## Phase 1 — Topic Library

**Goal:** Giảm friction cho giáo viên — không cần tạo topic từ đầu.

### 1.1 Schema mới: `topic_templates`

```sql
topic_templates (
  id uuid PK,
  grade       integer NOT NULL,          -- 1–5
  subject     subject_enum NOT NULL,
  title       text NOT NULL,
  description text,
  context     text,                      -- nội dung gợi ý cho Cô Mây
  verified_at date,                      -- null = draft, chưa xác minh
  created_at  timestamp
)
```

Template không gắn với lớp cụ thể. Teacher browse → "Clone vào lớp" → tạo `study_topics` row từ template, có thể edit trước khi save.

### 1.2 UI: Topic management

- Trang teacher topics: thêm tab "Thư viện mẫu"
- Teacher chọn template → xem preview → "Dùng cho tuần này" → pre-fill form
- Teacher sửa toàn bộ nội dung trước khi save
- Sau khi tạo: topic thuộc về lớp, CRUD bình thường

### 1.3 Seed templates — Grade 4 Math

15 chủ đề theo khung GDPT 2018:

| #   | Chủ đề                                  | Ghi chú                                 |
| --- | --------------------------------------- | --------------------------------------- |
| 1   | Các số đến 1 000 000                    | Đọc, viết, so sánh                      |
| 2   | Phép cộng, trừ số nhiều chữ số          | Có nhớ, không nhớ                       |
| 3   | Phép nhân với số có một chữ số          |                                         |
| 4   | Phép nhân với 10, 100, 1000             | Nhân nhẩm                               |
| 5   | Phép nhân với số có hai chữ số          |                                         |
| 6   | Phép chia cho số có một chữ số          | Có dư, không dư                         |
| 7   | Phép chia cho 10, 100, 1000             | Chia nhẩm                               |
| 8   | Tìm thành phần chưa biết                | Số hạng, số bị trừ, thừa số, số bị chia |
| 9   | Dãy số và quy luật                      |                                         |
| 10  | Phân số — khái niệm                     | So sánh phân số                         |
| 11  | Phép cộng, trừ phân số                  | Cùng mẫu số                             |
| 12  | Góc, tia, đoạn thẳng                    | Góc nhọn, tù, vuông                     |
| 13  | Hình chữ nhật, hình vuông — diện tích   | Chu vi + diện tích                      |
| 14  | Đơn vị đo độ dài, khối lượng, thời gian | Đổi đơn vị                              |
| 15  | Giải toán có lời văn                    | Dạng toán điển hình                     |

> ⚠️ Context chi tiết cần giáo viên review theo SGK 2024–2026 trước khi `verified_at` được set.

### 1.4 Checklist ✅ DONE (19/06/2026)

- [x] Migration `0002_add_topic_templates` — tạo bảng `topic_templates`
- [x] Seed 15 templates Grade 4 Math + 10 templates Tiếng Việt lớp 4
- [x] API: `GET /api/topic-templates?grade=4&subject=math` (với subject filter fix)
- [x] UI: dialog "Thư viện mẫu" (TemplatePicker) + preview + "Clone vào lớp"
- [x] subject param threaded page → form → picker → API với `z.enum` validation
- [x] RLS: `topic_templates_select` policy cho authenticated users

---

## Phase 2 — Multi-grade + Multi-subject

**Goal:** Mở rộng từ "Toán lớp 4" → "Tiểu học lớp 1–5, nhiều môn".

**Thứ tự ưu tiên môn học:**

1. **Toán** — đang có ✓
2. **Tiếng Việt** — nhu cầu cao nhất sau Toán
3. **Khoa học** (Grade 4–5)
4. **Lịch sử & Địa lý** (Grade 4–5)
5. **Tự nhiên & Xã hội** (Grade 1–3)

### 2.1 Schema

```sql
-- Migration: expand subject enum
ALTER TYPE subject ADD VALUE 'vietnamese';
ALTER TYPE subject ADD VALUE 'science';
ALTER TYPE subject ADD VALUE 'history_geography';
ALTER TYPE subject ADD VALUE 'social_studies';
```

`classes.grade` đã có — không cần migrate.

### 2.2 Prompt engine (`prompts.ts`)

System prompt hiện tại hardcode "Toán lớp 4". Cần:

- Thêm `grade: number` + `subject: Subject` vào `ChatContext`
- Switch subject → giọng điệu phù hợp (Toán: logic từng bước; Tiếng Việt: đọc hiểu, diễn đạt)
- Grade 1–2: câu ngắn hơn, ví dụ đơn giản hơn

### 2.3 UI

- Class creation: grade selector (1–5), subject selector
- Landing page: copy đổi từ "Toán lớp 4" → "Tiểu học lớp 1–5"
- Template library: filter theo grade + subject

### 2.4 Checklist ✅ DONE (19/06/2026)

- [x] Migration `0003_expand_subject_enum` — thêm 4 subject values vào enum
- [x] `ChatContextData` type: `grade: number`, `subject: string` trong sessions.ts
- [x] `systemPromptV2` grade+subject-aware; `subjectGuidance()` per-subject pedagogy notes
- [x] `loadChatForParent` trả về `grade` + `subject` (topic subject takes priority over class subject)
- [x] Seed 10 templates Tiếng Việt lớp 4
- [x] UI: grade (1–5) + subject selector trong create class form
- [x] Landing page copy: "Toán lớp 4" → "Tiểu học lớp 1–5"

---

## Phase 3 — UI/UX Overhaul + Image in Chat

**Goal:** Ấn tượng mạnh từ giây đầu tiên + unlock cách học sinh tự nhiên nhất muốn dùng app.

**Package cần install (cần approve):** `framer-motion`

### 3.1 Image upload trong student chat

Feature bị skip ở sprint MVP — ưu tiên cao nhất trong phase này.

**Vì sao quan trọng:** Học sinh tiểu học không gõ được đề bài. "Cô ơi bài này làm thế nào" + chụp sách là cách tự nhiên nhất. Hiện tại upload ảnh vở là flow tách biệt, không tích hợp vào chat.

**Flow:**

1. Parent/student nhấn camera icon trong chat input
2. Chọn từ gallery hoặc chụp trực tiếp
3. Ảnh upload lên Supabase Storage (signed URL) → trả về URL
4. Message gửi với `image` part kèm `text` part (Gemini multimodal)
5. Cô Mây nhận ảnh + đặt câu hỏi Socratic về đề bài trong ảnh

**Technical:**

- `chat-panel.tsx`: thêm camera button, handle file input, preview thumbnail trước khi gửi
- `route.ts`: nhận `imageUrl` trong request body → thêm `image` part vào Gemini message
- Reuse Supabase Storage đã có (không cần infra mới)
- Giới hạn: 1 ảnh/message, max 5MB, chỉ jpg/png/webp

### 3.2 Landing page — animated chat demo

Thay static `ChatBubble` mockup bằng animation tự chạy:

- Bubble xuất hiện lần lượt với delay
- Cô Mây: typing indicator 3 chấm → text fade in từng từ
- Loop hoặc chạy hết rồi dừng

### 3.3 Scroll-reveal sections

`opacity: 0 → 1` + `y: 20px → 0`, delay stagger 100ms giữa items khi scroll đến.

### 3.4 Page transitions

Next.js View Transitions API — zero bundle cost, 5 dòng config.

### 3.5 Chat UI polish

- `MessageBubble`: scale(0.8) + fade in khi xuất hiện
- Typing indicator: 3 dots CSS pulse, bỏ text "đang nghĩ..."
- Send button: loading spinner khi streaming

### 3.6 Micro-interactions

- Button: `active:scale-[0.97]`
- Cards: `hover:shadow-md hover:-translate-y-0.5`
- Input focus: ring transition smooth

### 3.7 Checklist ✅ DONE (19/06/2026)

- [x] `framer-motion` 12.x installed
- [x] `/api/chat-image-upload` — multipart upload, validate MIME+size, ownership check, signed URL 1hr
- [x] `chat-panel.tsx`: camera button, file input, thumbnail preview, `pendingImageUrls` module-level Map
- [x] `chat/route.ts`: `imageUrl` in bodySchema → `toCoreMessages()` attaches image part on last user msg
- [x] `AnimatedChatDemo` — framer-motion state machine, 6-bubble script, typing indicator
- [x] `MessageBubble` + typing indicator entrance animations (AnimatePresence)
- [x] Image preview strip with animate height 0→auto
- [x] Micro-interactions: `active:scale-[0.97]` buttons, `hover:-translate-y-0.5` cards
- [ ] Scroll-reveal sections (bỏ qua, AnimatedChatDemo đã đủ ấn tượng)
- [ ] Next.js View Transitions (bỏ qua — không cần thiết với framer-motion)

---

## Phase 4 — AI cho Giáo viên & Phụ huynh + School Admin

**Goal:** Khai thác data chat đã có để tạo giá trị cho teacher và parent — thứ chỉ HocCungEm làm được vì sở hữu data.

### 4.1 Teacher Conversational Query

Giáo viên hỏi về lớp mình bằng ngôn ngữ tự nhiên, AI trả lời từ data thật.

**Ví dụ queries:**

- "Tuần này em nào đang gặp khó nhất?"
- "5 câu hỏi phổ biến nhất của lớp về phân số là gì?"
- "Em Nguyễn Văn A có tiến bộ so với tuần trước không?"

**Quan trọng:** Đây không phải chatbot chung chung. AI chỉ trả lời về data trong DB của lớp đó — `ai_messages`, `study_topics`, `weekly_insights` của classes thuộc teacher đang login. Không có quyền truy cập ngoài scope.

**Technical:**

- Mới: `/api/teacher-query` — system prompt analytic, không Socratic
- Context: inject tóm tắt data lớp vào prompt (không dump raw, dùng structured summary)
- UI: chat widget đơn giản trong teacher dashboard sidebar

### 4.2 Parent Child Summary

Phụ huynh hỏi nhanh về tình hình học của con, AI tóm tắt từ data thật.

**Scope hẹp — chỉ query data, không freeform counseling:**

- "Con tuần này học thế nào?" → tóm tắt số lần hỏi, chủ đề, điểm vướng mắc
- "Con có hiểu bài phân số không?" → dựa trên chat logs của con với Cô Mây

**Không làm:** Tư vấn tâm lý, tư vấn nuôi dạy con, "tâm sự" — rủi ro AI đưa lời khuyên sai cho phụ huynh lo lắng về con. Đây là ranh giới rõ ràng.

**Technical:**

- Reuse cùng pattern với teacher query, scope xuống 1 student
- UI: nút "Hỏi về [tên con]" trên parent home

### 4.3 School Admin Layer

Kênh B2B — một admin quản lý nhiều giáo viên trong trường.

```sql
schools (
  id uuid PK,
  name text NOT NULL,
  city text,
  admin_user_id uuid REFERENCES auth.users,
  created_at timestamp
)

school_staff (
  school_id uuid REFERENCES schools,
  teacher_id uuid REFERENCES teachers,
  role text DEFAULT 'teacher',  -- 'teacher' | 'vice_admin'
  joined_at timestamp,
  PRIMARY KEY (school_id, teacher_id)
)
```

- Role mới: `school_admin` trong middleware
- Dashboard: tổng quan tất cả lớp trong trường
- Mời giáo viên qua email
- Báo cáo aggregate toàn trường

### 4.4 Checklist Phase 4 ✅ PARTIAL DONE (19/06/2026)

- [x] API `/api/teacher-query` — streaming, scoped to class data, max 200 words, `onError` logging
- [x] `TeacherQueryWidget` trong teacher dashboard — 3 sample chips, streaming reader, flush UTF-8
- [x] API `/api/parent-child-summary` — `generateObject` schema cố định, error handling 503
- [x] `ChildSummaryWidget` trong parent home — skeleton loading, multi-student selector
- [ ] Phase 4.3 School Admin — B2B, cần pilot trước khi implement

---

## Phase 5 — Data-informed Lesson Suggestions

**Goal:** AI gợi ý nội dung tuần sau dựa trên những gì học sinh đang vướng mắc — thứ không tool nào khác làm được vì không có data.

**Ví dụ output:**

> "Tuần này 60% học sinh lớp 4A hỏi về chia có dư. Gợi ý tuần sau tập trung vào bài tập thực hành chia với số dư khác nhau, đặc biệt dạng 'chia không hết'."

**Khác với soạn giáo án generic:** Đây là gợi ý được cá nhân hóa theo data thật của từng lớp, không phải AI viết bài giảng từ đầu. Phần AI viết generic giáo viên đã có ChatGPT — HocCungEm không cạnh tranh ở đây.

**Technical:** Extension của weekly insight cron — thêm `suggested_focus` field vào output, hiển thị trong teacher dashboard.

### Phase 5 Checklist ✅ DONE (19/06/2026)

- [x] `suggestedFocus: text("suggested_focus")` thêm vào schema `weekly_insights`
- [x] Migration `0004_add_suggested_focus` applied to production
- [x] `insightSchema` trong cron: thêm `suggestedFocus` với constraint "có số liệu cụ thể, không chung chung"
- [x] `buildPrompt()` nhận `grade` + `totalStudents` (từ DB count thực tế, không phải từ messages)
- [x] DB insert cron: lưu `suggestedFocus`
- [x] `insights/page.tsx`: hiển thị sky-colored banner "🎯 Gợi ý ưu tiên tuần sau (dựa trên dữ liệu thực)"
- [x] `manifest.ts` description update

---

## Không làm

| Feature                          | Lý do                                                       |
| -------------------------------- | ----------------------------------------------------------- |
| Soạn giáo án generic             | Commodity — ChatGPT/Gemini đã làm tốt hơn, không có moat    |
| Parent tư vấn tâm lý / tâm sự    | AI đưa lời khuyên sai về con = trust bị phá vỡ nghiêm trọng |
| Chat trực tiếp GV ↔ PH           | Zalo đã làm tốt hơn                                         |
| App native iOS/Android           | PWA đủ cho giai đoạn này                                    |
| Gamification (huy hiệu, điểm)    | Làm sau khi có retention data                               |
| Tích hợp eNetviet / vnEdu / SMAS | Complexity cao, deal B2B trước                              |

---

## Monetization

**Model:** Freemium — free đủ dùng để acquire, Pro unlock giá trị thật.

| Tier            | Giá        | Giới hạn                                                                     |
| --------------- | ---------- | ---------------------------------------------------------------------------- |
| **Free**        | 0đ         | 1 lớp, 30 msg/hr/HS, báo cáo cơ bản                                          |
| **Teacher Pro** | ~49k/tháng | Không giới hạn lớp, topic library đầy đủ, teacher AI query, báo cáo chi tiết |
| **School**      | Liên hệ    | School admin, aggregate dashboard, lesson suggestions, custom branding       |

**Khi nào implement:** Sau Phase 2 có đủ subjects để justify Pro. Dùng Stripe.

---

## Curriculum approach

- Tất cả topic templates seed với `verified_at = NULL` (draft)
- UI hiển thị badge "Chưa xác minh — GV nên xem lại" trên template draft
- Giáo viên thực tế review → admin set `verified_at`
- Nội dung dựa trên khung GDPT 2018; phiên bản SGK 2024–2026 cần giáo viên xác nhận
- Triết lý: **teacher curates, AI teaches** — không hardcode curriculum

---

## Thứ tự thực hiện

```
Phase 1 — Topic Library
    ↓
Phase 2 — Multi-grade/subject  ←→  Phase 3 — UI/UX + Image in Chat
    ↓
Phase 4 — AI cho GV/PH + School Admin
    ↓
Phase 5 — Data-informed Lesson Suggestions
    ↓
Monetization (Stripe)
```

Phase 1 unblocks Phase 2 content (cần template framework trước khi seed nhiều môn).
Phase 3 (UI + image) độc lập — có thể làm song song với Phase 2.
Phase 5 cần đủ data volume từ Phase 2 mới có giá trị.
