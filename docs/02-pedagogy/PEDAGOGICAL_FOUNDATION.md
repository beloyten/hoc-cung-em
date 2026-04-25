# Cơ sở khoa học sư phạm — HocCungEm

> Tài liệu này là **xương sống lý thuyết** của HocCungEm. Mọi quyết định về cách AI tương tác với học sinh đều bắt nguồn từ đây.
>
> **Quan trọng cho cuộc thi:** Giám khảo cuộc thi STKT cấp giáo viên rất chú trọng cơ sở khoa học sư phạm. Phần này phải được trích dẫn rõ trong thuyết minh và bài thuyết trình.

---

## 1. Bốn nền tảng lý thuyết

| # | Lý thuyết | Tác giả | Áp dụng vào HocCungEm |
|---|---|---|---|
| 1 | **Vùng phát triển gần (ZPD)** | Lev Vygotsky (1978) | AI gợi ý vừa đủ — không quá ít, không quá nhiều |
| 2 | **Phương pháp Socrates** | Socrates (~470 TCN) | AI luôn hỏi lại thay vì trả lời thẳng |
| 3 | **Đánh giá hình thành** (Formative Assessment) | Black & Wiliam (1998) | Dữ liệu để điều chỉnh dạy, không để chấm điểm |
| 4 | **Lý thuyết tải nhận thức** (Cognitive Load) | John Sweller (1988) | Worked examples, gợi ý từng bước nhỏ |

---

## 2. Vùng phát triển gần — ZPD (Vygotsky)

### Định nghĩa
**ZPD (Zone of Proximal Development)** = khoảng cách giữa **điều học sinh tự làm được** và **điều học sinh có thể làm được khi có hỗ trợ của người có năng lực hơn**.

```
   ❌ Quá khó
      ━━━━━━━━━━━━━━━━━━━━━━━━━━
                                  ← Không học được dù có hỗ trợ
   ✅ ZPD (Vùng vàng)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━
                                  ← Học hiệu quả NHẤT khi có hỗ trợ
   🟢 Đã biết
      ━━━━━━━━━━━━━━━━━━━━━━━━━━
                                  ← Tự làm được, không cần hỗ trợ
```

### Áp dụng vào AI Socratic của HocCungEm

**AI là "người có năng lực hơn" trong ZPD của HS.**

Quy tắc gợi ý theo 3 mức:
- **Mức 1 — Mơ hồ:** Khơi gợi tư duy chung
  - *"Em thử nghĩ về phép cộng có nhớ nhé"*
- **Mức 2 — Cụ thể:** Chỉ ra hướng làm
  - *"Em thử cộng cột đơn vị trước"*
- **Mức 3 — Chi tiết:** Hướng dẫn từng bước
  - *"6 + 9 bằng bao nhiêu? Lớn hơn 9 thì sao?"*

AI **bắt đầu từ mức 1**, theo dõi response của HS, **tăng mức** nếu HS vẫn bí.

→ Đây chính là **scaffolding** — dựng "giàn giáo" tạm thời, dỡ bỏ khi HS tự làm được.

---

## 3. Phương pháp Socrates

### Nguyên tắc
Thay vì cho đáp án, người dạy đặt **câu hỏi liên tiếp** để học sinh **tự khám phá** đáp án.

### Lợi ích sư phạm
- HS thực sự **hiểu** thay vì học vẹt
- Phát triển **tư duy phản biện**
- Tăng **sự tự tin** ("Em tự nghĩ ra đấy!")
- Phù hợp với HS tiểu học (não đang phát triển khả năng suy luận)

### Áp dụng vào prompt của HocCungEm

System prompt được khóa với các quy tắc:
1. ❌ KHÔNG bao giờ đưa đáp án cuối
2. ❌ KHÔNG bao giờ làm hộ phép tính
3. ✅ LUÔN hỏi lại để HS suy nghĩ
4. ✅ LUÔN khen khi HS đúng từng bước
5. ✅ Dùng câu hỏi mở (bắt đầu bằng "Em thử...", "Em nghĩ...", "Theo em...")

**Ví dụ Socratic dialog đúng:**
```
HS: 25 + 17 = 32 phải không ạ?
AI sai (kiểu thường): "Không đúng. Đáp án là 42."
AI đúng (Socratic): "Em đã cộng 5 + 7 = bao nhiêu? Nếu lớn hơn 9
                    thì cần làm gì với phần dư nhỉ?"
```

---

## 4. Đánh giá hình thành — Formative Assessment

### Định nghĩa
**Formative Assessment** = đánh giá **trong quá trình học** với mục đích **điều chỉnh việc dạy**, không phải để chấm điểm cuối cùng.

→ Khác với **Summative Assessment** (đánh giá tổng kết — kiểm tra cuối kỳ).

### Tài liệu nền
- Black, P. & Wiliam, D. (1998). *Inside the Black Box: Raising Standards Through Classroom Assessment*. Phi Delta Kappan.
- Hattie, J. (2009). *Visible Learning* — Formative feedback có effect size cao nhất trong các can thiệp giáo dục.

### Áp dụng vào HocCungEm

**Toàn bộ data của HocCungEm là formative, không phải summative:**

| Dữ liệu | Mục đích |
|---|---|
| Log AI hỏi gì | GV biết HS vướng gì → dạy lại |
| Ảnh vở | GV biết HS có ôn không → động viên |
| Tick GV | GV xác nhận đánh giá → cá nhân hóa báo cáo PH |

→ **HocCungEm KHÔNG chấm điểm.** Đây là điểm khác biệt quan trọng với OLM, VioEdu.

### Tuân thủ Thông tư 27/2020/TT-BGDĐT
Thông tư này quy định **đánh giá HS tiểu học bằng nhận xét** (formative), không bằng điểm số ở các môn không phải Toán/Tiếng Việt; ngay cả Toán/Tiếng Việt cũng đánh giá thường xuyên bằng nhận xét.

→ HocCungEm sinh **báo cáo nhận xét** cho PH — đúng tinh thần TT 27.

---

## 5. Lý thuyết tải nhận thức — Cognitive Load (Sweller)

### Nguyên tắc
Bộ nhớ làm việc (working memory) của con người **rất hạn chế** (~4 chunks). Học sinh tiểu học còn hạn chế hơn.

→ Khi AI gợi ý, phải **chia nhỏ** thành từng bước, không quá tải cùng lúc.

### Worked Examples (Sweller, 1985)
- Cho HS xem ví dụ giải mẫu **từng bước**, có giải thích
- Hiệu quả gấp 2-3 lần so với chỉ cho bài và bảo "tự giải"
- Đặc biệt hiệu quả với HS yếu/trung bình

### Áp dụng vào HocCungEm

- AI **không bao giờ** đưa cả lời giải dài
- Chia thành **bước nhỏ**, mỗi bước hỏi lại HS
- Khi HS bí, AI cho **ví dụ tương tự dễ hơn** (worked example), giải thích từng bước

**Ví dụ:**
```
HS: Em không biết làm 234 × 12

AI mức 1 — Worked example dễ hơn:
"Em thử 23 × 12 trước nha. 23 × 12 = 23 × 10 + 23 × 2.
 Em tính 23 × 10 = ?"

(Sau khi HS hiểu pattern, mới quay lại bài gốc)
```

---

## 6. Cơ sở pháp lý liên quan

### Thông tư 28/2020/TT-BGDĐT — Điều lệ trường tiểu học
- HS học 2 buổi/ngày **không được giao bài tập về nhà**
- → HocCungEm dùng thuật ngữ **"tự học"**, **"ôn tập tại nhà"** thay cho "BTVN"
- → Sản phẩm hỗ trợ HS tự ôn tập **vì hứng thú**, không phải bị giao

### Thông tư 27/2020/TT-BGDĐT — Đánh giá HS tiểu học
- Đánh giá thường xuyên bằng **nhận xét**
- → Báo cáo HocCungEm là dạng nhận xét, không phải điểm số

### Luật Trẻ em 2016 + Nghị định 13/2023/NĐ-CP
- Bảo vệ dữ liệu cá nhân, đặc biệt là trẻ em dưới 16 tuổi
- → HocCungEm có chính sách bảo vệ dữ liệu chặt chẽ (xem [SECURITY_PRIVACY.md](../03-architecture/SECURITY_PRIVACY.md))

---

## 7. Tóm tắt — 4 cột trụ sư phạm của HocCungEm

```
        ┌────────────────────────────────────────────┐
        │           HocCungEm                        │
        │   "AI không làm bài hộ. AI học cùng em."   │
        └────────────────────────────────────────────┘
              ▲          ▲          ▲          ▲
              │          │          │          │
        ┌─────┴──┐  ┌────┴────┐ ┌───┴────┐ ┌──┴─────┐
        │  ZPD   │  │Socrates │ │Format. │ │Cognit. │
        │Vygotsky│  │ Method  │ │Assess. │ │  Load  │
        └────────┘  └─────────┘ └────────┘ └────────┘
        Gợi ý vừa   Hỏi lại,   Dữ liệu     Chia nhỏ
        đủ trong    không cho   để điều     từng bước,
        ZPD         đáp án      chỉnh dạy   worked ex.
```

→ Đọc tiếp: [AI_SOCRATIC_GUIDE.md](AI_SOCRATIC_GUIDE.md)

---

## 📚 Tham khảo

1. Vygotsky, L. S. (1978). *Mind in Society: The Development of Higher Psychological Processes*. Harvard University Press.
2. Black, P., & Wiliam, D. (1998). Inside the Black Box: Raising Standards Through Classroom Assessment. *Phi Delta Kappan*, 80(2).
3. Sweller, J. (1988). Cognitive Load During Problem Solving: Effects on Learning. *Cognitive Science*, 12(2).
4. Hattie, J. (2009). *Visible Learning: A Synthesis of Over 800 Meta-Analyses Relating to Achievement*. Routledge.
5. Bộ GD&ĐT (2020). Thông tư 27/2020/TT-BGDĐT về đánh giá học sinh tiểu học.
6. Bộ GD&ĐT (2020). Thông tư 28/2020/TT-BGDĐT về Điều lệ trường tiểu học.
