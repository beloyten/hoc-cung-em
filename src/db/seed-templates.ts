// src/db/seed-templates.ts
// Seed topic templates — Lớp 1–5, Toán + Tiếng Việt + các môn khác (GDPT 2018 framework)
// pnpm db:seed-templates
//
// Templates seeded với verified_at = NULL (draft).
// Cần giáo viên review theo SGK 2024–2026 trước khi set verified_at.

import { and, eq } from "drizzle-orm"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

config({ path: ".env.local", override: true })

const url = process.env.DATABASE_URL_MIGRATE ?? process.env.DATABASE_URL
if (!url) {
  console.error("DATABASE_URL_MIGRATE / DATABASE_URL missing")
  process.exit(1)
}

const client = postgres(url, { prepare: false, max: 1 })
const db = drizzle(client, { schema })

const GRADE4_MATH_TEMPLATES: Array<schema.NewTopicTemplate> = [
  {
    grade: 4,
    subject: "math",
    title: "Các số đến 1 000 000",
    description: "Đọc, viết, so sánh và sắp xếp các số đến 1 000 000",
    context: `Học sinh học đọc, viết và so sánh các số đến 1 000 000. Nội dung gồm:
- Xác định giá trị theo vị trí: hàng đơn vị, chục, trăm, nghìn, chục nghìn, trăm nghìn
- Đọc và viết số đúng cách (ví dụ: 305 020 đọc là "ba trăm linh năm nghìn không trăm hai mươi")
- So sánh hai số: số có nhiều chữ số hơn thì lớn hơn; cùng số chữ số thì so từng hàng từ trái sang phải
Lỗi phổ biến: nhầm vị trí hàng, viết thiếu chữ số 0 ở giữa (ví dụ: viết 30020 thành 3020).`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Phép cộng, trừ số nhiều chữ số",
    description: "Cộng và trừ các số có đến 6 chữ số, có nhớ và không nhớ",
    context: `Học sinh thực hiện phép cộng và trừ các số có đến 6 chữ số. Nội dung gồm:
- Đặt tính theo cột dọc, thẳng hàng
- Cộng có nhớ: khi tổng một cột ≥ 10, nhớ 1 sang cột liền trái
- Trừ có mượn: khi số bị trừ nhỏ hơn số trừ ở một cột, mượn 1 từ cột liền trái
Lỗi phổ biến: quên cộng số nhớ, tính sai khi có nhiều lần nhớ liên tiếp, nhầm cột khi đặt tính.`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Phép nhân với số có một chữ số",
    description: "Nhân số có nhiều chữ số với số có một chữ số",
    context: `Học sinh nhân số có 2–4 chữ số với số có 1 chữ số. Nội dung gồm:
- Áp dụng bảng nhân 2–9 đã học
- Nhân từ phải sang trái, xử lý nhớ
- Trường hợp có chữ số 0 trong số bị nhân
Lỗi phổ biến: quên cộng số nhớ vào tích của hàng tiếp theo, nhân nhầm bảng cửu chương.`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Nhân với 10, 100, 1000 — nhân nhẩm",
    description: "Nhân nhẩm một số với 10, 100, 1000",
    context: `Học sinh nhận ra và vận dụng quy tắc nhân nhẩm. Nội dung gồm:
- Nhân với 10: thêm 1 chữ số 0 vào bên phải (ví dụ: 34 × 10 = 340)
- Nhân với 100: thêm 2 chữ số 0
- Nhân với 1000: thêm 3 chữ số 0
- Mở rộng: 34 × 20 = 34 × 2 × 10; 34 × 300 = 34 × 3 × 100
Gợi ý Socratic: hỏi "Con thấy 34 × 10 và 340 có gì khác nhau không? Chữ số 0 ở đâu ra?".`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Phép nhân với số có hai chữ số",
    description: "Nhân số có nhiều chữ số với số có hai chữ số",
    context: `Học sinh nhân số có 2–3 chữ số với số có 2 chữ số. Nội dung gồm:
- Tách: 23 × 12 = 23 × 2 + 23 × 10
- Đặt tính: nhân với chữ số hàng đơn vị trước, rồi nhân với chữ số hàng chục (kết quả dịch sang trái 1 cột), sau đó cộng hai tích
Lỗi phổ biến: quên dịch hàng khi nhân với chữ số hàng chục, tức là viết thẳng hàng thay vì dịch 1 cột sang trái.`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Phép chia cho số có một chữ số",
    description: "Chia số có nhiều chữ số cho số có một chữ số, có dư và không dư",
    context: `Học sinh chia số có 2–4 chữ số cho số có 1 chữ số. Nội dung gồm:
- Chia không dư: thương nhân với số chia bằng đúng số bị chia
- Chia có dư: số dư < số chia
- Chia theo từng hàng từ trái sang phải (chia cột dọc)
- Kiểm tra: thương × số chia + số dư = số bị chia
Lỗi phổ biến: ước lượng thương sai (thương quá lớn hoặc quá nhỏ), quên số dư cuối cùng.`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Chia cho 10, 100, 1000 — chia nhẩm",
    description: "Chia nhẩm một số cho 10, 100, 1000",
    context: `Học sinh vận dụng quy tắc chia nhẩm. Nội dung gồm:
- Chia cho 10: bỏ 1 chữ số 0 ở bên phải (chỉ khi số kết thúc bằng 0)
- Chia cho 100: bỏ 2 chữ số 0; chia cho 1000: bỏ 3 chữ số 0
- Mở rộng: 320 ÷ 40 = 32 ÷ 4
Lỗi phổ biến: áp dụng khi số không kết thúc bằng 0 (ví dụ: 35 ÷ 10 ≠ 3).
Gợi ý: hỏi "Nếu 340 ÷ 10 = 34 thì 34 × 10 bằng bao nhiêu? Con kiểm tra thử xem".`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Tìm thành phần chưa biết",
    description: "Tìm số hạng, số bị trừ, thừa số, số bị chia chưa biết",
    context: `Học sinh tìm thành phần chưa biết trong phép tính. Quy tắc:
- x + a = b → x = b − a
- x − a = b → x = b + a (số bị trừ = hiệu + số trừ)
- a − x = b → x = a − b (số trừ = số bị trừ − hiệu)
- x × a = b → x = b ÷ a
- x ÷ a = b → x = b × a
Bước quan trọng: học sinh cần nhận dạng đúng vai trò của x (là thành phần nào?) trước khi áp quy tắc.
Lỗi phổ biến: nhầm quy tắc cho số bị trừ và số trừ.`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Dãy số và quy luật",
    description: "Nhận biết quy luật và điền tiếp các số trong dãy",
    context: `Học sinh tìm quy luật trong dãy số và điền tiếp. Nội dung gồm:
- Dãy cộng thêm không đổi: 3, 7, 11, 15, … (thêm 4)
- Dãy trừ đi không đổi: 100, 90, 80, … (trừ 10)
- Dãy nhân/chia: 2, 4, 8, 16, … (nhân 2)
- Dãy phức tạp hơn: xen kẽ hai quy luật
Cách tìm: tính hiệu hoặc thương giữa các số liên tiếp.
Gợi ý Socratic: "Con tính 7 − 3, rồi 11 − 7, rồi 15 − 11 xem có bằng nhau không?".`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Phân số — khái niệm và so sánh",
    description: "Hiểu phân số, so sánh phân số cùng mẫu và khác mẫu",
    context: `Học sinh làm quen với phân số ở lớp 4. Nội dung gồm:
- Phân số a/b: chia đều thành b phần, lấy a phần
- Phân số bằng nhau: nhân/chia cả tử và mẫu với cùng một số
- So sánh cùng mẫu: tử lớn hơn thì phân số lớn hơn
- So sánh khác mẫu: đưa về cùng mẫu, hoặc so sánh với 1/2
- Phân số lớn hơn 1: tử > mẫu
Lỗi phổ biến: nghĩ 3/8 > 3/5 vì 8 > 5, không nhận ra mẫu lớn hơn thì mỗi phần nhỏ hơn.`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Phép cộng và trừ phân số cùng mẫu số",
    description: "Cộng và trừ các phân số có cùng mẫu số, rút gọn kết quả",
    context: `Học sinh cộng và trừ phân số cùng mẫu số. Quy tắc:
- Cộng: a/n + b/n = (a+b)/n — cộng tử, giữ mẫu
- Trừ: a/n − b/n = (a−b)/n — trừ tử, giữ mẫu
- Rút gọn kết quả nếu có thể (tìm ƯCLN của tử và mẫu)
Lỗi phổ biến (quan trọng nhất): cộng cả tử lẫn mẫu — ví dụ nghĩ 1/4 + 1/4 = 2/8.
Gợi ý: "Nếu con có 1/4 cái bánh, rồi được thêm 1/4 nữa, con có bao nhiêu phần trong tổng 4 phần?".`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Góc, tia, đoạn thẳng",
    description: "Nhận biết và phân loại góc: nhọn, vuông, tù, bẹt",
    context: `Học sinh phân biệt các khái niệm hình học cơ bản. Nội dung gồm:
- Điểm, tia (một đầu mút), đoạn thẳng (hai đầu mút), đường thẳng (vô tận hai chiều)
- Góc: góc nhọn (< 90°), góc vuông (= 90°), góc tù (90° < x < 180°), góc bẹt (= 180°)
- Dùng ê-ke để xác định và vẽ góc vuông
- Hai đường thẳng vuông góc, hai đường thẳng song song
Gợi ý Socratic: "Con dùng ê-ke đặt vào góc này xem — góc của hình có khít với góc vuông của ê-ke không?".`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Hình chữ nhật và hình vuông — chu vi, diện tích",
    description: "Tính chu vi và diện tích hình chữ nhật, hình vuông",
    context: `Học sinh tính chu vi và diện tích hình chữ nhật và hình vuông. Công thức:
- Hình chữ nhật: Chu vi = (dài + rộng) × 2; Diện tích = dài × rộng
- Hình vuông: Chu vi = cạnh × 4; Diện tích = cạnh × cạnh
Đơn vị: chu vi dùng đơn vị đo dài (cm, m); diện tích dùng đơn vị vuông (cm², m²)
Lỗi phổ biến: nhầm công thức chu vi và diện tích, quên ghi đơn vị hoặc ghi sai đơn vị (cm thay vì cm²).
Gợi ý: "Chu vi là đo theo đường viền xung quanh, còn diện tích là đo phần bên trong — con nghĩ cái nào dùng đơn vị bình phương?".`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Đơn vị đo độ dài, khối lượng, thời gian",
    description: "Đổi đơn vị đo độ dài, khối lượng và thời gian",
    context: `Học sinh nắm vững các đơn vị đo và cách đổi. Nội dung gồm:
- Độ dài: km > m > dm > cm > mm (1 km = 1000 m; 1 m = 10 dm = 100 cm = 1000 mm)
- Khối lượng: tấn > tạ > yến > kg > g (1 tấn = 10 tạ; 1 tạ = 10 yến; 1 yến = 10 kg; 1 kg = 1000 g)
- Thời gian: năm > tháng > tuần > ngày > giờ > phút > giây (1 giờ = 60 phút; 1 phút = 60 giây)
Lỗi phổ biến: nhầm tỉ lệ (nghĩ 1 tạ = 100 kg thay vì 10 yến = 100 kg).
Gợi ý: đổi bước một từng đơn vị liền kề thay vì nhảy cóc.`,
  },
  {
    grade: 4,
    subject: "math",
    title: "Giải toán có lời văn",
    description: "Đọc hiểu đề, lập tóm tắt và giải các dạng toán có lời văn lớp 4",
    context: `Học sinh giải toán có lời văn theo quy trình. Các dạng phổ biến lớp 4:
- Toán hơn kém: "A hơn B bao nhiêu?" hoặc "Tìm A biết A hơn B là x"
- Toán gấp/giảm: "A gấp đôi B" hoặc "A giảm đi 3 lần"
- Tìm hai số khi biết tổng và hiệu: số lớn = (tổng + hiệu) ÷ 2; số bé = (tổng − hiệu) ÷ 2
- Toán chuyển động đơn giản: quãng đường = vận tốc × thời gian
Quy trình: đọc kỹ đề → gạch chân dữ kiện → vẽ sơ đồ tóm tắt → chọn phép tính → giải → kiểm tra lại.
Gợi ý Socratic: "Con đọc xong đề, bài hỏi cái gì? Con đã biết những gì rồi?".`,
  },
]

// ---------------------------------------------------------------------------
// Grade 4 — Tiếng Việt (10 templates)
// ---------------------------------------------------------------------------

const GRADE4_VIETNAMESE_TEMPLATES: Array<schema.NewTopicTemplate> = [
  {
    grade: 4,
    subject: "vietnamese",
    title: "Đọc hiểu văn bản",
    description: "Đọc và trả lời câu hỏi về nội dung, ý nghĩa của đoạn văn / bài văn",
    context: `Học sinh đọc một đoạn văn và trả lời câu hỏi đọc hiểu lớp 4. Nội dung gồm:
- Tìm thông tin tường minh: chi tiết, sự kiện, nhân vật được nêu rõ trong bài
- Suy luận: ý nghĩa hình ảnh, nguyên nhân–kết quả, thái độ nhân vật
- Tóm tắt ý chính của đoạn / bài
Cách gợi ý Socratic: hỏi "Đoạn văn này kể về ai? Điều gì xảy ra?", rồi "Tại sao nhân vật lại làm vậy?", rồi "Con nghĩ ý chính đoạn này là gì?".
Không tóm tắt hộ — để em tự diễn đạt bằng lời của mình.`,
  },
  {
    grade: 4,
    subject: "vietnamese",
    title: "Luyện từ và câu — Danh từ, động từ, tính từ",
    description: "Nhận biết và phân loại danh từ, động từ, tính từ trong câu",
    context: `Học sinh phân biệt ba từ loại cơ bản. Định nghĩa ngắn gọn:
- Danh từ: chỉ sự vật, người, nơi chốn, khái niệm (sách, cô giáo, Hà Nội, tình yêu)
- Động từ: chỉ hành động, trạng thái (chạy, ngủ, nghĩ, là)
- Tính từ: chỉ đặc điểm, tính chất (đẹp, nhanh, cao, vui)
Thử: đặt "con" hoặc "cái" trước từ → danh từ; đặt "đang/sẽ" → động từ; "rất" → tính từ.
Gợi ý Socratic: "Con thử đặt 'rất' trước từ đó xem có tự nhiên không — 'rất chạy' hay 'rất nhanh'?".`,
  },
  {
    grade: 4,
    subject: "vietnamese",
    title: "Luyện từ và câu — Câu hỏi, câu kể, câu cảm, câu khiến",
    description: "Phân biệt 4 kiểu câu theo mục đích nói, sử dụng đúng dấu câu",
    context: `Học sinh phân biệt 4 kiểu câu. Đặc điểm nhận diện:
- Câu hỏi: dùng để hỏi, kết thúc bằng "?", thường có từ nghi vấn (ai, gì, nào, không, chưa)
- Câu kể: dùng để kể/mô tả, kết thúc bằng "."
- Câu cảm: bày tỏ cảm xúc mạnh, kết thúc bằng "!", thường có "ôi, ồ, chao"
- Câu khiến: yêu cầu, đề nghị, kết thúc "!" hoặc ".", thường có "hãy, đừng, chớ, xin"
Gợi ý Socratic: "Câu này người nói muốn làm gì — hỏi, kể, hay bày tỏ cảm xúc?".`,
  },
  {
    grade: 4,
    subject: "vietnamese",
    title: "Chính tả — Phân biệt âm/vần dễ lẫn",
    description: "Luyện viết đúng các âm, vần thường nhầm: l/n, ch/tr, s/x, ên/iên, ao/au…",
    context: `Học sinh luyện phân biệt các âm/vần dễ lẫn theo phương ngữ và lỗi phổ biến lớp 4:
- l/n: "nói" ≠ "lói"; mẹo: âm /l/ lưỡi uốn lên, /n/ lưỡi chạm răng trên
- ch/tr: "chân" ≠ "trân"; học thuộc từng từ, không có quy tắc tuyệt đối
- s/x: "sẻ" ≠ "xẻ"; gợi ý: "s" hay đi với từ chỉ con vật, sự vật tự nhiên
- ên/iên: "nhện" ≠ "nhiện"; ên đứng độc lập, iên sau phụ âm
- ao/au: "màu sắc" — "màu" không phải "mào"
Cách dạy: không đọc chính tả, thay vào đó hỏi "Con nhớ từ này dùng âm nào? Con thử nghĩ xem từ liên quan nào con biết".`,
  },
  {
    grade: 4,
    subject: "vietnamese",
    title: "Tập làm văn — Miêu tả đồ vật",
    description: "Quan sát và viết bài văn miêu tả một đồ vật theo cấu trúc 3 phần",
    context: `Học sinh viết bài văn miêu tả đồ vật. Cấu trúc 3 phần:
1. Mở bài: giới thiệu đồ vật (đó là đồ vật gì? của ai? em có nó từ khi nào?)
2. Thân bài: miêu tả từng phần theo thứ tự (hình dáng tổng thể → màu sắc → từng bộ phận → vật liệu → công dụng)
3. Kết bài: cảm nghĩ của em về đồ vật đó
Cách gợi ý Socratic: đừng viết hộ. Thay vào đó hỏi:
- "Con đang tả cái gì? Nhìn nó từ xa thấy hình gì?"
- "Màu sắc thế nào? Có điểm nào đặc biệt không?"
- "Con dùng đồ vật đó để làm gì? Con thích nhất điều gì ở nó?"`,
  },
  {
    grade: 4,
    subject: "vietnamese",
    title: "Tập làm văn — Kể chuyện",
    description: "Kể lại câu chuyện hoặc sự việc có thật theo trình tự thời gian",
    context: `Học sinh kể lại câu chuyện (đã nghe/đọc) hoặc sự việc có thật. Yêu cầu:
- Kể theo trình tự: mở đầu → diễn biến (2–3 sự kiện chính) → kết thúc
- Dùng từ nối thời gian: "Đầu tiên", "Sau đó", "Tiếp theo", "Cuối cùng"
- Thêm lời thoại, cảm xúc nhân vật để câu chuyện sinh động
- Không kể lại y nguyên (nếu là chuyện đã đọc): kể bằng lời của mình
Gợi ý Socratic: "Chuyện này bắt đầu thế nào? Ai là nhân vật chính? Chuyện gì xảy ra tiếp theo? Kết thúc ra sao?".
Không viết hộ — chỉ đặt câu hỏi để em nhớ lại và tự kể.`,
  },
  {
    grade: 4,
    subject: "vietnamese",
    title: "Từ ghép và từ láy",
    description: "Phân biệt từ ghép (ghép nghĩa) và từ láy (lặp âm/vần), đặt câu",
    context: `Học sinh phân biệt từ ghép và từ láy:
- Từ ghép: kết hợp 2+ tiếng đều có nghĩa hoặc bổ nghĩa cho nhau (nhà cửa, học sinh, máy tính)
- Từ láy: có âm đầu hoặc vần lặp lại, tạo nhạc điệu (lung linh, nhỏ nhắn, lao xao)
  - Láy âm đầu: "bờm bờm", "khúc khích"
  - Láy vần: "lao xao", "bồn chồn"
  - Láy toàn bộ: "xanh xanh", "ngoan ngoãn"
Mẹo nhận biết: thử tách từng tiếng xem có nghĩa độc lập không — nếu có → từ ghép; nếu tiếng tách ra vô nghĩa → từ láy.`,
  },
  {
    grade: 4,
    subject: "vietnamese",
    title: "Câu có chủ ngữ và vị ngữ",
    description: "Xác định chủ ngữ (ai/cái gì) và vị ngữ (làm gì/thế nào) trong câu",
    context: `Học sinh phân tích thành phần chính của câu:
- Chủ ngữ: trả lời câu hỏi "Ai?" hoặc "Cái gì?" — thường là danh từ, đại từ
- Vị ngữ: trả lời câu hỏi "Làm gì?", "Là gì?", "Như thế nào?" — thường là động từ, tính từ
Câu đơn: 1 chủ ngữ + 1 vị ngữ
Câu ghép: 2+ mệnh đề nối bằng "và, nhưng, vì, nên, tuy…nhưng"
Bước làm: gạch chân toàn bộ câu → hỏi "Câu này nói về ai/cái gì?" → đó là chủ ngữ → phần còn lại là vị ngữ.
Gợi ý: "Con thử hỏi 'Ai làm điều đó trong câu này?' — câu trả lời chính là chủ ngữ đó".`,
  },
  {
    grade: 4,
    subject: "vietnamese",
    title: "Mở rộng vốn từ — Từ đồng nghĩa và từ trái nghĩa",
    description: "Nhận biết, phân biệt và sử dụng từ đồng nghĩa, từ trái nghĩa",
    context: `Học sinh mở rộng vốn từ qua quan hệ nghĩa:
- Từ đồng nghĩa: cùng nghĩa hoặc gần nghĩa (chết = mất = qua đời; to = lớn = khổng lồ)
  - Lưu ý: từ đồng nghĩa không phải lúc nào cũng thay thế được hoàn toàn (vd: "mất" dùng cho người, không dùng cho đồ vật như "chết")
- Từ trái nghĩa: nghĩa đối lập (cao/thấp, nhanh/chậm, tốt/xấu)
Cách gợi ý: đưa ra ngữ cảnh "Con thử điền từ khác vào câu xem câu có còn đúng không?".
Bài tập mở rộng: tìm 2–3 từ đồng nghĩa với "đẹp", "to", "đi".`,
  },
  {
    grade: 4,
    subject: "vietnamese",
    title: "Dấu câu — Dấu hai chấm, dấu ngoặc kép, dấu gạch ngang",
    description: "Hiểu và dùng đúng dấu hai chấm, ngoặc kép, gạch ngang trong văn bản",
    context: `Học sinh nắm công dụng 3 dấu câu mới ở lớp 4:
- Dấu hai chấm (:) — 3 công dụng: (1) báo hiệu lời nói trực tiếp, (2) liệt kê, (3) giải thích
- Dấu ngoặc kép ("") — 2 công dụng: (1) trích dẫn lời nói trực tiếp, (2) đánh dấu từ dùng với nghĩa đặc biệt
- Dấu gạch ngang (—) — 3 công dụng: (1) đánh dấu đầu lời thoại, (2) ngăn cách thành phần chú thích, (3) nối các từ trong liên danh
Cách gợi ý: "Đoạn này trích dẫn lời ai nói? Con nhìn xem trước lời nói đó có dấu gì?".`,
  },
]

// ---------------------------------------------------------------------------
// Grade 1 — Toán (7 templates)
// ---------------------------------------------------------------------------

const GRADE1_MATH_TEMPLATES: Array<schema.NewTopicTemplate> = [
  {
    grade: 1,
    subject: "math",
    title: "Nhận biết và đếm các số từ 1 đến 10",
    description: "Đếm, đọc, viết số 1–10 và nhận biết số lượng đồ vật",
    context: `Học sinh lớp 1 làm quen với số đếm từ 1 đến 10. Nội dung gồm:
- Đếm số lượng đồ vật và đọc số tương ứng
- Viết chữ số (1, 2, … 10) đúng nét, đúng chiều
- Nhận biết số thứ tự (thứ nhất, thứ hai,…) và số lượng
Cách dạy Socratic: dùng ví dụ gần gũi (ngón tay, que tính, đồ vật trong lớp).
Hỏi: "Con có mấy cái bút? Con đếm thử xem: một, hai, ba…".
Không đọc số hộ — để em tự đếm và nói.`,
  },
  {
    grade: 1,
    subject: "math",
    title: "So sánh các số trong phạm vi 10",
    description: "Dùng dấu >, <, = để so sánh hai số trong phạm vi 10",
    context: `Học sinh so sánh hai số bằng cách đếm đồ vật hoặc nhìn tia số. Nội dung gồm:
- Dùng dấu > (lớn hơn), < (bé hơn), = (bằng) điền vào chỗ trống
- Tia số: số ở bên phải lớn hơn số bên trái
Cách gợi ý: "Con lấy 3 que tính và 5 que tính. Bên nào nhiều hơn? Vậy ta dùng dấu gì?"
Lỗi phổ biến: nhầm chiều mũi nhọn của dấu > và <.
Mẹo: dấu mũi nhọn luôn chỉ về phía số nhỏ hơn.`,
  },
  {
    grade: 1,
    subject: "math",
    title: "Phép cộng trong phạm vi 10",
    description: "Thực hiện phép cộng hai số trong phạm vi 10 bằng đồ vật và tia số",
    context: `Học sinh học phép cộng lần đầu tiên. Nội dung gồm:
- Ý nghĩa phép cộng: gộp hai nhóm đồ vật lại
- Đọc phép tính: "3 cộng 4 bằng 7" (3 + 4 = 7)
- Thực hiện bằng que tính, ngón tay, hoặc tia số
- Tính nhẩm các phép cộng cơ bản: 1+1 đến 9+1
Cách Socratic: "Con có 2 cái kẹo, mẹ cho thêm 3 cái. Con đếm lại xem tất cả bao nhiêu cái?"
Lỗi phổ biến: đếm lại từ đầu thay vì đếm tiếp từ số lớn hơn (đếm tiếp nhanh hơn).`,
  },
  {
    grade: 1,
    subject: "math",
    title: "Phép trừ trong phạm vi 10",
    description: "Thực hiện phép trừ hai số trong phạm vi 10, hiểu mối quan hệ cộng–trừ",
    context: `Học sinh học phép trừ sau khi đã biết cộng. Nội dung gồm:
- Ý nghĩa phép trừ: lấy đi một phần, tìm phần còn lại
- Đọc phép tính: "7 trừ 3 bằng 4" (7 − 3 = 4)
- Liên hệ với phép cộng: biết 3 + 4 = 7 → suy ra 7 − 3 = 4
Cách Socratic: "Con có 7 viên bi, cho bạn 3 viên. Con còn mấy viên? Thử đếm que tính xem."
Lỗi phổ biến: lấy số nhỏ trừ số lớn (ví dụ: tính 3 − 7 thay vì 7 − 3).
Gợi ý: "Số nào phải đứng trước dấu trừ? Số bị lấy đi hay số lấy đi?"`,
  },
  {
    grade: 1,
    subject: "math",
    title: "Các số từ 11 đến 20",
    description: "Đọc, viết, đếm và nhận biết số 11–20 qua bó chục và que tính rời",
    context: `Học sinh bước đầu hiểu hệ thập phân qua số 11–20. Nội dung gồm:
- Cấu tạo số: 1 chục và mấy đơn vị (14 = 1 chục 4 đơn vị)
- Đọc đúng: mười một, mười hai, … hai mươi
- Đếm tới 20 không nhầm
Cách Socratic: dùng que tính — bó 10 que thành 1 bó, thêm que rời.
"Con bó được mấy chục? Còn lại mấy que rời? Vậy đây là số mấy?"
Lỗi phổ biến: đọc "mười lăm" thành "mười năm" hoặc nhầm thứ tự khi đếm 16, 17, 18.`,
  },
  {
    grade: 1,
    subject: "math",
    title: "Phép cộng và trừ trong phạm vi 20",
    description: "Tính cộng, trừ các số trong phạm vi 20, có và không có nhớ đơn giản",
    context: `Học sinh mở rộng phép tính lên phạm vi 20. Nội dung gồm:
- Cộng trong phạm vi 20: 9 + 4 = 9 + 1 + 3 = 10 + 3 = 13 (làm tròn chục)
- Trừ trong phạm vi 20: 13 − 4 = 13 − 3 − 1 = 9
- Cách làm tròn chục giúp tính nhanh hơn dùng ngón tay
Cách Socratic: "Con cộng 8 + 5, con thêm mấy vào 8 để được 10? Còn mấy nữa chưa cộng?"
Lỗi phổ biến: quên không cộng hết số còn lại sau khi làm tròn chục.`,
  },
  {
    grade: 1,
    subject: "math",
    title: "Hình phẳng: hình tròn, hình vuông, hình tam giác, hình chữ nhật",
    description: "Nhận biết và gọi tên 4 hình phẳng cơ bản trong thực tế",
    context: `Học sinh nhận biết 4 hình phẳng đầu tiên. Đặc điểm nhận dạng:
- Hình tròn: không có góc, không có cạnh thẳng, đường cong khép kín
- Hình vuông: 4 cạnh bằng nhau, 4 góc vuông
- Hình tam giác: 3 cạnh, 3 góc
- Hình chữ nhật: 4 góc vuông, 2 cặp cạnh bằng nhau
Cách Socratic: chỉ vào đồ vật thực tế — "Mặt cái đồng hồ hình gì? Cái khăn tay hình gì?"
Lỗi phổ biến: nhầm hình vuông và hình chữ nhật — hỏi "Hình này có tất cả các cạnh bằng nhau không?"`,
  },
]

// ---------------------------------------------------------------------------
// Grade 1 — Tiếng Việt (5 templates)
// ---------------------------------------------------------------------------

const GRADE1_VIETNAMESE_TEMPLATES: Array<schema.NewTopicTemplate> = [
  {
    grade: 1,
    subject: "vietnamese",
    title: "Học âm và vần — bước đầu đọc tiếng",
    description: "Nhận biết và đọc các âm đầu, vần đơn giản, ghép thành tiếng",
    context: `Học sinh lớp 1 đang ở giai đoạn học vần nền tảng. Nội dung gồm:
- Nhận mặt chữ và đọc âm: b, c, d, đ, g, h, k, l, m, n, p, q, r, s, t, v, x…
- Ghép âm + vần = tiếng: b + a = ba; m + e = me
- Đọc tiếng, đọc từ 2 tiếng đơn giản
Cách Socratic: đừng đọc hộ. Hỏi: "Chữ này là âm gì con? Ghép với vần 'an' thì đọc sao?"
Kiên nhẫn, không vội — đây là nền tảng cả năm.
Lỗi phổ biến: nhầm b/d, p/q (hình gương nhau), s/x, c/k.`,
  },
  {
    grade: 1,
    subject: "vietnamese",
    title: "Đọc từ và câu ngắn",
    description: "Đọc trơn từ 2–3 tiếng và câu đơn giản 4–6 chữ",
    context: `Học sinh đọc liền mạch từ ngữ và câu ngắn sau khi đã biết các âm vần. Nội dung gồm:
- Đọc từ: đọc lần lượt từng âm rồi nối thành tiếng, rồi nối tiếng thành từ
- Đọc câu ngắn: "Con mèo ăn cá." — đọc đúng ngắt nhịp, dừng ở dấu chấm
- Hiểu nghĩa: hỏi câu vừa đọc nói về gì
Cách Socratic: sau khi em đọc, hỏi "Câu này kể về con gì? Con đó đang làm gì?"
Không đọc trước cho em nghe trừ khi em bí hoàn toàn — để em tự giải mã.`,
  },
  {
    grade: 1,
    subject: "vietnamese",
    title: "Viết chữ thường và câu đơn giản",
    description: "Viết đúng chữ cái thường, nối nét, viết câu ngắn 3–5 chữ",
    context: `Học sinh luyện viết chữ đúng nét và đúng cỡ. Nội dung gồm:
- Tư thế ngồi viết, cầm bút đúng
- Viết chữ thường đúng nét (lưu ý nét cong, nét thẳng, móc, vòng)
- Viết câu ngắn có chữ hoa đầu câu, dấu chấm cuối câu
Cách Socratic: "Chữ 'b' bắt đầu từ đâu? Con nhớ trước khi viết là nét thẳng hay nét cong không?"
Không viết mẫu liên tục — cho em viết thử, nhận xét cụ thể điểm cần sửa.`,
  },
  {
    grade: 1,
    subject: "vietnamese",
    title: "Chính tả — chép lại câu đơn giản",
    description: "Nghe và viết lại câu ngắn 4–6 chữ, đúng âm vần đã học",
    context: `Học sinh tập chép chính tả câu đơn giản. Nội dung gồm:
- Nghe đọc rõ từng tiếng, viết đúng âm đã học
- Chú ý dấu hỏi/ngã, dấu sắc/huyền — phân biệt thanh điệu
- Kiểm tra lại: so sánh bài viết với bài mẫu
Cách Socratic: "Con viết xong chưa? Thử đọc lại bài viết xem có đúng không? Tiếng nào con chưa chắc?"
Không đọc chậm từng âm cho em — đọc bình thường để em luyện nghe tự nhiên.`,
  },
  {
    grade: 1,
    subject: "vietnamese",
    title: "Nghe và kể lại câu chuyện ngắn theo tranh",
    description: "Nghe kể chuyện và trả lời câu hỏi đơn giản, tập kể lại theo tranh",
    context: `Học sinh nghe câu chuyện và kể lại bằng lời của mình. Nội dung gồm:
- Nhận ra nhân vật, sự kiện chính trong chuyện
- Trả lời câu hỏi: "Ai?", "Làm gì?", "Ở đâu?"
- Kể lại 2–3 ý chính theo tranh (không cần đúng từng từ)
Cách Socratic: "Truyện này kể về ai? Bức tranh này thấy gì? Sau đó điều gì xảy ra?"
Không kể lại hộ — chỉ gợi ý bằng câu hỏi để em tự nhớ.
Chấp nhận lời kể đơn giản, ngắn — quan trọng là em tự nói được.`,
  },
]

// ---------------------------------------------------------------------------
// Grade 2 — Toán (7 templates)
// ---------------------------------------------------------------------------

const GRADE2_MATH_TEMPLATES: Array<schema.NewTopicTemplate> = [
  {
    grade: 2,
    subject: "math",
    title: "Các số đến 100 — đọc, viết, so sánh",
    description: "Đọc viết số đến 100, nắm cấu tạo chục và đơn vị",
    context: `Học sinh mở rộng từ phạm vi 20 lên 100. Nội dung gồm:
- Cấu tạo số: 37 = 3 chục 7 đơn vị
- Đọc đúng: ba mươi bảy, sáu mươi, tám mươi mốt
- So sánh: so từ hàng chục trước, cùng chục thì so hàng đơn vị
- Tia số 0–100: số bên phải lớn hơn
Cách Socratic: "Con nhìn số 48 — có mấy chục? Mấy đơn vị? Vậy đọc là gì?"
Lỗi phổ biến: đọc 30 là "ba mươi không" thay vì "ba mươi"; đọc 81 là "tám một" thay vì "tám mươi mốt".`,
  },
  {
    grade: 2,
    subject: "math",
    title: "Phép cộng và trừ không nhớ trong phạm vi 100",
    description: "Cộng trừ hai số trong phạm vi 100 không có nhớ, đặt tính dọc",
    context: `Học sinh học đặt tính dọc lần đầu tiên. Nội dung gồm:
- Đặt tính: thẳng cột (đơn vị thẳng đơn vị, chục thẳng chục)
- Tính từ phải sang trái: cộng/trừ hàng đơn vị trước, rồi hàng chục
- Không có nhớ/mượn trong bài học này
Cách Socratic: "Con đặt tính như thế nào? Số 3 ở đâu — hàng chục hay hàng đơn vị? Tính cột nào trước?"
Lỗi phổ biến: không thẳng cột, tính ngược từ trái sang phải.`,
  },
  {
    grade: 2,
    subject: "math",
    title: "Phép cộng có nhớ — tổng bằng hoặc lớn hơn 10",
    description: "Cộng có nhớ một lần trong phạm vi 100",
    context: `Học sinh học cộng khi hàng đơn vị tổng ≥ 10. Nội dung gồm:
- Khi cột đơn vị ≥ 10: viết chữ số hàng đơn vị, nhớ 1 sang cột chục
- Cộng số nhớ vào cột chục
Ví dụ: 27 + 35: 7+5=12, viết 2 nhớ 1; 2+3+1=6 → kết quả 62
Cách Socratic: "Hàng đơn vị 7+5 bằng mấy? Lớn hơn hay nhỏ hơn 10? Vậy con viết mấy, nhớ mấy?"
Lỗi phổ biến: quên cộng số nhớ vào cột chục, hoặc viết 12 thẳng vào cột đơn vị.`,
  },
  {
    grade: 2,
    subject: "math",
    title: "Các số đến 1 000",
    description: "Đọc, viết, so sánh và phân tích cấu tạo số đến 1 000",
    context: `Học sinh làm quen với số 3 chữ số. Nội dung gồm:
- Cấu tạo: 342 = 3 trăm 4 chục 2 đơn vị
- Đọc đúng: ba trăm bốn mươi hai; lưu ý số có chữ số 0: 305 = ba trăm linh năm
- So sánh: số có nhiều chữ số hơn thì lớn hơn; cùng số chữ số so từ trái sang phải
Cách Socratic: "Chữ số 3 trong số 342 ở hàng nào? Giá trị của nó là bao nhiêu?"
Lỗi phổ biến: đọc 305 là "ba trăm không năm" thay vì "ba trăm linh năm".`,
  },
  {
    grade: 2,
    subject: "math",
    title: "Bảng nhân 2, 3, 4, 5",
    description: "Học thuộc và vận dụng bảng nhân 2, 3, 4, 5",
    context: `Học sinh học bảng nhân đầu tiên. Cách tiếp cận hiệu quả:
- Hiểu ý nghĩa: 3 × 4 = 3 + 3 + 3 + 3 (cộng 3 lần)
- Học qua nhịp điệu và bài vè
- Ứng dụng vào bài toán: "Mỗi bình có 4 bông hoa. 3 bình có bao nhiêu bông?"
Cách Socratic: "3 × 5 nghĩa là cộng số 3 mấy lần? Con thử cộng xem được bao nhiêu?"
Không chỉ học thuộc lòng — cần hiểu ý nghĩa để không nhầm sang phép chia sau này.
Lỗi phổ biến: nhầm phép nhân và phép cộng.`,
  },
  {
    grade: 2,
    subject: "math",
    title: "Bảng chia 2, 3, 4, 5",
    description: "Học bảng chia dựa trên bảng nhân, hiểu mối quan hệ nhân–chia",
    context: `Học sinh học chia từ bảng nhân đã thuộc. Nội dung gồm:
- Liên hệ: biết 3 × 4 = 12 → suy ra 12 ÷ 3 = 4 và 12 ÷ 4 = 3
- Ý nghĩa chia đều: 12 cái kẹo chia đều cho 4 bạn, mỗi bạn được mấy cái?
- Chia hết và chia có dư (giới thiệu đơn giản)
Cách Socratic: "Con biết bảng nhân 3 rồi. 15 ÷ 3 = ? Con nghĩ 3 nhân mấy thì bằng 15?"
Lỗi phổ biến: không nhớ bảng nhân nên không làm được chia — cần ôn nhân trước.`,
  },
  {
    grade: 2,
    subject: "math",
    title: "Giải toán có lời văn một bước tính",
    description: "Đọc hiểu đề, tóm tắt và giải bài toán bằng một phép tính",
    context: `Học sinh lần đầu giải toán có lời văn độc lập. Quy trình 3 bước:
1. Đọc kỹ đề: bài hỏi gì? Đã biết gì?
2. Tóm tắt ngắn (bằng câu hoặc sơ đồ đơn giản)
3. Chọn phép tính → tính → viết câu trả lời
Các dạng phổ biến lớp 2: thêm vào (cộng), bớt đi (trừ), mỗi... có... (nhân), chia đều (chia)
Cách Socratic: "Bài hỏi cái gì? Con đã biết những số nào? Con dùng phép tính gì — tại sao?"
Lỗi phổ biến: quên viết câu trả lời, hoặc chọn sai phép tính vì đọc không kỹ.`,
  },
]

// ---------------------------------------------------------------------------
// Grade 2 — Tiếng Việt (5 templates)
// ---------------------------------------------------------------------------

const GRADE2_VIETNAMESE_TEMPLATES: Array<schema.NewTopicTemplate> = [
  {
    grade: 2,
    subject: "vietnamese",
    title: "Mở rộng vốn từ theo chủ điểm",
    description: "Học từ mới theo chủ đề: gia đình, nhà trường, thiên nhiên, cộng đồng",
    context: `Học sinh lớp 2 học từ theo chủ điểm trong sách giáo khoa. Nội dung gồm:
- Nhận biết nghĩa của từ qua ngữ cảnh (ảnh, câu ví dụ)
- Dùng từ đặt câu đơn giản
- Phân loại từ: từ chỉ người, đồ vật, hoạt động, tính chất
Cách Socratic: "Từ 'siêng năng' có nghĩa là gì? Con đặt câu với từ đó xem."
Không giải thích dài — giúp em hiểu nghĩa qua câu ví dụ cụ thể.`,
  },
  {
    grade: 2,
    subject: "vietnamese",
    title: "Câu: Ai làm gì? / Ai thế nào? / Ai là gì?",
    description: "Nhận biết và đặt 3 kiểu câu cơ bản, xác định bộ phận trả lời câu hỏi",
    context: `Học sinh học cấu trúc câu đơn giản lớp 2. Nội dung gồm:
- Câu "Ai làm gì?": Bộ phận 1 (Ai?) + Bộ phận 2 (làm gì?) — "Bạn Nam đang đọc sách."
- Câu "Ai thế nào?": "Cô giáo rất hiền."
- Câu "Ai là gì?": "Bố em là bác sĩ."
Cách xác định: đặt câu hỏi "Câu này nói về ai?" → bộ phận đó trả lời "Ai?"; phần còn lại trả lời "làm gì / thế nào / là gì".
Cách Socratic: "Con đọc câu này — nó nói về ai? Người đó đang làm gì / thế nào?"`,
  },
  {
    grade: 2,
    subject: "vietnamese",
    title: "Kể chuyện theo tranh và gợi ý",
    description: "Quan sát tranh, trả lời câu hỏi và kể lại câu chuyện theo thứ tự",
    context: `Học sinh kể chuyện theo tranh gợi ý. Yêu cầu:
- Quan sát tranh theo thứ tự, nhận ra nhân vật và sự kiện
- Kể mạch lạc: mở đầu → diễn biến → kết thúc
- Dùng từ nối: "Đầu tiên…", "Tiếp theo…", "Cuối cùng…"
Cách Socratic: "Tranh đầu tiên có ai? Họ đang ở đâu? Chuyện gì xảy ra? Nhìn tranh tiếp theo xem…"
Không viết hộ — chỉ đặt câu hỏi để em tự nhớ và tự kể.`,
  },
  {
    grade: 2,
    subject: "vietnamese",
    title: "Chính tả nghe-viết",
    description: "Nghe và viết lại đoạn văn ngắn 3–5 câu, đúng chính tả đã học",
    context: `Học sinh luyện chính tả nghe viết sau khi đã qua chép. Nội dung gồm:
- Viết đúng các vần đã học: ươi, ươu, iêu, ươn, ươm, ương...
- Phân biệt thanh hỏi/ngã, các âm dễ nhầm theo vùng
- Kiểm tra lại bằng cách đọc thầm từng tiếng
Cách dạy: không đọc từng âm riêng lẻ — đọc tự nhiên từng từ hoặc cụm từ.
Cách Socratic: sau khi viết, hỏi "Con thấy tiếng nào mình chưa chắc? Thử đọc lại xem có đúng không?"`,
  },
  {
    grade: 2,
    subject: "vietnamese",
    title: "Viết đoạn văn ngắn 3–5 câu",
    description: "Viết đoạn văn kể hoặc tả theo gợi ý, đúng chính tả và có câu hoàn chỉnh",
    context: `Học sinh tập viết đoạn văn đầu tiên. Yêu cầu:
- Ít nhất 3 câu liên quan đến nhau về cùng 1 chủ đề
- Mỗi câu có đủ chủ ngữ và vị ngữ
- Dùng dấu chấm, dấu phẩy đúng chỗ
- Không viết lạc chủ đề
Cách Socratic: "Con muốn viết về gì? Con viết câu đầu tiên kể điều gì về chủ đề đó?"
Không viết mẫu hộ — gợi ý từng bước.
Khen khi em tự hoàn thành dù chưa hoàn hảo.`,
  },
]

// ---------------------------------------------------------------------------
// Grade 3 — Toán (8 templates)
// ---------------------------------------------------------------------------

const GRADE3_MATH_TEMPLATES: Array<schema.NewTopicTemplate> = [
  {
    grade: 3,
    subject: "math",
    title: "Các số đến 10 000",
    description: "Đọc, viết, so sánh và phân tích cấu tạo số đến 10 000",
    context: `Học sinh làm quen với số 4 chữ số. Nội dung gồm:
- Cấu tạo: 5 247 = 5 nghìn 2 trăm 4 chục 7 đơn vị
- Đọc đúng: "năm nghìn hai trăm bốn mươi bảy"
- Số có chữ số 0 ở giữa: 3 040 = "ba nghìn không trăm bốn mươi"
- So sánh từ hàng nghìn sang hàng đơn vị
Cách Socratic: "Chữ số 2 trong số 5 247 ở hàng nào? Giá trị của nó là bao nhiêu (200 hay 2000)?"
Lỗi phổ biến: đọc 3 040 là "ba nghìn bốn mươi" (bỏ mất "không trăm").`,
  },
  {
    grade: 3,
    subject: "math",
    title: "Cộng, trừ có nhớ số có 3–4 chữ số",
    description: "Đặt tính và tính cộng, trừ có nhớ nhiều lần với số đến 10 000",
    context: `Học sinh thực hiện cộng, trừ có nhớ phức tạp hơn lớp 2. Nội dung gồm:
- Cộng có nhớ nhiều lần: xử lý từng cột từ phải sang trái, nhớ 1 sang cột bên trái
- Trừ mượn nhiều lần: khi không đủ để trừ, mượn 1 từ cột bên trái
- Kiểm tra: dùng phép ngược (cộng kiểm trừ, trừ kiểm cộng)
Cách Socratic: "Ở cột đơn vị, tổng bằng mấy? Lớn hơn 10 không? Vậy con viết mấy, nhớ mấy?"
Lỗi phổ biến: nhớ 1 nhiều lần liên tiếp nhưng lại nhớ 2 thay vì 1.`,
  },
  {
    grade: 3,
    subject: "math",
    title: "Bảng nhân và bảng chia 6, 7, 8, 9",
    description: "Học thuộc và vận dụng bảng nhân/chia 6, 7, 8, 9",
    context: `Học sinh hoàn thiện bảng cửu chương. Nội dung gồm:
- Học bảng nhân 6, 7, 8, 9 qua mẫu và thực hành
- Liên hệ nhân–chia: biết 7 × 8 = 56 → 56 ÷ 7 = 8 và 56 ÷ 8 = 7
- Vận dụng: bài toán nhân chia trong cuộc sống
Cách Socratic: "Con thấy 7 × 8 và 8 × 7 thì cái nào lớn hơn? (Bằng nhau — tính giao hoán)."
Mẹo nhớ khó: 7 × 8 = 56 (5, 6, 7, 8 — bốn số liên tiếp); 9 × n = (n−1) và (10−n).
Lỗi phổ biến: nhầm 6×7=42 với 7×8=56.`,
  },
  {
    grade: 3,
    subject: "math",
    title: "Nhân số có 2 chữ số với số có 1 chữ số (có nhớ)",
    description: "Đặt tính và tính tích khi có nhớ từ hàng đơn vị sang hàng chục",
    context: `Học sinh nhân số 2 chữ số với 1 chữ số có nhớ. Nội dung gồm:
- Nhân từ phải sang trái: nhân hàng đơn vị trước, có nhớ thì cộng vào tích hàng chục
- Ví dụ: 36 × 4: 6×4=24, viết 4 nhớ 2; 3×4=12, thêm 2 nhớ = 14 → kết quả 144
Cách Socratic: "6 × 4 bằng mấy? Lớn hơn 10 không? Con viết chữ số nào xuống, nhớ mấy chục?"
Lỗi phổ biến: quên cộng số nhớ vào tích của hàng chục.`,
  },
  {
    grade: 3,
    subject: "math",
    title: "Chia số có 2 chữ số cho số có 1 chữ số",
    description: "Chia số có 2 chữ số cho số có 1 chữ số, có dư và không dư",
    context: `Học sinh thực hiện phép chia dài đầu tiên. Quy trình chia cột dọc:
- Chia từ trái sang phải, từng bước: chia → nhân → trừ → hạ
- Số dư luôn nhỏ hơn số chia
- Kiểm tra: thương × số chia + số dư = số bị chia
Ví dụ: 78 ÷ 3: 7÷3=2 dư 1 → hạ 8 thành 18 → 18÷3=6 → kết quả 26
Cách Socratic: "Đầu tiên con chia chữ số hàng chục: 7 ÷ 3 được mấy? Dư mấy? Bây giờ hạ chữ số nào xuống?"
Lỗi phổ biến: ước lượng thương sai (quá lớn hoặc quá nhỏ).`,
  },
  {
    grade: 3,
    subject: "math",
    title: "Bài toán gấp lên một số lần và giảm đi một số lần",
    description: "Giải bài toán tìm số gấp n lần hoặc giảm n lần một số đã biết",
    context: `Học sinh giải dạng toán mới lớp 3. Phân biệt rõ:
- Gấp n lần: số cần tìm = số đã biết × n (dùng nhân)
- Giảm đi n lần: số cần tìm = số đã biết ÷ n (dùng chia)
Lưu ý: "gấp đôi" = gấp 2 lần; "giảm 3 lần" ≠ "giảm đi 3" (hay nhầm)
Cách Socratic: "Bài nói 'gấp' hay 'giảm'? Con dùng phép tính gì với 'gấp lên'?"
Bài mở rộng: "A gấp B 4 lần và A hơn B 15 đơn vị — tìm A, B."
Lỗi phổ biến: nhầm "gấp 3 lần" (×3) với "hơn 3 lần" (×3 rồi +3, hiểu theo ngữ cảnh).`,
  },
  {
    grade: 3,
    subject: "math",
    title: "Chu vi hình chữ nhật và hình vuông",
    description: "Tính chu vi hình chữ nhật, hình vuông; phân biệt chu vi và diện tích",
    context: `Học sinh tính chu vi lần đầu tiên ở lớp 3. Công thức:
- Hình chữ nhật: Chu vi = (chiều dài + chiều rộng) × 2
- Hình vuông: Chu vi = cạnh × 4
Phân biệt: chu vi là độ dài đường viền (đơn vị: m, cm); diện tích là phần bên trong (chưa học ở lớp 3)
Cách Socratic: "Muốn tính chu vi, con cần đo gì của hình? Cộng hết các cạnh lại được chu vi — hình chữ nhật có mấy cạnh? Cạnh nào bằng cạnh nào?"
Lỗi phổ biến: cộng cả 4 cạnh riêng lẻ thay vì dùng công thức (đúng nhưng chậm); hoặc chỉ cộng 2 cạnh không nhân đôi.`,
  },
  {
    grade: 3,
    subject: "math",
    title: "Đơn vị đo khối lượng: kg và g",
    description: "Nhận biết, đổi đơn vị và tính toán với kilôgam và gam",
    context: `Học sinh làm quen với đơn vị khối lượng lớp 3. Nội dung gồm:
- 1 kg = 1 000 g (đổi × 1000 hoặc ÷ 1000)
- Ứng dụng thực tế: đọc cân, tính khối lượng
- Bài toán: mua bán, trộn hỗn hợp
Cách Socratic: "Túi gạo nặng 2 kg. Nếu đổi sang gam thì được mấy gam? Con dùng phép tính gì?"
Lỗi phổ biến: nhầm tỉ lệ (nghĩ 1 kg = 100 g).
Liên hệ thực tế: cân hộp sữa 400 g — đó là bao nhiêu phần của 1 kg?`,
  },
]

// ---------------------------------------------------------------------------
// Grade 3 — Tiếng Việt (5 templates)
// ---------------------------------------------------------------------------

const GRADE3_VIETNAMESE_TEMPLATES: Array<schema.NewTopicTemplate> = [
  {
    grade: 3,
    subject: "vietnamese",
    title: "Mở rộng vốn từ về thiên nhiên và cộng đồng",
    description: "Học từ ngữ về thiên nhiên, đất nước, con người Việt Nam",
    context: `Học sinh mở rộng vốn từ theo các chủ điểm lớn của lớp 3. Nội dung gồm:
- Từ chỉ hiện tượng tự nhiên: sấm, chớp, mưa rào, lũ lụt, hạn hán…
- Từ chỉ cộng đồng: làng quê, thành phố, phường, xã, dân tộc…
- Từ chỉ tình cảm: yêu quê hương, tự hào, gắn bó…
- Đặt câu, tìm từ cùng nghĩa/trái nghĩa với từ cho trước
Cách Socratic: "Từ 'rào rào' gợi cho con âm thanh của gì? Con nghĩ từ nào có nghĩa gần giống?"`,
  },
  {
    grade: 3,
    subject: "vietnamese",
    title: "Nhân hóa và so sánh trong văn miêu tả",
    description: "Nhận biết và tạo câu văn dùng biện pháp nhân hóa và so sánh",
    context: `Học sinh tiếp xúc với 2 biện pháp tu từ đầu tiên. Định nghĩa:
- So sánh: dùng từ "như, giống như, tựa như, là" để so sánh sự vật với nhau
  Ví dụ: "Mặt trăng như cái đĩa bạc treo lơ lửng."
- Nhân hóa: gán cho sự vật (động vật, đồ vật) hành động/cảm xúc của con người
  Ví dụ: "Cây bàng già đung đưa đôi tay chào đón chúng tôi."
Cách Socratic: "Trong câu này, tác giả so sánh cái gì với cái gì? Dùng từ gì để so sánh?"
Không học thuộc định nghĩa — học qua ví dụ cụ thể.`,
  },
  {
    grade: 3,
    subject: "vietnamese",
    title: "Dấu phẩy, dấu chấm, dấu chấm hỏi, dấu chấm than",
    description: "Dùng đúng 4 dấu câu cơ bản, đặc biệt là dấu phẩy trong câu có liệt kê",
    context: `Học sinh lớp 3 nắm vững 4 dấu câu. Công dụng:
- Dấu chấm (.): kết thúc câu kể
- Dấu chấm hỏi (?): kết thúc câu hỏi
- Dấu chấm than (!): kết thúc câu cảm thán hoặc câu khiến
- Dấu phẩy (,): ngăn cách các bộ phận trong câu, ngăn cách khi liệt kê
Lỗi phổ biến: đặt dấu phẩy trước "và" cuối cùng trong liệt kê (không cần thiết).
Cách Socratic: "Câu này kể, hỏi hay cảm thán? Vậy con dùng dấu gì?"`,
  },
  {
    grade: 3,
    subject: "vietnamese",
    title: "Kể chuyện đã nghe / đã đọc",
    description: "Kể lại câu chuyện bằng lời của mình, có thêm chi tiết và cảm nhận",
    context: `Học sinh kể lại câu chuyện đã nghe hoặc đọc ở lớp 3. Yêu cầu:
- Kể đúng thứ tự: mở đầu → diễn biến → kết thúc
- Dùng lời kể của mình (không đọc lại văn bản)
- Thêm cảm nghĩ về nhân vật hoặc bài học rút ra
- Câu từ tự nhiên, mạch lạc
Cách Socratic: "Chuyện bắt đầu thế nào? Nhân vật chính là ai? Điều gì xảy ra tiếp theo? Kết thúc ra sao? Con thích điều gì nhất trong chuyện?"
Không kể hộ — chỉ hỏi để em tự nhớ và kể lại.`,
  },
  {
    grade: 3,
    subject: "vietnamese",
    title: "Viết đoạn văn ngắn về sự vật hoặc con người quen thuộc",
    description: "Viết 5–7 câu miêu tả hoặc kể về đồ vật, con vật, người thân",
    context: `Học sinh viết đoạn văn hoàn chỉnh hơn lớp 2. Yêu cầu:
- 5–7 câu, tập trung vào một chủ đề duy nhất
- Câu mở đầu giới thiệu đối tượng; câu tiếp theo miêu tả/kể; câu cuối nêu cảm nghĩ
- Dùng hình ảnh so sánh hoặc từ gợi cảm ít nhất 1 lần
Cách Socratic: "Con muốn viết về gì? Điều đặc biệt nhất về đối tượng đó là gì? Con bắt đầu bằng câu nào?"
Không viết hộ — gợi ý từng câu bằng câu hỏi dẫn dắt.`,
  },
]

// ---------------------------------------------------------------------------
// Grade 5 — Toán (8 templates)
// ---------------------------------------------------------------------------

const GRADE5_MATH_TEMPLATES: Array<schema.NewTopicTemplate> = [
  {
    grade: 5,
    subject: "math",
    title: "Ôn tập và nâng cao về phân số",
    description: "Ôn cộng trừ nhân chia phân số, rút gọn, quy đồng mẫu số",
    context: `Học sinh lớp 5 ôn lại và nâng cao kiến thức phân số. Nội dung gồm:
- Rút gọn: chia cả tử và mẫu cho ƯCLN
- Quy đồng mẫu số: tìm BCNN làm mẫu chung
- Cộng/trừ: quy đồng rồi cộng/trừ tử, giữ mẫu
- Nhân: tử × tử, mẫu × mẫu; rút gọn trước khi nhân nếu được
- Chia: nhân với phân số đảo ngược (a/b ÷ c/d = a/b × d/c)
Cách Socratic: "Để cộng hai phân số này, con cần làm gì trước? ƯCLN của tử và mẫu là bao nhiêu?"
Lỗi phổ biến lớp 5: rút gọn sai (không tìm đúng ƯCLN).`,
  },
  {
    grade: 5,
    subject: "math",
    title: "Phân số thập phân và số thập phân",
    description: "Chuyển đổi giữa phân số thập phân và số thập phân, đọc viết số thập phân",
    context: `Học sinh chuyển đổi hai dạng biểu diễn. Nội dung gồm:
- Phân số thập phân: mẫu là 10, 100, 1000 (ví dụ: 3/10, 25/100, 7/1000)
- Số thập phân tương ứng: 0,3 — 0,25 — 0,007
- Cách đọc: "không phẩy ba"; "hai phẩy bảy mươi lăm"
- Chuyển đổi: 0,35 = 35/100 = 7/20 (rút gọn)
Cách Socratic: "Số 0,4 có nghĩa là 4 phần gì? Con viết thành phân số thập phân được không?"
Lỗi phổ biến: đọc 0,07 là "không phẩy bảy" thay vì "không phẩy không bảy".`,
  },
  {
    grade: 5,
    subject: "math",
    title: "Cộng và trừ số thập phân",
    description: "Thực hiện phép cộng, trừ số thập phân bằng cách đặt tính thẳng dấu phẩy",
    context: `Học sinh cộng trừ số thập phân theo quy tắc đặt tính. Nội dung gồm:
- Đặt tính: thẳng dấu phẩy (dấu phẩy thẳng dấu phẩy)
- Tính từ phải sang trái như số nguyên
- Đặt dấu phẩy ở kết quả thẳng cột với các dấu phẩy bên trên
- Trường hợp số thập phân có số chữ số sau dấu phẩy khác nhau: thêm chữ số 0 để bằng nhau
Cách Socratic: "Con đặt tính 3,45 + 1,8 — con đặt dấu phẩy của 1,8 ở đâu? Tại sao?"
Lỗi phổ biến: đặt thẳng chữ số cuối thay vì thẳng dấu phẩy.`,
  },
  {
    grade: 5,
    subject: "math",
    title: "Nhân và chia số thập phân",
    description: "Nhân số thập phân với số tự nhiên; chia số thập phân cho số tự nhiên",
    context: `Học sinh nhân chia số thập phân. Quy tắc:
- Nhân với số tự nhiên: nhân như số nguyên, đếm tổng số chữ số sau dấu phẩy rồi đặt vào kết quả
  (2,35 × 4: 235 × 4 = 940 → 9,40)
- Chia cho số tự nhiên: chia như số nguyên, dấu phẩy kết quả đặt thẳng dấu phẩy số bị chia
- Nhân/chia với 10, 100, 1000: dịch dấu phẩy sang phải/trái
Cách Socratic: "Sau khi nhân xong, con đếm tổng bao nhiêu chữ số sau dấu phẩy trong các thừa số?"
Lỗi phổ biến: quên đặt dấu phẩy hoặc đặt sai vị trí.`,
  },
  {
    grade: 5,
    subject: "math",
    title: "Tỷ số phần trăm",
    description: "Hiểu và tính tỷ số phần trăm, tìm giá trị phần trăm của một số",
    context: `Học sinh làm quen với phần trăm lớp 5. Nội dung gồm:
- Tỷ số %: a% = a/100 = a × 0,01
- Tìm a% của b: lấy b × a ÷ 100 (hoặc b × a%)
- Tìm tỷ số % của hai số: (a ÷ b) × 100%
- Tìm một số khi biết a% của nó: số đó = giá trị ÷ a × 100
Ứng dụng: giảm giá, lãi suất, thống kê (phổ biến trong cuộc sống)
Cách Socratic: "20% của 80 nghĩa là 20 phần trăm của 80 — 100% là 80, vậy 1% là bao nhiêu? 20% là bao nhiêu?"
Lỗi phổ biến: nhầm chiều tính (tìm phần trăm hay tìm giá trị).`,
  },
  {
    grade: 5,
    subject: "math",
    title: "Diện tích hình thang và hình tròn",
    description: "Tính diện tích hình thang và hình tròn theo công thức",
    context: `Học sinh học công thức diện tích mới ở lớp 5. Công thức:
- Hình thang: S = (đáy lớn + đáy bé) × chiều cao ÷ 2
  (lưu ý: chiều cao vuông góc với 2 đáy, không phải cạnh bên)
- Hình tròn: S = r × r × 3,14 (trong đó r là bán kính)
  Chu vi hình tròn: C = d × 3,14 = 2 × r × 3,14
Cách Socratic cho hình thang: "Hình thang có mấy đáy? Con tìm đáy lớn và đáy bé ở đâu trong bài? Chiều cao là đoạn thẳng nào?"
Lỗi phổ biến: dùng cạnh bên làm chiều cao; quên chia 2 trong công thức hình thang.`,
  },
  {
    grade: 5,
    subject: "math",
    title: "Thể tích hình hộp chữ nhật và hình lập phương",
    description: "Tính thể tích hai hình khối bằng công thức, phân biệt thể tích và diện tích",
    context: `Học sinh học thể tích lần đầu tiên. Công thức:
- Hình hộp chữ nhật: V = dài × rộng × cao
- Hình lập phương: V = cạnh × cạnh × cạnh = a³
- Đơn vị: cm³, dm³, m³ (1 dm³ = 1 lít)
Phân biệt: diện tích (đo mặt phẳng, đơn vị vuông cm²) ≠ thể tích (đo không gian 3D, đơn vị cm³)
Cách Socratic: "Hình này có mấy chiều đo? Chiều dài, chiều rộng, chiều cao bao nhiêu? Con nghĩ công thức tính thể tích là gì?"
Lỗi phổ biến: nhầm đơn vị (ghi cm² thay vì cm³).`,
  },
  {
    grade: 5,
    subject: "math",
    title: "Giải toán chuyển động đều",
    description: "Áp dụng công thức quãng đường, vận tốc, thời gian vào bài toán thực tế",
    context: `Học sinh giải bài toán chuyển động lớp 5. Ba công thức:
- Quãng đường: s = v × t
- Vận tốc: v = s ÷ t
- Thời gian: t = s ÷ v
Đơn vị phải thống nhất: km/giờ với km và giờ; m/phút với m và phút
Các dạng bài: 1 người đi; 2 người đi cùng chiều; 2 người đi ngược chiều; 2 người xuất phát từ 2 điểm đến gặp nhau
Cách Socratic: "Bài cho biết gì? Vận tốc, quãng đường, hay thời gian? Bài hỏi gì? Con dùng công thức nào?"
Lỗi phổ biến: nhầm đơn vị thời gian (phút ÷ 60 để ra giờ).`,
  },
]

// ---------------------------------------------------------------------------
// Grade 5 — Tiếng Việt (5 templates)
// ---------------------------------------------------------------------------

const GRADE5_VIETNAMESE_TEMPLATES: Array<schema.NewTopicTemplate> = [
  {
    grade: 5,
    subject: "vietnamese",
    title: "Từ đồng âm và từ nhiều nghĩa",
    description: "Phân biệt từ đồng âm (giống âm, khác nghĩa) và từ nhiều nghĩa (liên quan nhau)",
    context: `Học sinh lớp 5 phân biệt hai hiện tượng từ vựng khác nhau:
- Từ đồng âm: phát âm giống nhau, nghĩa hoàn toàn khác, không liên quan
  Ví dụ: "bàn" (đồ vật) ≠ "bàn" (thảo luận)
- Từ nhiều nghĩa: một từ có nhiều nghĩa, các nghĩa có quan hệ với nhau
  Ví dụ: "chân" (chân người) và "chân núi" (phần dưới cùng) — đều liên quan đến "dưới cùng, nâng đỡ"
Cách phân biệt: thử đặt vào ngữ cảnh — nếu nghĩa có liên quan → nhiều nghĩa; không liên quan → đồng âm.
Cách Socratic: "Hai câu này dùng từ 'bay' — trong câu đầu 'bay' nghĩa là gì? Trong câu sau? Hai nghĩa có liên quan nhau không?"`,
  },
  {
    grade: 5,
    subject: "vietnamese",
    title: "Đại từ xưng hô và đại từ chỉ hỏi",
    description: "Nhận biết và dùng đúng đại từ trong giao tiếp theo ngôi và theo ngữ cảnh",
    context: `Học sinh nắm hệ thống đại từ tiếng Việt lớp 5. Nội dung gồm:
- Đại từ xưng hô: tôi/mình, chúng tôi, bạn, anh/chị, em, họ… — thay thế cho danh từ chỉ người
- Đại từ chỉ hỏi: ai, gì, nào, đâu, bao nhiêu, bao giờ, thế nào…
- Sử dụng đúng ngôi: ngôi thứ nhất (người nói), thứ hai (người nghe), thứ ba (người được nhắc)
Lưu ý văn hóa: tiếng Việt dùng danh từ quan hệ làm đại từ (bố, mẹ, thầy, cô…) — quan trọng và đặc trưng.
Cách Socratic: "Ai đang nói trong đoạn văn này? Người đó dùng từ gì để gọi mình? Đó là ngôi thứ mấy?"`,
  },
  {
    grade: 5,
    subject: "vietnamese",
    title: "Câu ghép — cấu tạo và quan hệ các vế",
    description: "Nhận biết câu ghép, xác định các vế câu và từ nối thể hiện quan hệ ý nghĩa",
    context: `Học sinh phân tích câu ghép lớp 5. Nội dung gồm:
- Câu ghép: gồm 2+ vế, mỗi vế có chủ ngữ và vị ngữ riêng
- Từ nối và quan hệ ý nghĩa:
  - Nguyên nhân–kết quả: vì… nên…; do… nên…; vì… nên…
  - Điều kiện–kết quả: nếu… thì…; hễ… thì…
  - Tương phản: tuy… nhưng…; mặc dù… nhưng…
  - Tăng tiến: không những… mà còn…
Cách Socratic: "Câu này có mấy chủ ngữ – vị ngữ? Từ nối giữa hai vế là gì? Quan hệ giữa hai vế là gì?"
Lỗi phổ biến: nhầm câu ghép với câu đơn có vị ngữ ghép.`,
  },
  {
    grade: 5,
    subject: "vietnamese",
    title: "Tập làm văn: tả cảnh và tả người",
    description: "Viết bài văn tả cảnh thiên nhiên hoặc tả người theo cấu trúc 3 phần",
    context: `Học sinh viết bài văn tả hoàn chỉnh. Cấu trúc 3 phần:
1. Mở bài: giới thiệu cảnh/người (trực tiếp hoặc gián tiếp)
2. Thân bài — Tả cảnh: bao quát → từng phần theo thứ tự không gian/thời gian
   Thân bài — Tả người: ngoại hình (vóc dáng, khuôn mặt, trang phục) → hoạt động → tính cách
3. Kết bài: cảm nghĩ, ấn tượng sâu nhất
Yêu cầu lớp 5: có hình ảnh so sánh, nhân hóa; lời văn gợi cảm; không liệt kê khô khan.
Cách Socratic: "Con tả cái gì? Điều ấn tượng nhất là gì? Con bắt đầu bằng câu mở bài như thế nào?"
Không viết hộ — đặt câu hỏi từng bước để em tự viết.`,
  },
  {
    grade: 5,
    subject: "vietnamese",
    title: "Đọc hiểu và phân tích văn bản văn học",
    description: "Đọc hiểu nội dung, nghệ thuật và ý nghĩa văn bản thơ, văn xuôi lớp 5",
    context: `Học sinh đọc hiểu văn bản ở mức cao hơn — không chỉ nội dung mà cả nghệ thuật. Nội dung gồm:
- Nội dung: nhân vật, sự kiện, chủ đề, thông điệp tác giả muốn truyền đạt
- Nghệ thuật: từ ngữ đặc sắc, hình ảnh, biện pháp tu từ (so sánh, nhân hóa, ẩn dụ)
- Liên hệ bản thân: bài học rút ra, cảm xúc khi đọc
Cách Socratic: "Đoạn này tác giả dùng hình ảnh nào gây ấn tượng nhất? Tại sao tác giả so sánh như vậy? Con rút ra bài học gì?"
Không phân tích hộ — gợi ý bằng câu hỏi để em tự suy nghĩ và trình bày.`,
  },
]

async function seedTemplates() {
  console.log("🌱 Seeding topic templates...")

  // Seed each batch only if that subject+grade combination has no rows yet
  const batches: { label: string; rows: Array<schema.NewTopicTemplate> }[] = [
    { label: "Grade 1 Math (7 templates)", rows: GRADE1_MATH_TEMPLATES },
    { label: "Grade 1 Tiếng Việt (5 templates)", rows: GRADE1_VIETNAMESE_TEMPLATES },
    { label: "Grade 2 Math (7 templates)", rows: GRADE2_MATH_TEMPLATES },
    { label: "Grade 2 Tiếng Việt (5 templates)", rows: GRADE2_VIETNAMESE_TEMPLATES },
    { label: "Grade 3 Math (8 templates)", rows: GRADE3_MATH_TEMPLATES },
    { label: "Grade 3 Tiếng Việt (5 templates)", rows: GRADE3_VIETNAMESE_TEMPLATES },
    { label: "Grade 4 Math (15 templates)", rows: GRADE4_MATH_TEMPLATES },
    { label: "Grade 4 Tiếng Việt (10 templates)", rows: GRADE4_VIETNAMESE_TEMPLATES },
    { label: "Grade 5 Math (8 templates)", rows: GRADE5_MATH_TEMPLATES },
    { label: "Grade 5 Tiếng Việt (5 templates)", rows: GRADE5_VIETNAMESE_TEMPLATES },
  ]

  for (const batch of batches) {
    const first = batch.rows[0]
    if (!first) continue

    const existing = await db
      .select({ id: schema.topicTemplates.id })
      .from(schema.topicTemplates)
      .where(
        and(
          eq(schema.topicTemplates.grade, first.grade),
          eq(schema.topicTemplates.subject, first.subject),
        ),
      )

    if (existing.length > 0) {
      console.log(`⚠️  ${batch.label} — đã có ${existing.length} rows, skip`)
      continue
    }

    await db.insert(schema.topicTemplates).values(batch.rows)
    console.log(`✅ Seeded ${batch.label}`)
  }

  console.log("   verified_at = NULL (draft) — cần giáo viên review trước khi dùng")
}

seedTemplates()
  .catch((e) => {
    console.error("❌", e)
    process.exitCode = 1
  })
  .finally(() => client.end())
