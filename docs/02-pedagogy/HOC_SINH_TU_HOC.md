# Học sinh tự học — Triết lý & Pháp lý

> Tài liệu này giải thích vì sao HocCungEm dùng thuật ngữ **"tự học"** thay cho **"bài tập về nhà"**, và triết lý "học vì hứng thú" đằng sau.

---

## 1. Bối cảnh pháp lý

### Thông tư 28/2020/TT-BGDĐT
**Điều 26 — Hoạt động giáo dục:** Học sinh tiểu học học **2 buổi/ngày** (7-8 tiết/ngày).

**Quy định bổ sung:** Đối với học sinh học 2 buổi/ngày, **không giao bài tập về nhà** cho học sinh.

→ **Lý do:** Tránh quá tải, đảm bảo thời gian nghỉ ngơi, vui chơi, phát triển toàn diện.

### Thực tế triển khai
Dù không được giao BTVN, **học sinh vẫn cần ôn tập tại nhà** để:
- Củng cố kiến thức đã học
- Chuẩn bị cho bài học hôm sau
- Phát triển kỹ năng tự học (lifelong learning)

→ **Khoảng trống:** Có nhu cầu tự học có thật, nhưng không được "ép" → cần công cụ giúp HS **tự nguyện học vì hứng thú**.

---

## 2. Thuật ngữ chuẩn của HocCungEm

| ❌ Tránh dùng | ✅ Dùng thay |
|---|---|
| Bài tập về nhà | Hoạt động tự học tại nhà |
| BTVN | Phiên tự học |
| Homework | Tự học, ôn tập |
| Giao bài | Đề xuất chủ đề ôn tập / Gợi ý hoạt động tự học |
| Bài tập | Hoạt động luyện tập / Bài luyện |
| Làm bài | Ôn tập, luyện tập |
| Nộp bài | Chia sẻ bài làm / Chia sẻ kết quả tự học |

**Áp dụng nhất quán:**
- Tên feature, label trong UI
- Tên bảng/cột trong DB (`study_sessions`, `study_topics`, không `homeworks`)
- Tài liệu, hướng dẫn người dùng
- Báo cáo cho phụ huynh
- Slide thuyết trình, video demo

---

## 3. Triết lý "học vì hứng thú"

### Nguyên tắc
> **Học sinh tiểu học học vì:**
> - Tò mò ("tại sao?")
> - Cảm giác thành tựu ("em làm được!")
> - Được công nhận ("cô khen em!")
> - Vui vẻ ("học mà chơi")
>
> **KHÔNG phải vì:**
> - Bị ép buộc
> - Sợ điểm kém
> - So sánh với bạn

### HocCungEm áp dụng thế nào?

#### A. Không có "phải làm"
- App **gợi ý** chủ đề tự học, không **giao** bài
- HS có thể không vào app — không bị phạt, không bị nhắc tên trong dashboard
- Báo cáo PH không nói "Em An lười" → nói "Tuần này em An tự học 2/5 ngày, cha mẹ có thể cùng em chọn thời điểm phù hợp để ôn tập 10-15 phút mỗi tối"

#### B. Khen cụ thể, khen kịp thời
- AI khen từng bước nhỏ HS làm đúng
- Báo cáo PH highlight tiến bộ trước, nhắc cải thiện sau
- GV có nút "Khen riêng em này" để gửi message tích cực

#### C. Tôn trọng tốc độ riêng
- Không có "lớp đang ở tuần X, em phải theo"
- Mỗi HS có lộ trình riêng dựa trên dữ liệu
- AI điều chỉnh độ khó gợi ý theo HS

#### D. Không gamification gây áp lực
- ❌ Không huy hiệu, không cấp độ, không leaderboard
- ❌ Không streak (chuỗi ngày liên tiếp)
- ✅ Có "tiến trình kiến thức" cá nhân, chỉ HS + PH thấy

---

## 4. Đối thoại mẫu cho cuộc thi

**Câu hỏi giám khảo có thể đặt:**
> "Em không sợ vi phạm Thông tư 28/2020 sao khi sản phẩm khuyến khích HS tự học tại nhà?"

**Trả lời gợi ý:**
> "Dạ thưa thầy/cô, em đã nghiên cứu kỹ Thông tư 28/2020 và Thông tư 27/2020 trước khi thiết kế sản phẩm.
>
> HocCungEm **KHÔNG giao bài tập về nhà** cho học sinh. Sản phẩm chỉ:
> 1. Cung cấp một **trợ giảng AI** sẵn sàng hỗ trợ khi học sinh **tự nguyện** muốn ôn tập tại nhà.
> 2. Phụ huynh là người quyết định khi nào con dùng — giáo viên không 'giao' qua app.
> 3. Báo cáo cho phụ huynh dựa trên hoạt động **tự nguyện** của con — không có cơ chế phạt, không nhắc tên trong các bảng so sánh.
>
> Sản phẩm tôn trọng triết lý 'học vì hứng thú' — đây cũng chính là tinh thần của chương trình GDPT 2018: phát triển năng lực tự học, học chủ động."

---

## 5. Biến chế trong thuyết trình

Khi thuyết trình, dùng các cụm từ sau:

✅ **Mạnh, chuyên nghiệp:**
- "hoạt động tự học tự nguyện tại nhà"
- "trợ giảng AI cá nhân hóa khi học sinh cần"
- "ôn tập kiến thức theo nhịp độ riêng"
- "phát triển năng lực tự học"

✅ **Ấm áp, gần gũi:**
- "khi em muốn hiểu sâu hơn"
- "bạn đồng hành học tập"
- "trợ giảng kiên nhẫn"
- "giúp em tự khám phá đáp án"

❌ **Tránh tuyệt đối:**
- "giao bài tập"
- "bắt buộc làm"
- "phạt khi không làm"
- "ép học"

---

## 6. Tóm tắt

> HocCungEm **không vi phạm** quy định không giao BTVN.
>
> Sản phẩm hỗ trợ học sinh **tự học tự nguyện**, **vì hứng thú**, có sự đồng hành của AI Socratic — đúng tinh thần Chương trình GDPT 2018 và các Thông tư 27, 28/2020 của Bộ GD&ĐT.

→ Đọc tiếp: [SUCCESS_METRICS.md](SUCCESS_METRICS.md)
