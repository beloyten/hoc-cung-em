# Thông báo về dữ liệu cá nhân (Form đồng ý PH ký)

> File này: in 1 trang giấy A4, PH ký để hợp pháp hóa việc xử lý DL trẻ em.
> Tuân thủ **Nghị định 13/2023/NĐ-CP** Điều 11 (đồng ý của chủ thể dữ liệu) và **Luật Trẻ em 2016** Điều 33.

---

## CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
## Độc lập – Tự do – Hạnh phúc

---

# THƯ ĐỒNG Ý XỬ LÝ DỮ LIỆU CÁ NHÂN CỦA TRẺ EM
## Áp dụng cho ứng dụng **HocCungEm**

---

**Kính gửi:** Phụ huynh / Người giám hộ học sinh lớp 4A1

**Đơn vị triển khai:** Lê Khánh Linh — Giáo viên chủ nhiệm lớp 4A1
**Đối tác phát triển kỹ thuật:** [Tên đầy đủ user]
**Sản phẩm:** HocCungEm — ứng dụng web hỗ trợ hoạt động tự học của học sinh tiểu học

---

## 1. Mục đích xử lý dữ liệu

Chúng tôi xử lý dữ liệu của học sinh **chỉ với mục đích sau:**
- Hỗ trợ học sinh tự học tại nhà thông qua AI gia sư Socratic
- Cung cấp cho giáo viên thông tin để điều chỉnh phương pháp dạy
- Cung cấp cho phụ huynh báo cáo tiến bộ học tập của con

## 2. Loại dữ liệu thu thập

| Loại | Ví dụ | Lưu trữ |
|---|---|---|
| Thông tin định danh tối thiểu | Họ tên, lớp của học sinh | DB Supabase, mã hóa |
| Nội dung học tập | Ảnh trang vở, nội dung trao đổi với AI | DB + Storage |
| Thông tin tương tác | Thời gian, tần suất sử dụng | DB |
| Nhận xét của giáo viên | Tick "Tốt" / "Cần hỗ trợ" + ghi chú | DB |

**Chúng tôi KHÔNG thu thập:** số CMND/CCCD trẻ, địa chỉ nhà, sinh trắc học, vị trí GPS.

## 3. Bên thứ ba được chia sẻ dữ liệu

| Bên | Mục đích | Phạm vi |
|---|---|---|
| Google (Gemini API) | Sinh phản hồi AI | Chỉ nội dung trao đổi (đã ẩn danh tên đầy đủ) |
| Supabase Inc. | Lưu trữ DB + file | Toàn bộ data đã mã hóa |
| Vercel Inc. | Hosting | Không trực tiếp xử lý data |
| Resend | Gửi email báo cáo | Email PH + nội dung báo cáo |

→ Server đặt tại **Singapore**. Tất cả nhà cung cấp đều có chính sách bảo mật theo chuẩn quốc tế.

## 4. Thời gian lưu trữ

- Nội dung chat AI: **90 ngày** (tự động xóa)
- Ảnh trang vở: **180 ngày** (tự động xóa)
- Thông tin định danh: cho đến khi PH yêu cầu xóa hoặc HS chuyển lớp/trường

## 5. Quyền của Phụ huynh / Người giám hộ

PH có quyền:
- ✅ **Xem** toàn bộ dữ liệu của con bất cứ lúc nào (mục Cài đặt → Dữ liệu)
- ✅ **Yêu cầu chỉnh sửa** thông tin sai
- ✅ **Yêu cầu xóa** toàn bộ dữ liệu (xử lý trong 30 ngày)
- ✅ **Rút lại đồng ý** này bất cứ lúc nào (tài khoản con sẽ bị vô hiệu hóa)
- ✅ **Khiếu nại** với cơ quan chức năng nếu cho rằng quyền bị xâm phạm

## 6. Bảo mật

- Dữ liệu được **mã hóa** khi truyền (TLS 1.3) và khi lưu trữ
- Chỉ giáo viên dạy trực tiếp con và chính PH mới truy cập được data của HS
- Có hệ thống audit log mọi truy cập dữ liệu nhạy cảm
- Trong trường hợp xảy ra sự cố bảo mật, chúng tôi sẽ thông báo trong vòng 24 giờ

## 7. Liên hệ

- **Người chịu trách nhiệm:** Lê Khánh Linh — GV 4A1 — SĐT: [...]
- **Phụ trách kỹ thuật:** [Tên user] — Email: `security@hoccungem.vn`

---

## XÁC NHẬN ĐỒNG Ý

Tôi tên là: ________________________________________________
Là ☐ Mẹ ☐ Bố ☐ Người giám hộ hợp pháp của học sinh: __________________
Lớp: 4A1 — Trường: _________________________________________

**Tôi xác nhận:**

☐ Tôi đã đọc, hiểu và đồng ý với toàn bộ nội dung Thư đồng ý này.

☐ Tôi cho phép HocCungEm thu thập, lưu trữ và xử lý các dữ liệu nêu tại Mục 2 của con tôi cho mục đích nêu tại Mục 1.

☐ Tôi hiểu tôi có quyền rút lại đồng ý này bất cứ lúc nào.

☐ Tôi cam kết là cha/mẹ/người giám hộ hợp pháp của học sinh nêu trên.

Ngày ___ tháng ___ năm 2026

**Chữ ký Phụ huynh:**

(Ký và ghi rõ họ tên)

____________________________________

---

## Phần dành cho GV

☐ Đã nhận thư đồng ý ngày __/__/2026
☐ Đã nhập tài khoản PH vào hệ thống và xác minh liên kết PH ↔ HS

Chữ ký GV: ____________________

---

→ Quay về: [README.md](../README.md)
