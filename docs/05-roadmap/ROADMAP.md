# Roadmap — 9 ngày sprint

> **Hôm nay:** Thứ 7, 25/04/2026
> **Deadline:** Thứ 2, 04/05/2026 (webapp working, docs xong, demo sẵn sàng)
> **Tổng:** 9 ngày
>
> Triết lý: **AI làm thay người làm → tốc độ tối đa, scope tối thiểu.**

---

## Tổng quan theo ngày

| Ngày | Thứ | Mục tiêu chính | Deliverable |
|---|---|---|---|
| **D0** | T7 25/04 | Docs + scaffold | Folder docs xong, Next.js project init |
| **D1** | CN 26/04 | Auth + DB schema + RLS | GV/PH đăng ký được, RLS test pass |
| **D2** | T2 27/04 | Module Lớp + HS + Topic | GV tạo lớp, thêm HS, tạo chủ đề |
| **D3** | T3 28/04 | Module Chat AI (Cô Mây) | PH chat với AI, streaming OK |
| **D4** | T4 29/04 | AI Guard + Vision + Upload ảnh | Upload ảnh vở, AI guard hoạt động |
| **D5** | T5 30/04 | Dashboard GV + tick review | GV xem ảnh + tick + dashboard cơ bản |
| **D6** | T6 01/05 | Insight + Weekly Report (cron) | Cron sinh insight tuần, gửi email |
| **D7** | T7 02/05 | Polish UI/UX + PWA + bug fix | App mượt, install được PWA |
| **D8** | CN 03/05 | Slides + Demo script + Rehearsal | PPT xong, em gái diễn tập |
| **D9** | T2 04/05 | **Trình bày sáng** + Buffer chiều | Nộp + thuyết trình |

---

## Chi tiết từng ngày

### D0 — T7 25/04 (HÔM NAY) ✅ đang làm
- [x] Chốt scope, tech stack, brand
- [x] Đăng ký các services (Supabase, Vercel, Gemini, Resend, Sentry)
- [x] Tạo folder `docs/` với toàn bộ tài liệu
- [ ] Scaffold Next.js project (`pnpm create next-app`)
- [ ] Cài deps theo TECH_STACK.md
- [ ] Setup Tailwind, shadcn, ESLint, Prettier
- [ ] Setup Drizzle + connect Supabase
- [ ] Init Sentry
- [ ] First commit + push GitHub
- [ ] Vercel auto deploy thành công (trang trắng OK)

### D1 — CN 26/04
- [ ] Drizzle schema cho 14 bảng (theo DATABASE_SCHEMA.md)
- [ ] Generate + apply migration
- [ ] Viết RLS policies (theo RLS_POLICIES.md)
- [ ] Apply RLS qua Supabase SQL editor
- [ ] Supabase Auth: setup email/password
- [ ] Trang `/register-teacher` + `/register-parent`
- [ ] Trang `/login`
- [ ] Middleware redirect theo role
- [ ] Test: tạo 2 GV, 2 PH thật → query data → RLS chặn đúng

### D2 — T2 27/04
- [ ] Server Action `createClass` + UI
- [ ] Server Action `addStudent` (thêm 1 + bulk CSV)
- [ ] Trang GV: `/teacher/classes/[id]` — danh sách HS
- [ ] Server Action `createTopic` + UI
- [ ] Server Action `joinClassAsParent` (PH nhập join code)
- [ ] Server Action `linkParentToStudent`
- [ ] PH chọn con → vào trang home

### D3 — T3 28/04
- [ ] Setup Vercel AI SDK + Gemini client
- [ ] Viết system prompt v1.0 (Cô Mây)
- [ ] Trang `/parent/chat/[sessionId]`
- [ ] Component `ChatWindow` + streaming
- [ ] Server Action `startSession` + persist messages
- [ ] Test 10 đoạn hội thoại đa dạng → kiểm chất lượng prompt

### D4 — T4 29/04
- [ ] AI Guard module
- [ ] Retry logic khi guard fail
- [ ] Trang `/parent/upload` — chọn HS, chọn topic, chụp/chọn ảnh
- [ ] Component `UploadCamera` (mobile camera input)
- [ ] Server Action `getUploadSignedUrl` + `confirmUpload`
- [ ] Vision: gửi ảnh vào chat (multimodal)
- [ ] Test: PH chụp đề bài, AI nhận diện và hỏi từng bước

### D5 — T5 30/04
- [ ] Trang `/teacher/dashboard` — tổng quan lớp
- [ ] Trang `/teacher/reviews` — feed ảnh upload
- [ ] Component `ReviewQueue` với 2 button "👍 Tốt" / "🤝 Cần hỗ trợ"
- [ ] Server Action `tickReview`
- [ ] Trang `/teacher/students/[id]` — xem timeline 1 HS
- [ ] Lọc theo tuần / chủ đề

### D6 — T6 01/05
- [ ] Module `insights.ts` — gen insight tuần với structured output
- [ ] Cron `/api/cron/weekly-insights` (test bằng manual call trước)
- [ ] Trang `/teacher/insights` — xem insight lịch sử
- [ ] Module `reports.ts` — gen báo cáo PH cá nhân hóa
- [ ] Cron `/api/cron/weekly-reports`
- [ ] Tích hợp Resend gửi email
- [ ] Trang `/parent/reports` — xem lịch sử báo cáo
- [ ] Test cron với data seed

### D7 — T7 02/05
- [ ] Audit toàn UI: alignment, color, font size cho HS lớp 4
- [ ] Loading states, empty states, error states
- [ ] Setup Serwist (PWA): manifest, service worker
- [ ] Test install PWA trên iOS + Android
- [ ] Trang landing `/` đẹp (cho jury vào xem)
- [ ] Trang `/privacy` (cần cho jury hỏi)
- [ ] Lighthouse audit → fix điểm yếu
- [ ] Bug bash: tự test 30 phút end-to-end
- [ ] Setup analytics (Vercel Analytics)
- [ ] Sentry test alert OK

### D8 — CN 03/05
- [ ] Slides PPT theo PPT_OUTLINE.md (15-20 slide)
- [ ] Speaking script cho em gái (timing)
- [ ] Demo flow trên stage (4 màn hình ~5 phút)
- [ ] Backup plan: video record demo (offline)
- [ ] Poster A0 (nếu cần)
- [ ] Em gái diễn tập 3 lượt
- [ ] Q&A mock với 20 câu hỏi (QA_PREPARATION.md)
- [ ] Test webapp trên thiết bị sẽ trình bày
- [ ] In tài liệu giấy nếu cần

### D9 — T2 04/05
- [ ] Sáng: thuyết trình
- [ ] Chiều: buffer cho mọi sự cố

---

## Đường găng (critical path)

```
Auth → Schema → Class/Student → Chat → Guard → Upload → Dashboard → Cron → Polish
```

**Nếu chậm:** cắt cron (làm thủ công cho demo), cắt PWA install, cắt landing đẹp.

**Không được cắt:**
- Auth + RLS (security cốt lõi)
- Chat Cô Mây (giá trị cốt lõi)
- Upload ảnh (touchpoint cốt lõi)
- Dashboard GV (giá trị cho jury)

---

## Risk & contingency

| Risk | Plan B |
|---|---|
| Gemini quota hết | Fallback Cô Mây canned response cho demo |
| Cron Vercel lỗi | Trigger manual qua button "Generate insight ngay" |
| Mobile UI lỗi | Demo trên laptop / iPad |
| Wifi hội trường tệ | Video demo sẵn + screenshot |

→ Đọc tiếp: [PROGRESS.md](PROGRESS.md)
