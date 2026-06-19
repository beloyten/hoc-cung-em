// src/db/seed-templates.ts
// Seed topic templates — Grade 4 Math + Tiếng Việt (GDPT 2018 framework)
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

async function seedTemplates() {
  console.log("🌱 Seeding topic templates...")

  // Seed each batch only if that subject+grade combination has no rows yet
  const batches: { label: string; rows: Array<schema.NewTopicTemplate> }[] = [
    { label: "Grade 4 Math (15 templates)", rows: GRADE4_MATH_TEMPLATES },
    { label: "Grade 4 Tiếng Việt (10 templates)", rows: GRADE4_VIETNAMESE_TEMPLATES },
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
