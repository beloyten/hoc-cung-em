# User Stories — HocCungEm MVP

Format: **Là [persona], tôi muốn [hành động], để [giá trị].**

Priority: **P0** = bắt buộc cho MVP · **P1** = nên có · **P2** = backlog

---

## 👩‍🏫 Giáo viên (Cô Linh)

### Onboarding & quản lý lớp
- **GV-01 (P0)** — Là GV, tôi muốn đăng nhập bằng email + mật khẩu, để truy cập hệ thống an toàn.
- **GV-02 (P0)** — Là GV, tôi muốn tạo một lớp mới với tên + khối, để bắt đầu sử dụng.
- **GV-03 (P0)** — Là GV, tôi muốn thêm danh sách học sinh (nhập tay hoặc CSV), để hệ thống biết các em.
- **GV-04 (P0)** — Là GV, tôi muốn nhận một mã lớp + link để gửi cho phụ huynh, để PH tham gia dễ dàng.
- **GV-05 (P1)** — Là GV, tôi muốn xem danh sách PH đã tham gia / chưa, để chủ động nhắc nhở.

### Tạo chủ đề tự học
- **GV-06 (P0)** — Là GV, tôi muốn tạo chủ đề tự học cho tuần (vd: "Phép cộng có nhớ trong phạm vi 10000"), để AI biết ngữ cảnh khi dẫn dắt HS.
- **GV-07 (P1)** — Là GV, tôi muốn upload tài liệu/đề bài cho chủ đề (PDF/ảnh), để AI có ngữ cảnh chính xác hơn.

### Dashboard & insight
- **GV-08 (P0)** — Là GV, tôi muốn xem nhanh trong 1 màn hình: số HS đã/chưa nộp ảnh vở, số HS hỏi AI, để nắm tình hình lớp.
- **GV-09 (P0)** — Là GV, tôi muốn xem **top 3-5 lỗi sai phổ biến** của lớp tuần này, để biết dạy lại phần gì.
- **GV-10 (P0)** — Là GV, tôi muốn xem chi tiết từng HS: ảnh vở, lịch sử hỏi AI, để hiểu sâu trường hợp cá nhân.
- **GV-11 (P0)** — Là GV, tôi muốn tick "Tốt / Cần hỗ trợ" cho từng HS trong vài giây, để xác nhận đánh giá chủ quan của mình.
- **GV-12 (P1)** — Là GV, tôi muốn xem heatmap kỹ năng yếu theo chủ đề, để theo dõi tiến triển dài hạn.
- **GV-13 (P0)** — Là GV, tôi muốn nhận **gợi ý điều chỉnh bài giảng tuần sau** (do AI sinh từ data lớp), để dạy hiệu quả hơn.

### Cài đặt
- **GV-14 (P1)** — Là GV, tôi muốn ẩn 1 HS khỏi báo cáo (vd: HS chuyển trường), để dữ liệu sạch.
- **GV-15 (P2)** — Là GV, tôi muốn xuất báo cáo PDF cuối tháng, để lưu hồ sơ.

---

## 👨‍👩‍👧 Phụ huynh (Anh Hùng)

### Onboarding
- **PH-01 (P0)** — Là PH, tôi muốn đăng nhập bằng email + magic link, để không phải nhớ mật khẩu.
- **PH-02 (P0)** — Là PH, tôi muốn nhập mã lớp giáo viên gửi, để liên kết với con.
- **PH-03 (P0)** — Là PH, tôi muốn xác nhận con của mình từ danh sách HS lớp, để hệ thống ghép đúng.
- **PH-04 (P0)** — Là PH, tôi muốn cài app vào màn hình chính điện thoại, để mở nhanh như app thật.

### AI Socratic
- **PH-05 (P0)** — Là PH, tôi muốn mở chat AI cho con, để con được dẫn dắt khi bí.
- **PH-06 (P0)** — Là PH, tôi muốn chụp ảnh đề bài và gửi cho AI, để không phải gõ lại.
- **PH-07 (P0)** — Là PH, tôi muốn xem AI trả lời theo từng bước nhỏ (streaming), để con không phải chờ.
- **PH-08 (P0)** — Là PH, tôi muốn AI **không bao giờ** đưa đáp án thẳng, để con thực sự hiểu bài.
- **PH-09 (P1)** — Là PH, tôi muốn xem lại lịch sử các phiên chat của con, để biết con đã hỏi gì.

### Upload ảnh vở
- **PH-10 (P0)** — Là PH, tôi muốn chụp/upload ảnh vở của con sau khi con tự học xong, để cô giáo thấy.
- **PH-11 (P0)** — Là PH, tôi muốn chọn chủ đề + ngày khi upload, để dữ liệu được tổ chức.
- **PH-12 (P1)** — Là PH, tôi muốn upload nhiều ảnh cùng lúc, để tiết kiệm thời gian.

### Báo cáo
- **PH-13 (P0)** — Là PH, tôi muốn nhận báo cáo tuần về con (in-app), với nội dung **cá nhân hóa** không chung chung, để biết con học thế nào.
- **PH-14 (P0)** — Là PH, tôi muốn báo cáo có gợi ý hành động cụ thể (vd: "Cuối tuần luyện phép X"), để biết hỗ trợ thế nào.
- **PH-15 (P1)** — Là PH, tôi muốn nhận báo cáo qua email, để khỏi phải vào app.

---

## 🧒 Học sinh (gián tiếp qua PH)

> Học sinh **không có tài khoản riêng** trong MVP. Tương tác qua điện thoại của phụ huynh.

- **HS-01 (P0, gián tiếp)** — Là HS, tôi muốn AI hỏi tôi từng bước nhỏ, để tôi tự nghĩ ra đáp án.
- **HS-02 (P0, gián tiếp)** — Là HS, tôi muốn AI khen khi tôi làm đúng, để có động lực tiếp tục.
- **HS-03 (P0, gián tiếp)** — Là HS, tôi muốn AI dùng từ ngữ thân thiện (xưng "em"), để cảm thấy gần gũi.
- **HS-04 (P1, gián tiếp)** — Là HS, tôi muốn AI giải thích bằng ví dụ trực quan (con vật, đồ vật), để dễ hình dung.

---

## 🤖 Hệ thống / AI

- **SYS-01 (P0)** — Là hệ thống, tôi phải đảm bảo prompt Socratic được áp dụng nhất quán cho mọi cuộc chat.
- **SYS-02 (P0)** — Là hệ thống, tôi phải log mọi tương tác AI: HS nào, bài gì, hỏi gì, AI trả lời gì.
- **SYS-03 (P0)** — Là hệ thống, tôi phải sinh insight cho GV cuối mỗi tuần (cron job).
- **SYS-04 (P0)** — Là hệ thống, tôi phải sinh báo cáo PH cuối mỗi tuần (cron job).
- **SYS-05 (P0)** — Là hệ thống, tôi phải bảo vệ dữ liệu HS bằng RLS (PH chỉ thấy con mình, GV chỉ thấy lớp mình).
- **SYS-06 (P0)** — Là hệ thống, tôi phải có "AI guard" — chặn mọi câu trả lời thẳng/đáp án từ LLM.
- **SYS-07 (P1)** — Là hệ thống, tôi phải rate limit mỗi PH 100 messages/ngày, để tránh lạm dụng.
- **SYS-08 (P1)** — Là hệ thống, tôi phải mã hóa khi lưu trữ thông tin nhạy cảm.

---

## Tổng kết priority

- **P0:** 30 stories — bắt buộc trong MVP
- **P1:** 9 stories — làm nếu còn thời gian
- **P2:** 1+ stories — backlog

→ Đọc tiếp: [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md)
