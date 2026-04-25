# Visual Assets Guide

> Danh sách hình ảnh / icon / mockup cần chuẩn bị. Có thể nhờ Figma/Canva.

---

## 1. Logo & branding

| Asset | Mô tả | Format | Where |
|---|---|---|---|
| Logo HocCungEm | Chữ cách điệu + icon đám mây nhỏ | SVG + PNG | Slide bìa, app, poster |
| Logo nhỏ (favicon) | 32x32, 192x192, 512x512 | PNG | PWA manifest |
| Open Graph image | 1200x630 với slogan | PNG | OG meta |

**Style:**
- Chữ "HocCungEm": font Be Vietnam Pro Bold
- Icon đám mây trắng (gợi "Cô Mây")
- Background xanh navy hoặc gradient navy → light blue

---

## 2. Mockup app (cho slides)

| # | Mockup | Slide |
|---|---|---|
| 1 | Chat với Cô Mây trên điện thoại | 7 |
| 2 | Dashboard GV trên laptop | 8 |
| 3 | Email weekly report | 9 |
| 4 | Upload ảnh vở | 7 phụ |
| 5 | Insight card cho GV | 8 phụ |

**Tool:** Figma (export PNG @2x) hoặc dùng screenshot thật từ webapp khi đã build xong.

---

## 3. Sơ đồ minh họa

| Sơ đồ | Slide | Format |
|---|---|---|
| Hộp đen tự học (3 nhân vật + dấu ?) | 2 | SVG |
| Vòng tròn 3 nhân vật khép kín | 6 | SVG có animation reveal |
| Bản đồ vị trí thị trường (2D) | 4 | SVG |
| 4 lớp bảo mật | 14 | SVG |
| Roadmap timeline | 17 | SVG |

---

## 4. Chân dung học giả (Slide 11)

| Người | Năm | Source ảnh |
|---|---|---|
| Lev Vygotsky | 1896-1934 | Wikipedia (public domain) |
| Socrates | 470-399 BC | Tượng cổ điển (public domain) |
| Paul Black | đương đại | Cambridge bio (cite) |
| John Sweller | đương đại | UNSW bio (cite) |

→ Dùng ảnh trắng đen, kích thước đồng đều, cite nguồn nhỏ ở góc.

---

## 5. Icon set

Lucide Icons (open source, dùng trong app + slide):
- 🧒 user-graduate (HS)
- 👩 user-heart (PH)
- 👩‍🏫 graduation-cap (GV)
- 🤖 sparkles (AI)
- 📷 camera (upload)
- 📊 bar-chart (insight)
- 📧 mail (báo cáo)
- 🔒 shield-check (bảo mật)
- ⚖️ scale (pháp luật)

---

## 6. Screenshots cho poster

3 screenshot lớn từ webapp thật:
1. Chat HS-Cô Mây — focus vào câu hỏi gợi ý
2. Dashboard GV — focus vào insight card
3. Email PH — focus vào nội dung cá nhân hóa

→ Chụp ở D7 sau khi UI đã polish.

---

## 7. Video demo (backup)

- **Độ dài:** 5 phút
- **Quay:** D7 tối hoặc D8 sáng
- **Resolution:** 1920x1080
- **Bitrate:** ≥ 5 Mbps
- **Voiceover:** em gái thu trước, sync với màn hình

**Tool:** OBS (record laptop) + iOS screen record (record phone) → ghép FCP / Premiere → render MP4

---

## 8. QR codes

| QR | Trỏ tới | Vị trí |
|---|---|---|
| App QR | hoccungem.vn | Slide 13, poster |
| Báo cáo PDF | bit.ly/hoccungem-report | Poster |
| Demo video YouTube | bit.ly/hoccungem-demo | Slide 13 phụ |

→ Generate bằng qr-code-styling — match brand color.

---

## 9. Color palette

```
Navy:       #1E3A8A
Light blue: #DBEAFE
Yellow:     #FBBF24
White:      #FFFFFF
Gray text:  #374151
Success:    #10B981
Warning:    #F59E0B
Danger:     #EF4444
```

---

## 10. Font

- **Tiêu đề:** Be Vietnam Pro Bold
- **Body:** Be Vietnam Pro Regular
- **Code (slide tech):** JetBrains Mono

→ Cài cả vào PPT máy thuyết trình để không bị fallback.

→ Đọc tiếp: [REHEARSAL_CHECKLIST.md](REHEARSAL_CHECKLIST.md)
