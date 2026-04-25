# Giải pháp HocCungEm

## 1. Một câu định nghĩa giải pháp

> **HocCungEm** gắn thêm một "lớp thông minh" lên trên cách học truyền thống: khi học sinh tự học tại nhà, **AI Socratic** dẫn dắt em vượt qua khó khăn (không cho đáp án); mọi điểm chạm được ghi nhận để **giáo viên có insight** điều chỉnh dạy học và **phụ huynh có báo cáo cá nhân hóa** mỗi tuần.

---

## 2. Triết lý thiết kế

### 6 nguyên tắc bất di bất dịch

1. **Giấy là trung tâm, AI là vệ tinh.** Học sinh vẫn viết vở. Không ép đổi thói quen.
2. **AI không bao giờ trả lời thẳng.** Chỉ hỏi lại, gợi mở, dẫn dắt theo phương pháp Socrates.
3. **AI hoạt động trong vùng phát triển gần (ZPD).** Gợi ý vừa đủ để em tự làm được — không quá ít (em vẫn bí), không quá nhiều (làm hộ em).
4. **Track ít, hiểu nhiều.** Chỉ thu 3 điểm chạm: ảnh vở, log hỏi AI, tick nhanh của giáo viên. Không track mọi thứ.
5. **Báo cáo phải cá nhân hóa.** Không bao giờ "Em học tốt" chung chung — phải nói rõ "Tuần này em vướng phép cộng có nhớ, đã hỏi AI 4 lần, đến lần 4 tự giải được".
6. **Không thay thế giáo viên.** AI là trợ giảng — quyết định sư phạm vẫn ở giáo viên.

---

## 3. Vòng lặp đóng (kiến trúc cốt lõi)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   👩‍🏫 GIÁO VIÊN                                                 │
│   Dạy trên lớp + giao chủ đề tự học (như bình thường)          │
│           │                                                    │
│           ▼                                                    │
│   🧒 HỌC SINH tự học (giấy/vở)                                  │
│           │                                                    │
│      Bí?  ─┴─  Hỏi AI (qua điện thoại phụ huynh)               │
│           │                                                    │
│           ▼                                                    │
│   🤖 AI SOCRATIC: gợi ý từng bước, không cho đáp án             │
│      → Log: HS nào, bài gì, bí ở bước nào, gợi ý gì            │
│           │                                                    │
│           ▼                                                    │
│   📸 PHỤ HUYNH chụp ảnh vở khi con làm xong                     │
│           │                                                    │
│           ▼                                                    │
│   📊 HỆ THỐNG tổng hợp:                                         │
│      • Ai đã ôn tập / chưa                                     │
│      • Lỗi sai phổ biến (từ log AI + ảnh vở)                   │
│      • Điểm vướng của từng em                                  │
│           │                                                    │
│           ├──► 👩‍🏫 GV: Dashboard insight + gợi ý điều chỉnh     │
│           │                                                    │
│           └──► 👨‍👩‍👧 PH: Báo cáo tuần cá nhân hóa cho từng con   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. AI đóng vai trò gì — chi tiết

### 4.1 Cho HỌC SINH (qua phụ huynh): "Trợ giảng kiên nhẫn"

**Quy trình tương tác:**
1. Học sinh tự làm bài trên giấy.
2. Khi bí, phụ huynh giúp em mở app, **chụp đề bài** hoặc **gõ câu hỏi**.
3. AI **không trả lời thẳng**, mà:
   - Hỏi lại em đã hiểu gì
   - Gợi ý phép tính / khái niệm liên quan
   - Đưa ví dụ tương tự dễ hơn
   - Khuyến khích em thử lại
4. Mỗi bước, AI ghi log: bài gì, bí ở đâu, gợi ý mức nào.

**Ví dụ thật (Toán lớp 4 — Phép cộng có nhớ):**
```
HS: "Em không biết tính 3456 + 2789"
AI: "Em thử tách thành cộng từng cột nhé. Bắt đầu từ cột đơn vị,
     6 + 9 bằng bao nhiêu? Em viết ra trước nha."
HS: "15 ạ"
AI: "Đúng rồi! Bây giờ 15 lớn hơn 9, mình làm gì với phần dư
     ở cột chục?"
HS: "À nhớ 1 phải không ạ?"
AI: "Chính xác! Em viết 5 ở cột đơn vị, nhớ 1 sang cột chục.
     Giờ thử cột chục: 5 + 8 + 1 (vừa nhớ) bằng?"
...
```

**Nguyên tắc cốt lõi của prompt:**
- ❌ Không bao giờ đưa đáp án cuối
- ❌ Không bao giờ làm hộ phép tính
- ✅ Luôn hỏi lại để em tự suy nghĩ
- ✅ Khen khi em đúng (positive reinforcement)
- ✅ Dùng ngôn ngữ trẻ em lớp 4 (xưng "em", thân thiện, không thuật ngữ)

### 4.2 Cho GIÁO VIÊN: "Trợ lý phân tích lớp"

- AI **đọc log toàn lớp** mỗi cuối tuần và sinh insight:
  - "Tuần này 12/30 em hỏi AI về phép nhân với số có 2 chữ số"
  - "Top 3 lỗi sai phổ biến: cộng có nhớ (8 em), so sánh phân số (5 em), hình chữ nhật và hình vuông (4 em)"
  - "Em An hỏi AI nhiều bất thường (15 lần) — có thể cần hỗ trợ thêm trên lớp"
- AI **gợi ý điều chỉnh bài giảng tuần sau**:
  - "Nên dành 10 phút đầu tuần ôn lại phép cộng có nhớ với ví dụ trực quan"
  - "Có thể tách nhóm: nhóm A (5 em yếu) làm bài cơ bản, nhóm B làm bài nâng cao"

### 4.3 Cho PHỤ HUYNH: "Người kể chuyện về con"

- Mỗi cuối tuần, AI sinh báo cáo **cá nhân hóa** cho từng phụ huynh:
  - "Tuần này con đã hoàn thành 4/5 buổi tự học. Con tiến bộ rõ ở phép chia, nhưng còn vướng ở phép cộng có nhớ — đã hỏi AI 4 lần và đến lần thứ 4 con tự giải được. Cha mẹ có thể cùng con luyện thêm 5-10 phút mỗi tối với phép cộng có nhớ."
- Báo cáo có **gợi ý hành động cụ thể**, không chung chung.

---

## 5. Ba điểm chạm dữ liệu (track ít, hiểu nhiều)

| # | Nguồn dữ liệu | Cái thu được | Khi nào thu |
|---|---|---|---|
| 1 | 📸 **Ảnh vở** (PH chụp) | Đã ôn tập hay chưa, làm bao nhiêu, có viết đầy đủ không | Sau khi con làm xong |
| 2 | 🤖 **Log hỏi AI** | Bí ở đâu, mức độ khó khăn, có tự vượt qua được không | Realtime khi tương tác |
| 3 | ✅ **Tick nhanh GV** | Xác nhận chất lượng (Tốt / Cần hỗ trợ) | 5-10 giây/em khi GV chấm |

→ **3 nguồn này đủ để sinh tất cả insight cần thiết**, không cần OCR phức tạp hay chấm điểm tự động (vốn dễ sai và mất uy tín).

---

## 6. Tại sao mọi người nên dùng HocCungEm?

### 👩‍🏫 Giáo viên
- ✅ Không phải đổi cách dạy
- ✅ Tiết kiệm 30-60 phút/ngày phân tích lớp
- ✅ Nắm bắt lớp **realtime**, không phải chờ kiểm tra
- ✅ Có gợi ý cụ thể để điều chỉnh, không phải "cảm tính"

### 👨‍👩‍👧 Phụ huynh
- ✅ Hỗ trợ con không cần giỏi Toán
- ✅ Biết chính xác con yếu phần nào để cùng luyện
- ✅ Báo cáo cá nhân hóa, không phải đọc thông báo chung
- ✅ AI dạy con cách tư duy, không cho đáp án → con thực sự hiểu

### 🧒 Học sinh
- ✅ Có "trợ giảng kiên nhẫn" sẵn sàng 24/7
- ✅ Không bị nản khi gặp khó
- ✅ Vẫn viết vở (không phải nhìn màn hình suốt)
- ✅ Học vì hứng thú khi được dẫn dắt đúng cách (Vygotsky ZPD)

---

## 7. So sánh với giải pháp hiện có

| Yếu tố | HocCungEm | Khan Kids/Monkey | OLM/VioEdu | ChatGPT trực tiếp |
|---|---|---|---|---|
| Phù hợp lớp học giấy | ✅ | ❌ | ❌ | ❌ |
| Không cần thiết bị cho HS | ✅ | ❌ | ❌ | ❌ |
| AI Socratic (không cho đáp án) | ✅ | ⚠️ Một phần | ❌ | ❌ |
| Insight cho GV | ✅ | ❌ | ⚠️ Cơ bản | ❌ |
| Báo cáo cá nhân hóa cho PH | ✅ | ⚠️ Chung chung | ⚠️ Chung chung | ❌ |
| Vòng lặp 3 bên (GV-PH-HS) | ✅ | ❌ | ❌ | ❌ |
| Tuân thủ TT 28/2020 (không BTVN) | ✅ | ⚠️ | ⚠️ | N/A |

---

## 8. 3 câu chốt khi giới thiệu (học thuộc)

1. **"HocCungEm không yêu cầu thay đổi phương pháp dạy học hiện tại — chỉ bổ sung lớp hỗ trợ thông minh khi học sinh tự học tại nhà."**

2. **"Chúng tôi không theo dõi mọi thứ — chỉ thu 3 điểm chạm quan trọng (ảnh vở, log AI, tick giáo viên) để tạo insight có giá trị."**

3. **"AI đóng vai trò trợ giảng kiên nhẫn — không bao giờ làm bài hộ học sinh, không thay thế giáo viên."**

→ Đọc tiếp: [SCOPE.md](SCOPE.md) — Phạm vi MVP cụ thể
