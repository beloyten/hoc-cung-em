# Pilot Plan — Lớp 4A1

> Kế hoạch triển khai pilot 4 tuần với lớp 4A1.

---

## Mục tiêu pilot

1. **Validate** sản phẩm hoạt động ổn định ngoài demo
2. **Thu data** thật cho 4 nhóm metric
3. **Lấy feedback** từ 30 PH + 30 HS
4. **Sinh case study** cho báo cáo khoa học + bài thi

---

## Lộ trình 4 tuần

### Tuần 0 — Onboard (1 tuần trước pilot)
- [ ] Họp PH lớp 4A1 — em gái giới thiệu HocCungEm
- [ ] Phát thư mời + form consent (xem [DATA_PRIVACY_NOTICE.md](DATA_PRIVACY_NOTICE.md))
- [ ] Thu consent → tối thiểu 25/30 PH OK
- [ ] Hỗ trợ PH cài PWA (qua Zalo nhóm + video hướng dẫn)
- [ ] Em gái tạo lớp + add HS + tạo topic tuần 1

### Tuần 1 — Khởi động
- Topic: 1 chủ đề Toán đơn giản, an toàn (vd: "Ôn tập phép cộng")
- Em gái nhắc PH mỗi tối: "Mời PH thử với con 1 lần"
- Theo dõi sát: bug, UX issue, AI Guard violation
- Họp Zalo nhóm cuối tuần lấy feedback

### Tuần 2 — Vận hành
- Topic 2: chủ đề mới khó hơn 1 chút
- AI Cô Mây gửi insight thứ 2 sáng → em gái dùng để dạy lớp
- Đo: % phiên hoàn thành, lỗi sai phổ biến

### Tuần 3 — Mở rộng touchpoint
- Khuyến khích PH chụp ảnh vở thường xuyên hơn
- Em gái tick review tích cực
- Đo: tỷ lệ tick "tốt" / "cần hỗ trợ"

### Tuần 4 — Đánh giá
- Topic 4
- Survey PH + GV (Google Form)
- Phỏng vấn sâu 5 PH (chọn đa dạng: tích cực, trung bình, không dùng)
- Tổng hợp data cho báo cáo

---

## Kênh hỗ trợ

| Kênh | Dùng cho |
|---|---|
| **Zalo nhóm 4A1** | Hỗ trợ PH cài app, hỏi đáp nhanh |
| **Hotline em gái** | Khẩn cấp (PH gọi nếu ko vào được) |
| **Email anh** | Bug technical |

---

## Điều kiện thành công pilot

- ≥ 20/30 PH có ít nhất 5 phiên tự học/tuần
- ≥ 80% chat AI không bị Guard fallback
- Uptime ≥ 99%
- Em gái tick review ≥ 70% ảnh trong 24h
- ≥ 70% PH hài lòng (NPS ≥ 50)
- 0 incident bảo mật

---

## Risk & contingency

| Risk | Phòng |
|---|---|
| PH không quen smartphone | Em gái + AI hỗ trợ qua Zalo, video hướng dẫn ngắn |
| Server crash | Sentry alert → anh fix trong 1h |
| Gemini quota hết | Reduce throttle, alert PH "đợi 1 tiếng" |
| HS sao chép đáp án bạn | Không phải vấn đề của HocCungEm — vẫn xảy ra dù có app |
| 1 PH lo ngại quyền riêng tư | Em gái giải thích, cho rút consent bất cứ lúc nào |

---

## Báo cáo pilot

Cuối tuần 4 → tài liệu **`docs/05-roadmap/PILOT_RESULTS.md`** (tạo sau) gồm:
- Số liệu định lượng
- Insights định tính
- Case 3 HS điển hình
- Vấn đề phát sinh + cách giải quyết
- Recommendation cho phase 2

→ Đọc tiếp: [TEACHER_ONBOARDING.md](TEACHER_ONBOARDING.md)
