// src/db/seed-templates.ts
// Seed topic templates — Grade 4 Math (GDPT 2018 framework)
// pnpm db:seed-templates
//
// Templates seeded với verified_at = NULL (draft).
// Cần giáo viên review theo SGK 2024–2026 trước khi set verified_at.

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

async function seedTemplates() {
  console.log("🌱 Seeding topic templates — Grade 4 Math...")

  const existing = await db
    .select({ id: schema.topicTemplates.id })
    .from(schema.topicTemplates)

  if (existing.length > 0) {
    console.log(`⚠️  ${existing.length} templates đã tồn tại — skip seed`)
    return
  }

  await db.insert(schema.topicTemplates).values(GRADE4_MATH_TEMPLATES)

  console.log(`✅ Seeded ${GRADE4_MATH_TEMPLATES.length} Grade 4 Math templates`)
  console.log("   verified_at = NULL (draft) — cần giáo viên review trước khi dùng")
}

seedTemplates()
  .catch((e) => {
    console.error("❌", e)
    process.exitCode = 1
  })
  .finally(() => client.end())
