# Phạm vi MVP — HocCungEm

> **Quy tắc vàng:** "1 lớp, 1 môn, 1 vòng lặp." Mọi thứ ngoài quy tắc này → cắt khỏi MVP, đưa vào BACKLOG.

---

## 1. Mục tiêu MVP

Trong **9 ngày** (deadline 04/05/2026), xây dựng một **PWA chạy được, có dữ liệu thật**, demo được trọn vẹn vòng lặp:

> Học sinh tự học → bí → hỏi AI → AI gợi ý → PH chụp ảnh vở → GV thấy insight → PH nhận báo cáo tuần.

---

## 2. ✅ TRONG phạm vi (IN)

### 2.1 Đối tượng & ngữ cảnh
- **Cấp/lớp:** Lớp 4 (lớp 4A1 của em gái)
- **Môn:** Toán
- **Số lớp pilot:** 1
- **Số PH/HS pilot:** 5-10 (để có data thật cho demo)

### 2.2 Tính năng cho PHỤ HUYNH (PWA mobile)
- ✅ Đăng nhập bằng số điện thoại + mã lớp (OTP qua email/magic link)
- ✅ Xem danh sách con (1 hoặc nhiều)
- ✅ **Chat với AI Socratic** (gõ text + chụp ảnh đề)
  - Stream response
  - Lưu lịch sử chat theo từng con, từng phiên
- ✅ **Chụp/upload ảnh vở** sau khi con tự học xong
  - Chọn chủ đề (chương/bài) + ngày
  - Có thể upload nhiều ảnh
- ✅ **Xem báo cáo tuần** của con (cá nhân hóa, do AI sinh)
- ✅ Cài đặt PWA vào màn hình chính

### 2.3 Tính năng cho GIÁO VIÊN (Web responsive)
- ✅ Đăng nhập bằng email + mật khẩu
- ✅ Tạo lớp + nhập danh sách HS (CSV hoặc form)
- ✅ Sinh **mã lớp** + link để mời PH tham gia
- ✅ Tạo **chủ đề tự học** (vd: "Tuần 5 — Phép cộng có nhớ trong phạm vi 10000")
- ✅ **Dashboard lớp:**
  - Số HS đã/chưa nộp ảnh vở tuần này
  - Số HS hỏi AI nhiều/ít
  - **Top 3-5 lỗi sai phổ biến** (do AI tổng hợp từ log)
  - Heatmap kỹ năng yếu theo chủ đề
- ✅ **Trang chi tiết từng HS:**
  - Ảnh vở đã nộp
  - Lịch sử hỏi AI
  - Tick nhanh: "Tốt" / "Cần hỗ trợ"
  - Note ngắn (optional)
- ✅ **Gợi ý điều chỉnh tuần sau** (AI sinh, GV review)

### 2.4 Tính năng AI / Backend
- ✅ AI Socratic dùng Gemini 2.0 Flash (vision + text)
- ✅ System prompt được khóa theo phương pháp Socrates (versioned)
- ✅ Insight engine chạy weekly cron (sinh top lỗi sai + gợi ý)
- ✅ Báo cáo PH sinh weekly cron + gửi email qua Resend
- ✅ Authentication (Supabase Auth)
- ✅ Storage ảnh vở (Supabase Storage + RLS)
- ✅ Database Postgres + Drizzle ORM + RLS policies

### 2.5 Vận hành & demo
- ✅ Deploy production trên Vercel
- ✅ PWA installable (manifest, icon, splash, offline cơ bản)
- ✅ Onboarding em gái + 5-10 PH lớp 4A1
- ✅ Thu data thật trong 2-4 ngày cuối
- ✅ Có ít nhất 2-3 case study thật để demo

---

## 3. ❌ NGOÀI phạm vi (OUT — đưa vào BACKLOG)

### Cắt cương quyết
- ❌ App native iOS/Android (chỉ PWA)
- ❌ App riêng cho học sinh (HS dùng qua PH)
- ❌ Soạn giáo án bằng AI
- ❌ AI tự chấm điểm bài làm
- ❌ Quản lý nhiều trường, nhiều khối, nhiều lớp
- ❌ Chat trực tiếp GV ↔ PH (đã có Zalo)
- ❌ RAG lịch trường, thời khóa biểu (đã có sổ liên lạc)
- ❌ Gamification (huy hiệu, điểm thưởng) — để sau
- ❌ Phụ huynh tạo bài tự học riêng
- ❌ Multiple subjects (chỉ Toán)
- ❌ Multiple grades (chỉ lớp 4)
- ❌ Tích hợp với eNetviet, vnEdu, SMAS
- ❌ Voice chat với AI
- ❌ Tích hợp camera AI nâng cao (object detection trên vở)
- ❌ Phân tích chữ viết tay sâu (chỉ lưu ảnh + tag)

### Có thể cắt nếu thiếu thời gian
- ⚠️ Insight engine phức tạp → fallback bằng prompt LLM đơn giản tổng hợp
- ⚠️ Heatmap kỹ năng → fallback bằng list text
- ⚠️ Email báo cáo tự động → fallback hiển thị in-app, gửi tay nếu cần
- ⚠️ Tick nhanh GV → optional, dashboard vẫn chạy được không có

---

## 4. Tiêu chí "DONE" của MVP

MVP được coi là **xong** khi đáp ứng đủ:

### Functional
- [ ] PH đăng nhập được trên mobile, cài PWA vào home screen
- [ ] PH chat được với AI Socratic (text + ảnh), AI **không bao giờ** trả lời thẳng
- [ ] PH upload được ảnh vở
- [ ] PH nhận được báo cáo tuần (in-app hoặc email)
- [ ] GV đăng nhập được trên web
- [ ] GV tạo được lớp + thêm HS + chia sẻ link cho PH
- [ ] GV xem được dashboard với ít nhất top 3 lỗi sai phổ biến
- [ ] GV xem được chi tiết từng HS với ảnh vở + log AI
- [ ] Insight engine chạy được (manual trigger là đủ)

### Non-functional
- [ ] Deploy production trên Vercel
- [ ] HTTPS, domain `.vercel.app`
- [ ] PWA Lighthouse score >= 80
- [ ] Không có lỗi crash trong demo flow
- [ ] Có ít nhất 5 PH thật + 10 phiên chat thật trong DB

### Demo readiness
- [ ] Có video demo 2-3 phút
- [ ] Có slide thuyết trình 15-20 slide
- [ ] Có ít nhất 2 case study cụ thể (em A bí gì → AI dẫn dắt thế nào → kết quả)
- [ ] Em gái diễn được kịch bản thuyết trình (đã tập 2 lần)

---

## 5. Giả định & rủi ro

### Giả định
- Em gái có thể vận động được 5-10 phụ huynh tham gia trong 2-4 ngày
- PH có smartphone có camera + 4G/wifi
- Gemini API ổn định, không bị block tại VN
- Free tier Vercel + Supabase đủ cho pilot

### Rủi ro & ứng phó
| Rủi ro | Mức độ | Ứng phó |
|---|---|---|
| Không đủ PH tham gia kịp | Cao | Em gái gọi điện trực tiếp 1-1; giảm xuống 3-5 PH cũng đủ demo |
| AI trả lời thẳng đáp án dù prompt | Trung bình | Test prompt kỹ; có fallback regex check; có "AI guard" model |
| Ảnh vở mờ, OCR không đọc được | Thấp (vì không bắt buộc OCR) | Chỉ lưu ảnh, không cần OCR cho MVP |
| Wifi sân khấu thi yếu khi demo | Trung bình | Quay video demo backup; có chế độ offline cho phần chat đã cache |
| Bug last-minute trước demo | Cao | Freeze code 24h trước demo, chỉ fix critical bug |
| Chi phí Gemini vượt free tier | Thấp | Theo dõi mỗi ngày; có rate limit per user |

→ Đọc tiếp: [PERSONAS.md](PERSONAS.md)
