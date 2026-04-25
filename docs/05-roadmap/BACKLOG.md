# Backlog — Sau MVP

> Ý tưởng để dành cho sau cuộc thi. **KHÔNG làm trong sprint 9 ngày.**

---

## Phase 2 (Tháng 5-6/2026 nếu thắng)

### Sản phẩm
- [ ] Mở rộng môn: Tiếng Việt, Tiếng Anh
- [ ] Mở rộng lớp: 1, 2, 3, 5
- [ ] Voice chat (HS đọc to, AI nghe)
- [ ] Nhận diện chữ viết tay tiếng Việt chính xác hơn (specialized model)
- [ ] Game hóa: huy hiệu, streak, level
- [ ] Trang HS riêng (đăng nhập, không cần PH ngồi cạnh)
- [ ] Multi-class cho 1 GV (toàn khối)

### Tech
- [ ] Test E2E (Playwright)
- [ ] Test unit (Vitest)
- [ ] CI/CD strict
- [ ] Upstash Redis cho rate limit + cache
- [ ] PostHog cho funnel analysis
- [ ] Field-level encryption cho PII
- [ ] Multi-region (Cloudflare)
- [ ] Database read replica
- [ ] Error budget + SLO

### Pedagogy
- [ ] Adaptive ZPD (AI tự điều chỉnh độ khó từ history)
- [ ] So sánh hiệu quả với nhóm control
- [ ] Hợp tác với khoa Tiểu học ĐHSP nghiên cứu chính thức
- [ ] Xuất bản paper hội thảo

### Compliance
- [ ] DPIA chính thức theo Nghị định 13/2023
- [ ] Đăng ký xử lý dữ liệu trẻ em với Bộ TT&TT
- [ ] Hợp đồng pilot với trường (legal)
- [ ] Insurance cho data breach

### Business
- [ ] Pricing model (free GV, freemium PH?)
- [ ] B2B sale với phòng GD
- [ ] Marketing: parent communities, edu blogs

---

## Đã consider nhưng cắt khỏi MVP

| Idea | Lý do cắt | Khi nào reconsider |
|---|---|---|
| Web admin cho hệ thống | Không cần cho 1 lớp pilot | Khi > 5 GV |
| Forum giữa các PH | Risk moderate, ngoài scope | Phase 3 |
| Live chat GV ↔ PH | Đã có Zalo, không cần | Không bao giờ trừ phi user đòi |
| Chấm điểm tự động | Vi phạm TT 27/2020 | Không bao giờ |
| Nhật ký HS tự ghi | Quá nhiều UI cho HS lớp 4 | Khi mở rộng lớp 5+ |
| Video bài giảng | Lệch khỏi "tự học có hỗ trợ" | Không nằm trong định hướng |
| Tích hợp SCORM | Quá kỹ thuật cho người dùng VN | Không |

---

## Wishlist từ user (để nhớ, có thể rejected)

(empty for now)

→ Quay lại: [README.md](../README.md)
