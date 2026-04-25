# Chỉ số đo lường thành công — HocCungEm

> Có số liệu thật khi đi thi = ăn điểm. Tài liệu này định nghĩa **đo cái gì, đo thế nào, target bao nhiêu**.

---

## 1. Bốn nhóm chỉ số

| Nhóm | Mục đích | Khán giả |
|---|---|---|
| **Sư phạm** | Học sinh có học hiệu quả hơn không? | Giám khảo, GV |
| **Hành vi** | Có ai dùng app không? | Dev, GV |
| **Kỹ thuật** | App có chạy ổn không? | Dev |
| **Hài lòng** | Người dùng thích không? | Giám khảo, GV |

---

## 2. Chỉ số sư phạm

### 2.1 Tỷ lệ HS tự giải được sau khi hỏi AI
- **Định nghĩa:** % phiên chat mà cuối cùng HS tự ra được đáp án (không phải AI cho)
- **Cách đo:** AI tag mỗi phiên chat: `solved_by_self` / `gave_up` / `partial`
- **Target MVP:** ≥ 60%
- **Ý nghĩa:** Chứng minh AI Socratic thực sự dẫn dắt HS hiểu, không phải chỉ "trả lời thay"

### 2.2 Số bước gợi ý trung bình mỗi phiên
- **Định nghĩa:** Số lượt AI gợi ý trước khi HS tự giải được
- **Cách đo:** Đếm message AI trong mỗi phiên `solved_by_self`
- **Target MVP:** 3-5 bước (sweet spot)
  - < 3: bài quá dễ, không có giá trị
  - > 7: AI có thể đang quá chi tiết, gần làm hộ

### 2.3 Lỗi sai phổ biến giảm theo tuần
- **Định nghĩa:** Sau khi GV được nhận insight tuần 1 và điều chỉnh dạy, lỗi sai đó có giảm tuần 2 không?
- **Cách đo:** So sánh top 3 lỗi sai tuần N vs tuần N+1
- **Target MVP:** ≥ 1 lỗi sai giảm rõ rệt (ít nhất 30%)
- **Lưu ý:** Cần ít nhất 2 tuần data — nếu pilot ngắn quá, đây là chỉ số "qualitative"

### 2.4 Tự đánh giá HS — "Em hiểu bài hơn không?"
- **Định nghĩa:** Khảo sát HS sau pilot (qua PH)
- **Câu hỏi:** "Sau khi dùng Cô Mây AI, em có thấy hiểu bài Toán hơn không?" (Có nhiều / Có chút / Như cũ / Không)
- **Target MVP:** ≥ 70% trả lời "Có nhiều" hoặc "Có chút"

---

## 3. Chỉ số hành vi (engagement)

### 3.1 Tỷ lệ HS dùng app ≥ 1 lần/tuần
- **Định nghĩa:** Active rate
- **Cách đo:** Đếm distinct HS có ít nhất 1 phiên chat hoặc 1 ảnh upload trong tuần
- **Target MVP:** ≥ 50% trong tuần thứ 2

### 3.2 Số phiên tự học trung bình mỗi HS/tuần
- **Target MVP:** 2-3 phiên/HS/tuần
- **Đo bằng:** count distinct study_sessions per student per week

### 3.3 GV mở dashboard mấy lần/tuần
- **Target MVP:** ≥ 3 lần/tuần (chứng minh GV thấy hữu ích)

### 3.4 PH mở báo cáo tuần
- **Target MVP:** ≥ 80% PH mở báo cáo trong vòng 48h sau khi gửi

---

## 4. Chỉ số kỹ thuật

### 4.1 Uptime
- **Target:** ≥ 99% trong thời gian pilot
- **Đo:** Vercel Analytics + Sentry

### 4.2 Time-to-First-Response của AI
- **Target:** < 3 giây cho first token (streaming)
- **Đo:** Log `ai_response_time_ms` trong mỗi message

### 4.3 PWA Lighthouse score
- **Target:** ≥ 80 (PWA + Performance + A11y)

### 4.4 Tỷ lệ AI vi phạm Socratic (AI Guard catch)
- **Target:** < 5% response cần retry
- **Đo:** Log mỗi response qua AI Guard

### 4.5 Crash-free session rate
- **Target:** ≥ 99%
- **Đo:** Sentry

---

## 5. Chỉ số hài lòng

### 5.1 NPS giáo viên
- **Câu hỏi:** "Cô có giới thiệu HocCungEm cho đồng nghiệp không?" (0-10)
- **Target MVP:** ≥ 8/10

### 5.2 NPS phụ huynh
- **Câu hỏi:** "Anh/chị có giới thiệu HocCungEm cho phụ huynh khác không?" (0-10)
- **Target MVP:** ≥ 8/10

### 5.3 Câu trả lời mở (qualitative)
Thu 3 câu trích dẫn từ:
- 1 giáo viên (em gái)
- 1 phụ huynh
- 1 học sinh (qua PH kể lại)

→ Dùng làm "voice of customer" trong slide thuyết trình.

---

## 6. Chỉ số an toàn (PHẢI có)

### 6.1 Số ca AI đưa đáp án thẳng (vi phạm Socratic)
- **Target:** 0
- **Action:** Mọi vi phạm phải log + alert + hotfix prompt

### 6.2 Số ca rò rỉ dữ liệu HS
- **Target:** 0
- **Đo:** Audit log RLS

### 6.3 Số phàn nàn từ PH về quyền riêng tư
- **Target:** 0
- **Đo:** Email/feedback channel

---

## 7. Bảng tổng hợp KPI cho slide thuyết trình

```
┌──────────────────────────────────────────────────────────┐
│ HocCungEm — Pilot lớp 4A1 (X ngày, Y học sinh)           │
├──────────────────────────────────────────────────────────┤
│ 🎯 Tỷ lệ HS tự giải được sau khi hỏi AI:    ___%         │
│ 📚 Số phiên tự học trung bình:               ___/HS/tuần │
│ 📉 Lỗi sai phổ biến giảm:                    ___%        │
│ 👩‍🏫 GV mở dashboard:                          ___/tuần   │
│ 👨‍👩‍👧 PH mở báo cáo:                           ___%        │
│ 😊 NPS giáo viên:                            ___/10      │
│ 😊 NPS phụ huynh:                            ___/10      │
│ ⚙️  Uptime:                                   ___%        │
│ 🛡️  Vi phạm AI Socratic:                      0          │
│ 🛡️  Rò rỉ dữ liệu:                            0          │
└──────────────────────────────────────────────────────────┘
```

→ Slide này phải có trong bài thuyết trình (slide #X — Kết quả pilot).

---

## 8. Cách thu thập dữ liệu

### Tự động (từ DB + analytics)
- Tỷ lệ HS active, số phiên, số bước gợi ý, uptime, latency, AI violation rate
- → Dashboard nội bộ trong app (chỉ admin xem)

### Thủ công (khảo sát cuối pilot)
- Form Google đơn giản gửi GV + PH
- Phỏng vấn ngắn 5-10 phút mỗi PH (em gái làm)

### Quote (qualitative)
- Em gái ghi chép lại mọi phản hồi đáng nhớ trong group Zalo lớp
- Có thể quay video phỏng vấn 30-60 giây với 1-2 PH (cho video demo)

→ Đọc tiếp: [03-architecture/ARCHITECTURE.md](../03-architecture/ARCHITECTURE.md)
