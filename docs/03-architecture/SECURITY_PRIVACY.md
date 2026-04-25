# Security & Privacy — HocCungEm

> Trẻ em là đối tượng được pháp luật bảo vệ đặc biệt. Mọi quyết định phải đặt **lợi ích trẻ em** lên cao nhất.

---

## 1. Khung pháp lý

| Văn bản | Điểm chính | Ảnh hưởng |
|---|---|---|
| **Luật Trẻ em 2016** (Điều 33, 36, 54) | Bảo vệ thông tin riêng tư của trẻ | Cần đồng ý của cha mẹ/người giám hộ |
| **Nghị định 13/2023/NĐ-CP** | Bảo vệ dữ liệu cá nhân | Phải có DPIA, thông báo, đồng ý |
| **Thông tư 27/2020/TT-BGDĐT** | Đánh giá HS tiểu học bằng nhận xét | UI dùng nhận xét, không điểm số |
| **Thông tư 28/2020/TT-BGDĐT** | HS học 2 buổi không giao BTVN | Dùng "tự học" |

---

## 2. Phân loại dữ liệu

| Mức | Loại | Ví dụ | Bảo vệ |
|---|---|---|---|
| **🔴 Nhạy cảm cao** | Dữ liệu trẻ em | Tên HS, ảnh vở, chat, lỗi sai | RLS + Encryption at rest + Audit log |
| **🟠 Cá nhân** | Thông tin GV/PH | Email, SĐT | RLS + access log |
| **🟡 Nội bộ** | Insight, report | Aggregate data | RLS theo role |
| **🟢 Công khai** | Marketing | Tên brand, slogan | — |

---

## 3. Kiểm soát truy cập (đa lớp)

```
┌─────────────────────────────────────────────┐
│ Lớp 1: Auth (Supabase Auth + JWT)          │
├─────────────────────────────────────────────┤
│ Lớp 2: Server-side check (requireUser)     │
├─────────────────────────────────────────────┤
│ Lớp 3: Business logic check                │
├─────────────────────────────────────────────┤
│ Lớp 4: Database RLS (cuối cùng, deny-all)  │
└─────────────────────────────────────────────┘
```

→ Một bug ở 1 lớp **không** dẫn tới leak — vì còn lớp dưới.

---

## 4. Đồng ý của phụ huynh (Consent)

### Khi PH đăng ký lần đầu
Hiển thị màn hình **"Cam kết bảo vệ thông tin con em"** với checkbox:

> ☑ Tôi là cha/mẹ/người giám hộ hợp pháp của (các) cháu HS được liên kết.
> ☑ Tôi đồng ý cho HocCungEm thu thập, lưu trữ và xử lý các dữ liệu sau **chỉ với mục đích hỗ trợ học tập**:
>   - Họ tên, lớp của con
>   - Ảnh bài làm trên vở
>   - Nội dung trao đổi giữa con và AI gia sư
>   - Nhận xét của giáo viên
> ☑ Tôi hiểu tôi có quyền **yêu cầu xóa toàn bộ dữ liệu** bất cứ lúc nào.

→ Lưu timestamp + version consent vào `parents.consent_signed_at`, `consent_version`.

---

## 5. Quyền của chủ thể dữ liệu (PH thay mặt HS)

PH có thể:
1. **Xem** toàn bộ dữ liệu của con (Dashboard PH)
2. **Tải về** (export ZIP — sau MVP)
3. **Yêu cầu xóa** (xóa cứng trong 30 ngày)
4. **Rút lại đồng ý** → tài khoản con bị disable

UI: trang `/parent/settings/data` với 3 nút này.

---

## 6. Mã hóa

| Layer | Phương thức |
|---|---|
| **Transit** | TLS 1.3 (Vercel + Supabase mặc định) |
| **At rest — DB** | Postgres encryption (Supabase quản) |
| **At rest — Storage** | S3-compatible encryption (Supabase quản) |
| **Backup** | Supabase daily backup (Pro plan) |

**MVP** không tự mã hóa thêm field-level. Sau này nếu scale lớn → encrypt PII với pgcrypto.

---

## 7. Audit log

Ghi lại mọi hành động nhạy cảm vào `audit_logs`:

| Action | Khi nào ghi |
|---|---|
| `view_student` | GV xem chi tiết HS |
| `view_chat` | GV xem chat AI của HS |
| `export_data` | PH/GV export |
| `delete_student` | Xóa HS |
| `update_consent` | PH thay đổi consent |
| `failed_login` | Đăng nhập sai |
| `rls_violation` | RLS chặn — nghi ngờ tấn công |

Retention: 1 năm (cron xóa).

---

## 8. AI Safety

Đã chi tiết trong [AI_INTEGRATION.md](AI_INTEGRATION.md), tóm tắt:
- AI Guard chặn output có hại
- Không gửi PII vào prompt
- Log mọi guard violation
- Fallback an toàn khi AI fail

---

## 9. OWASP Top 10 — checklist

| Risk | Mitigation |
|---|---|
| A01 Broken Access Control | RLS + 4-layer auth |
| A02 Crypto Failures | TLS + DB encryption |
| A03 Injection | Drizzle (parameterized) + Zod validation |
| A04 Insecure Design | Threat model trong doc này |
| A05 Misconfiguration | Env var review checklist |
| A06 Vulnerable Deps | Dependabot + `pnpm audit` weekly |
| A07 Auth Failures | Supabase Auth + email verify |
| A08 Data Integrity | Migration review + audit log |
| A09 Logging Failures | Sentry + audit_logs |
| A10 SSRF | Next.js không có user-controlled URL fetch |

---

## 10. Incident response

### Nếu phát hiện leak
1. **Trong 1h:** Disable account/feature liên quan
2. **Trong 24h:** Email báo PH/GV bị ảnh hưởng
3. **Trong 72h:** Báo cáo Bộ Công an (nếu trên 1000 records — theo Nghị định 13/2023)
4. **Trong 7d:** Postmortem + fix + thông báo công khai

### Contact
- Person in charge: [User name]
- Email báo lỗi bảo mật: `security@hoccungem.[domain]`

---

## 11. Storage cleanup (cron)

| Loại data | Retention | Cron |
|---|---|---|
| `ai_messages` | 90 ngày | Daily delete > 90d |
| `notebook_uploads` (file) | 180 ngày | Weekly delete files > 180d (giữ metadata) |
| `audit_logs` | 365 ngày | Daily delete > 365d |
| Soft-deleted students | 30 ngày | Daily hard-delete > 30d |

---

## 12. Pre-launch security checklist

- [ ] RLS bật trên 100% bảng có PII
- [ ] Service role key chỉ dùng ở server, có trong `.env.local` không có trong code
- [ ] Tất cả env var liệt kê trong `ENV_VARIABLES.md`
- [ ] Sentry catch lỗi production
- [ ] CSP header config trong Next.js
- [ ] Rate limit cho chat endpoint
- [ ] Tested với 2 GV / 2 PH khác account → không leak
- [ ] PH consent screen test xong
- [ ] Privacy notice đăng ở footer
- [ ] Cron cleanup test

→ Đọc tiếp: [SETUP.md](../04-development/SETUP.md)
