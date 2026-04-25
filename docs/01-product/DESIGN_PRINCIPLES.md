# Nguyên tắc thiết kế — HocCungEm

> In ra dán bàn làm việc. Mọi quyết định thiết kế (sản phẩm, UX, code) phải đối chiếu với 6 nguyên tắc này.

---

## 🎯 6 nguyên tắc cốt lõi

### 1. Giấy là trung tâm — AI là vệ tinh
- Học sinh **vẫn viết vở** như bình thường.
- Không yêu cầu HS dùng máy tính/tablet.
- Mọi tính năng phải bổ sung, không thay thế thói quen học truyền thống.

**Ví dụ áp dụng:**
- ✅ Phụ huynh chụp ảnh vở để upload — vở vẫn là gốc
- ❌ Học sinh gõ bài làm trực tiếp vào app

### 2. AI không bao giờ trả lời thẳng
- AI **chỉ hỏi lại, gợi mở, dẫn dắt**.
- Mọi prompt và response phải qua "AI guard" để đảm bảo nguyên tắc này.
- Nếu LLM lỡ trả lời thẳng → có hậu kiểm + retry.

**Ví dụ áp dụng:**
- ✅ "Em thử cộng cột đơn vị trước nhé. 6 + 9 bằng?"
- ❌ "Đáp án là 6245"

### 3. AI hoạt động trong vùng phát triển gần (ZPD — Vygotsky)
- Gợi ý phải **vừa đủ** để em tự làm được.
- Quá ít → em vẫn bí. Quá nhiều → AI làm hộ.
- Theo dõi response của em → điều chỉnh độ khó của gợi ý.

**Ví dụ áp dụng:**
- Lần 1: gợi ý mức 1 (mơ hồ): "Em thử nghĩ về phép cộng nha"
- Lần 2 (em vẫn bí): gợi ý mức 2 (cụ thể hơn): "Em thử cộng cột đơn vị trước"
- Lần 3 (em vẫn bí): gợi ý mức 3 (chi tiết): "6 + 9 = bao nhiêu? Lớn hơn 9 thì sao?"

### 4. Track ít — hiểu nhiều
- Chỉ thu **3 điểm chạm**: ảnh vở, log AI, tick GV.
- Không track mọi click, mọi giây.
- Không OCR phức tạp, không AI chấm điểm tự động.

**Ví dụ áp dụng:**
- ✅ Lưu thời điểm upload ảnh + nội dung chat AI
- ❌ Track con trỏ chuột, theo dõi mắt, đo thời gian giữa các phím

### 5. Báo cáo phải cá nhân hóa
- **Không bao giờ** "Em học tốt", "Em cần cố gắng".
- Phải nói rõ: tuần này con làm gì, vướng ở đâu, tiến bộ ở đâu, hành động cụ thể nào tiếp theo.

**Ví dụ áp dụng:**
- ✅ "Tuần này em An hoàn thành 4/5 buổi tự học. Em vướng phép cộng có nhớ — đã hỏi AI 4 lần và lần thứ 4 tự giải được. Cuối tuần cha mẹ có thể cùng em luyện thêm 5 phút mỗi tối."
- ❌ "Em An tuần này học khá. Cố gắng tuần sau."

### 6. Không thay thế giáo viên
- AI **gợi ý**, GV **quyết định**.
- Mọi insight phải có nút "GV review" trước khi gửi PH.
- GV có quyền chỉnh sửa/từ chối báo cáo.

**Ví dụ áp dụng:**
- ✅ "AI gợi ý: tuần sau dạy lại phép cộng có nhớ. [Áp dụng] [Bỏ qua]"
- ❌ Tự động gửi báo cáo cho PH mà không qua GV

---

## 🎨 Nguyên tắc UX

### A. Đối với Phụ huynh (mobile)
- **Tap-first:** Mọi thao tác chính xong trong 1-2 tap
- **Thân thuộc:** UI giống chat Zalo/Messenger (PH đã quen)
- **Ấm áp:** Màu pastel, font dễ đọc, không "tech-cool"
- **Không lo lắng:** Mọi báo cáo phải có tone tích cực, có hành động cụ thể, không chỉ trích con

### B. Đối với Giáo viên (web/laptop)
- **Information-dense:** Một màn hình thấy được nhiều thông tin
- **Quyết định nhanh:** Mọi insight có CTA rõ (Áp dụng / Bỏ qua / Xem chi tiết)
- **Không cần hướng dẫn:** GV mở app lần đầu là dùng được trong 5 phút

### C. Đối với HS (gián tiếp)
- **Ngôn ngữ AI:** Xưng "em", "mình", từ vựng lớp 4
- **Dùng emoji vừa phải:** 1-2 emoji/câu, không lạm dụng
- **Khen cụ thể:** "Em làm đúng cột đơn vị rồi!" thay vì "Giỏi!"

---

## 🚦 Nguyên tắc kỹ thuật

### A. Code
- **TypeScript strict mode** — mọi nơi
- **Server Components mặc định**, Client Components khi cần
- **Server Actions** cho mutation, **Route Handlers** cho integration ngoài
- **Zod** validate mọi input từ client
- **Drizzle** cho mọi query DB (trừ auth/storage dùng Supabase JS)

### B. AI
- **Versioning prompt** — mỗi prompt có ID + version
- **Log đầy đủ** — input, output, tokens, latency, model
- **Fallback model** — nếu Gemini fail → switch GPT-4o-mini
- **AI guard** — hậu kiểm output, chặn pattern "đáp án là X"
- **Streaming** — mọi response stream về user

### C. Bảo mật & quyền riêng tư
- **RLS bật mặc định** trên mọi bảng nhạy cảm
- **PH chỉ thấy con mình** — enforce ở DB, không chỉ ở code
- **GV chỉ thấy lớp mình** — enforce ở DB
- **Không lưu mặt HS** — chỉ ảnh vở, có thể blur nếu lỡ chụp mặt
- **Soft delete** — không xóa cứng dữ liệu HS
- **Audit log** cho mọi thao tác sensitive

### D. Performance
- **Lighthouse PWA score >= 80**
- **First Contentful Paint < 2s** trên mobile 4G
- **Streaming response** cho mọi AI call
- **Image optimization** — Next.js Image + WebP
- **Edge runtime** cho route không cần Node API

---

## 🚫 Anti-patterns (cấm)

| Cấm | Vì sao |
|---|---|
| Gamification (huy hiệu, level) cho HS | Tạo áp lực, ngược tinh thần "tự học vì hứng thú" |
| Notification push hàng ngày cho HS | Tạo phụ thuộc thiết bị |
| Leaderboard so sánh HS | Tạo cạnh tranh, làm tổn thương HS yếu |
| AI tự động chấm điểm | Sai 1 lần là mất uy tín cả sản phẩm |
| Yêu cầu HS có tài khoản riêng | Phụ thuộc thiết bị, vi phạm Luật Trẻ em |
| Quảng cáo trong app | Không phù hợp môi trường giáo dục tiểu học |
| Thuật ngữ "bài tập về nhà" | Trái Thông tư 28/2020 |

---

## 🧪 Checklist trước khi merge feature

Mỗi feature mới phải pass:

- [ ] Đáp ứng ít nhất 1 user story P0 hoặc P1
- [ ] Tuân thủ 6 nguyên tắc cốt lõi
- [ ] Không vi phạm anti-patterns
- [ ] Có RLS policy nếu chạm dữ liệu HS
- [ ] AI prompt được version + log
- [ ] Lighthouse score không giảm
- [ ] Test thủ công trên mobile (PH) và desktop (GV)
- [ ] Không dùng từ "bài tập về nhà"

→ Đọc tiếp: [02-pedagogy/PEDAGOGICAL_FOUNDATION.md](../02-pedagogy/PEDAGOGICAL_FOUNDATION.md)
