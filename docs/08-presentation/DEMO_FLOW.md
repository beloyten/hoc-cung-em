# Demo Flow — Chi tiết kỹ thuật

> Phiên bản kỹ thuật của [DEMO_SCRIPT.md](../06-competition/DEMO_SCRIPT.md). Anh chuẩn bị môi trường.

---

## 1. Setup môi trường (D7 tối)

### Devices
- **Laptop:** Macbook anh, kết nối HDMI/wireless lên máy chiếu
- **Phone:** Android (Samsung) đã cài PWA, screen mirror sẵn lên laptop
- **Backup phone:** iPhone — phòng Android hỏng

### Network
- 4G hotspot từ phone backup → laptop (không tin wifi hội trường)
- Test speed ≥ 5 Mbps

### Browsers
| Tab | Tài khoản | Ghi chú |
|---|---|---|
| 1 | GV `co.linh@hoccungem.vn` | Chrome thường |
| 2 | PH `me.an@hoccungem.vn` | Chrome incognito |
| 3 | Landing | hoccungem.vn |

→ Cả 3 mở sẵn, đăng nhập sẵn, đã pre-warm.

---

## 2. Data preparation

### Lớp 4A1 (production seed)
- Topic tuần demo: **"Phép cộng có nhớ trong phạm vi 10000"**
- 5 HS: An, Bình, Châu, Dung, Em
- Đã có sẵn:
  - 8 phiên tự học hoàn thành (đa dạng lỗi)
  - 5 ảnh vở đã được tick review
  - 1 weekly insight đã sinh sẵn

### Em An (focus)
- 3 phiên tự học hoàn thành
- 2 ảnh vở (1 đúng, 1 có lỗi quên nhớ)
- 1 weekly report đã gửi email

→ Demo dùng An làm câu chuyện chính.

---

## 3. Thứ tự thao tác

| # | Người | Thao tác | Slide để show |
|---|---|---|---|
| 1 | Em gái | Mở landing trên laptop | Browser tab 3 |
| 2 | Em gái | Mở phone (đã share screen) | Phone trên màn hình |
| 3 | Em gái | Mở app PWA → chọn An → "Học cùng Cô Mây" | Phone |
| 4 | Em gái | Bấm icon máy ảnh → chọn ảnh đề (đã trong gallery) | Phone |
| 5 | Em gái | Gửi với caption "Con bí ạ" | Phone |
| 6 | Cô Mây | Stream câu hỏi | Phone |
| 7 | Em gái | Gõ thay An theo script | Phone |
| 8 | Cô Mây | Tiếp tục hỏi → cuối cùng An tự nói đáp số | Phone |
| 9 | Em gái | "Gửi ảnh vở cô xem" → chụp ảnh vở (gallery) → gửi | Phone |
| 10 | Em gái | Switch sang laptop browser GV → refresh | Laptop |
| 11 | Em gái | Vào Reviews → click ảnh mới → tick 👍 | Laptop |
| 12 | Em gái | Click Insight tuần | Laptop |
| 13 | Em gái | Switch sang phone → mở Gmail → mở email weekly report | Phone |
| 14 | Em gái | Trở lại slide PPT | Slide 14 |

---

## 4. Pre-warm checklist (5 phút trước lên sân khấu)

- [ ] Tất cả 3 tab browser refresh + login confirm
- [ ] Phone unlock, app PWA mở sẵn
- [ ] Camera app test 1 ảnh
- [ ] Gmail account đã có email weekly report mới nhất ở top
- [ ] Volume tắt mọi thiết bị (không có ting ting Zalo lên)
- [ ] Notification mode: Do Not Disturb
- [ ] Gemini API: gọi 1 test request thành công
- [ ] Backup video MP4 đã queue sẵn ở 0:00

---

## 5. Sự cố & xử lý real-time

| Sự cố | Action | Người |
|---|---|---|
| Phone không share screen | Cắm cáp HDMI dự phòng | Anh |
| Gemini timeout > 10s | Im lặng + nói "AI đang nghĩ kỹ" | Em gái |
| Gemini lỗi 500 | Switch nói "Đây là MVP, có lúc cần fallback. Em xin show câu trả lời mẫu" → bật slide có screenshot | Em gái + Anh |
| Wifi/4G mất hoàn toàn | "Em xin chuyển sang video demo" → bật MP4 | Em gái + Anh |
| App chạy chậm | Continue, đừng ngó đồng hồ. Jury không biết app **nên** nhanh hay chậm | Em gái |
| Đáp án AI ra lạ | Bình tĩnh: "Đây chính là ví dụ AI Guard sẽ retry. Trong sản phẩm, lớp này sẽ bắt." → next | Em gái |

---

## 6. Sau demo

- Switch lại slide 14
- Em gái: "Em vừa show 5 phút trải nghiệm thực tế. Em quay lại phần bảo mật..."
- Anh đứng bên sân khấu sẵn nếu jury hỏi kỹ thuật

→ Đọc tiếp: [BACKUP_PLAN.md](BACKUP_PLAN.md)
