# Q&A Preparation — 20 câu Ban giám khảo có thể hỏi

> Em gái cần thuộc các câu trả lời này. Bộ này luyện trước demo day.

---

## Nhóm A — Sư phạm (cao xác suất hỏi)

### A1. *Sao không dùng "bài tập về nhà"?*
> "Theo Thông tư 28/2020, HS tiểu học học 2 buổi/ngày không được giao BTVN. Nhưng các con vẫn cần tự học, ôn tập. HocCungEm hỗ trợ ở khoảng đó — gọi là **hoạt động tự học tự nguyện**, không phải bài bắt buộc."

### A2. *AI có làm các con lười suy nghĩ không?*
> "Đây chính là vấn đề chúng em giải quyết. Cô Mây có **5 nguyên tắc bất di**: tuyệt đối không đưa đáp án, luôn hỏi lại, gợi ý từng bậc, để con tự kết luận. Có lớp **AI Guard** để chặn output có đáp án. Mục tiêu là HS **học cách suy nghĩ**, không phải lấy đáp số."

### A3. *Các con lớp 4 có biết dùng AI không?*
> "Mô hình của em là **PH ngồi cạnh con**, đặc biệt giai đoạn đầu. App thiết kế để PH bấm hộ, đọc cùng con. Sau dần các con sẽ tự dùng được — nhưng đó là phase 2."

### A4. *AI có thay thế giáo viên không?*
> "Không. Cô Mây hỗ trợ **lúc tự học buổi tối**, khi cô vắng mặt. Vai trò GV trong vòng tròn này là: tạo chủ đề tuần, xem ảnh vở, đọc insight, **dùng dữ liệu đó để dạy đúng hơn trên lớp**. AI mở rộng tay cô, không thay tay cô."

### A5. *Lý thuyết sư phạm em dựa vào là gì?*
> "Bốn nền tảng: **Vygotsky ZPD** (vùng phát triển gần — gợi ý vừa đúng tầm), **Socratic method** (hỏi để dạy), **Black & Wiliam 1998** (đánh giá quá trình), **Sweller 1988** (giảm tải nhận thức ngoại lai)."

### A6. *Có nguy cơ AI cho thông tin sai không?*
> "Có. Em đã thiết kế: (1) AI Guard regex chặn đáp án trực tiếp, (2) prompt giới hạn chủ đề chỉ trong nội dung bài cô giao, (3) nếu AI sai liên tiếp 3 lần thì fallback an toàn, (4) GV xem chat history sẽ phát hiện và báo lại để em tinh chỉnh prompt."

---

## Nhóm B — Kỹ thuật

### B1. *Em viết code à? Tự viết hay dùng AI?*
> "Anh trai em là kỹ sư phần mềm. Anh code chính, có dùng AI hỗ trợ để tăng tốc trong 9 ngày. Em phụ trách phần sư phạm: viết prompt cho Cô Mây, thiết kế UX, đánh giá output AI."

### B2. *Dùng AI nào?*
> "Google Gemini 2.0 Flash, gọi qua API. Free tier 1500 request/ngày — đủ cho pilot 1 lớp."

### B3. *Dữ liệu trẻ em được bảo vệ thế nào?*
> "Tuân thủ Nghị định 13/2023:
> 1. PH ký consent trước khi đăng ký
> 2. Mã hóa truyền và lưu (TLS + DB encryption)
> 3. Row Level Security cấp database — không leak chéo lớp
> 4. PH có quyền yêu cầu xóa toàn bộ data
> 5. Audit log mọi hành động nhạy cảm
> 6. Không gửi PII vào prompt AI"

### B4. *App có miễn phí không?*
> "Cho pilot 1 trường — gần như miễn phí (dưới 100k VND/tháng). Quy mô lớn sẽ cần plan trả phí. Nhưng đây là **research project**, không phải sản phẩm thương mại."

### B5. *Server đặt ở đâu?*
> "Singapore — gần VN nhất, latency thấp. Vercel + Supabase đều có region Singapore."

---

## Nhóm C — Pilot & đánh giá

### C1. *Đo hiệu quả như thế nào?*
> "4 nhóm metric:
> 1. **Sư phạm:** % bài tự giải mà không xin đáp án, độ chính xác, tiến bộ tuần qua tuần
> 2. **Hành vi:** số phiên tự học/tuần, thời lượng, tỷ lệ hoàn thành
> 3. **Kỹ thuật:** AI Guard violation rate, latency, uptime
> 4. **Hài lòng:** survey PH + GV cuối tuần 4"

### C2. *So với nhóm control thì sao?*
> "Pilot đầu chưa làm control group — đang tập trung MVP. Nếu kết quả tốt, em dự kiến hợp tác với khoa Tiểu học ĐHSP làm nghiên cứu chính thức có control."

### C3. *Đã chạy thử chưa?*
> "Tại thời điểm trình bày, em đã pilot [X] tuần với lớp 4A1, có [Y] phiên tự học, [Z] ảnh vở. Em xin chia sẻ một số insight thực tế..." (điền sau pilot)

---

## Nhóm D — Khả năng nhân rộng & cạnh tranh

### D1. *Khác Khan Academy / Monkey ở đâu?*
> "Khan, Monkey dạy bài giảng có sẵn, học sinh học theo tốc độ chương trình của họ. HocCungEm **không dạy** — chỉ **đứng cạnh khi con đang tự học chính bài cô giao**. Đây là khoảng trống chưa ai làm ở VN."

### D2. *Cô giáo các trường khác dùng được không?*
> "Có. Mô hình thiết kế cho mọi lớp tiểu học VN học 2 buổi/ngày. Hiện chỉ pilot 1 lớp — sẽ mở rộng từ từ sau cuộc thi."

### D3. *Có rào cản gì không?*
> "(1) PH cần smartphone — VN tỷ lệ smartphone cao, OK; (2) PH cần thời gian ngồi cạnh con tối thiểu 15 phút/tối — đây là **giá trị**, không phải gánh nặng; (3) GV cần học cách đọc insight — em làm onboarding 30 phút."

---

## Nhóm E — Bẫy / khó

### E1. *Trẻ em quá nhỏ để dùng AI, em nghĩ sao?*
> "Em đồng ý — đó là lý do em không cho HS dùng trực tiếp một mình. **PH luôn ngồi cạnh** trong design. PH là cầu nối an toàn. AI cũng được giới hạn nội dung và phong cách phù hợp lớp 4."

### E2. *Em có lo ngại đạo đức không?*
> "Có 3 ngại em đã giải quyết:
> 1. **Lười suy nghĩ** → AI Socratic + Guard
> 2. **Lộ DL trẻ em** → consent + RLS + encrypt
> 3. **Phụ thuộc AI** → mỗi tuần PH nhận báo cáo, GV nhận insight — sự phụ thuộc nằm trong tầm kiểm soát người lớn, không phải trẻ"

### E3. *Nếu Google đóng API thì sao?*
> "Em đã thiết kế model abstraction. Switch sang OpenAI / Claude / model VN trong vài giờ. Không lock-in."

---

## Cách trả lời

- **Bình tĩnh, tự tin, ngôi 1 ('em')**
- Nếu không biết → "Câu hỏi hay. Em chưa có data đầy đủ về điều này, em sẽ tìm hiểu thêm. Nhưng theo nguyên lý em đã thiết kế thì..."
- Tránh: "Cái này anh trai em làm em không biết" → thay bằng "Phần kỹ thuật em xin gọi anh trai bổ sung..."
- **Kết thúc mỗi câu** bằng đưa ngược về **vòng tròn / 3 nhân vật / Cô Mây** — neo concept

→ Đọc tiếp: [COMPETITORS.md](COMPETITORS.md)
