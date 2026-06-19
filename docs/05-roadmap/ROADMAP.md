# Product Roadmap v3.0 — HocCungEm

> **Cập nhật:** tháng 6 năm 2026
> **Chế độ:** Post-competition → Product

---

## Hiện trạng (June 2026)

**Đã ship:**
- Auth: Phone OTP + Email OTP (Supabase)
- Roles: teacher / parent / student
- Teacher: tạo lớp, thêm HS, tạo topic, review ảnh
- Parent: chat Cô Mây (Socratic, rate-limited 30 msg/hr), upload ảnh vở (separate flow)
- Cron: weekly insight + weekly report email (Resend)
- Landing page polished, Privacy page
- Deploy: Vercel production

**Giới hạn hiện tại:**
- Chỉ Toán lớp 4
- Chat chỉ hỗ trợ text — học sinh không gửi được ảnh đề bài
- Teacher tạo topic từ trắng, không có template
- Chat chỉ dành cho học sinh (qua parent), giáo viên không có AI interface
- UI tĩnh hoàn toàn, không có animation

**DB schema liên quan:**
- `classes.grade` — đã có (integer) ✓
- `study_topics.subject` — đã có (enum, chỉ "math") ✓
- `study_topics.context` — đã có (text, context giáo viên cung cấp) ✓

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

| # | Chủ đề | Ghi chú |
|---|--------|---------|
| 1 | Các số đến 1 000 000 | Đọc, viết, so sánh |
| 2 | Phép cộng, trừ số nhiều chữ số | Có nhớ, không nhớ |
| 3 | Phép nhân với số có một chữ số | |
| 4 | Phép nhân với 10, 100, 1000 | Nhân nhẩm |
| 5 | Phép nhân với số có hai chữ số | |
| 6 | Phép chia cho số có một chữ số | Có dư, không dư |
| 7 | Phép chia cho 10, 100, 1000 | Chia nhẩm |
| 8 | Tìm thành phần chưa biết | Số hạng, số bị trừ, thừa số, số bị chia |
| 9 | Dãy số và quy luật | |
| 10 | Phân số — khái niệm | So sánh phân số |
| 11 | Phép cộng, trừ phân số | Cùng mẫu số |
| 12 | Góc, tia, đoạn thẳng | Góc nhọn, tù, vuông |
| 13 | Hình chữ nhật, hình vuông — diện tích | Chu vi + diện tích |
| 14 | Đơn vị đo độ dài, khối lượng, thời gian | Đổi đơn vị |
| 15 | Giải toán có lời văn | Dạng toán điển hình |

> ⚠️ Context chi tiết cần giáo viên review theo SGK 2024–2026 trước khi `verified_at` được set.

### 1.4 Checklist

- [ ] Migration: tạo bảng `topic_templates`
- [ ] Seed 15 templates Grade 4 Math
- [ ] API: `GET /api/topic-templates?grade=4&subject=math`
- [ ] UI: tab "Thư viện mẫu" + modal preview + "Clone vào lớp"
- [ ] Teacher CRUD topic của lớp (edit/delete) — confirm hoạt động đúng

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

### 2.4 Checklist

- [ ] Migration: expand `subject` enum
- [ ] Update `ChatContext` type: thêm `grade`, `subject`
- [ ] Refactor `prompts.ts`: grade+subject-aware
- [ ] Seed templates Tiếng Việt Grade 4 (~10 chủ đề)
- [ ] UI: grade/subject selector trong create class form
- [ ] Landing page copy update

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

### 3.7 Checklist

- [ ] `pnpm add framer-motion`
- [ ] Chat: camera button + file input + thumbnail preview
- [ ] Chat: upload to Supabase Storage → get URL
- [ ] `route.ts`: handle `imageUrl` → multimodal Gemini message
- [ ] Landing: animated chat demo component
- [ ] Landing: scroll-reveal wrapper component
- [ ] Next.js View Transitions config
- [ ] Chat: `MessageBubble` entrance animation + typing dots CSS
- [ ] Chat: send button loading state

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

### 4.4 Checklist Phase 4

- [ ] API `/api/teacher-query` + system prompt analytic
- [ ] UI: teacher query widget trong dashboard
- [ ] API `/api/parent-child-summary` — query + summarize 1 student
- [ ] UI: nút "Hỏi về con" trong parent home
- [ ] Migration: `schools` + `school_staff` tables
- [ ] Role `school_admin` trong middleware + pages

---

## Phase 5 — Data-informed Lesson Suggestions

**Goal:** AI gợi ý nội dung tuần sau dựa trên những gì học sinh đang vướng mắc — thứ không tool nào khác làm được vì không có data.

**Ví dụ output:**
> "Tuần này 60% học sinh lớp 4A hỏi về chia có dư. Gợi ý tuần sau tập trung vào bài tập thực hành chia với số dư khác nhau, đặc biệt dạng 'chia không hết'."

**Khác với soạn giáo án generic:** Đây là gợi ý được cá nhân hóa theo data thật của từng lớp, không phải AI viết bài giảng từ đầu. Phần AI viết generic giáo viên đã có ChatGPT — HocCungEm không cạnh tranh ở đây.

**Technical:** Extension của weekly insight cron — thêm `suggested_focus` field vào output, hiển thị trong teacher dashboard.

---

## Không làm

| Feature | Lý do |
|---------|-------|
| Soạn giáo án generic | Commodity — ChatGPT/Gemini đã làm tốt hơn, không có moat |
| Parent tư vấn tâm lý / tâm sự | AI đưa lời khuyên sai về con = trust bị phá vỡ nghiêm trọng |
| Chat trực tiếp GV ↔ PH | Zalo đã làm tốt hơn |
| App native iOS/Android | PWA đủ cho giai đoạn này |
| Gamification (huy hiệu, điểm) | Làm sau khi có retention data |
| Tích hợp eNetviet / vnEdu / SMAS | Complexity cao, deal B2B trước |

---

## Monetization

**Model:** Freemium — free đủ dùng để acquire, Pro unlock giá trị thật.

| Tier | Giá | Giới hạn |
|------|-----|---------|
| **Free** | 0đ | 1 lớp, 30 msg/hr/HS, báo cáo cơ bản |
| **Teacher Pro** | ~49k/tháng | Không giới hạn lớp, topic library đầy đủ, teacher AI query, báo cáo chi tiết |
| **School** | Liên hệ | School admin, aggregate dashboard, lesson suggestions, custom branding |

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
