import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { APP_NAME, APP_SLOGAN, ROUTES } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: `Chính sách bảo mật và quyền riêng tư của ${APP_NAME} — ứng dụng trợ giảng Toán lớp 4.`,
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col bg-linear-to-b from-sky-50 via-white to-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href={ROUTES.home} className="flex items-center gap-3">
          <Image
            src="/icons/logo.png"
            alt={`${APP_NAME} logo`}
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight text-slate-900">{APP_NAME}</span>
        </Link>
        <Link href={ROUTES.login} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Đăng nhập
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chính sách bảo mật</h1>
        <p className="mt-2 text-sm text-slate-500">Cập nhật lần cuối: tháng 6 năm 2026</p>

        <div className="mt-8 space-y-8 text-slate-700">
          <Section title="1. Giới thiệu">
            <p>
              {APP_NAME} là ứng dụng trợ giảng Toán lớp 4 sử dụng trí tuệ nhân tạo, được phát triển
              phục vụ mục đích giáo dục. Chúng tôi cam kết bảo vệ quyền riêng tư của học sinh, phụ
              huynh và giáo viên sử dụng ứng dụng.
            </p>
          </Section>

          <Section title="2. Thông tin chúng tôi thu thập">
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Thông tin tài khoản:</strong> Số điện thoại hoặc địa chỉ email dùng để đăng
                nhập (xác thực OTP, không lưu mật khẩu).
              </li>
              <li>
                <strong>Thông tin học sinh:</strong> Họ tên (do phụ huynh hoặc giáo viên cung cấp),
                lớp học.
              </li>
              <li>
                <strong>Lịch sử trò chuyện:</strong> Nội dung hội thoại giữa học sinh và Cô Mây
                trong từng phiên học.
              </li>
              <li>
                <strong>Dữ liệu sử dụng:</strong> Thời gian học, số lượt hỏi, chủ đề được hỏi — dùng
                để tạo báo cáo học tập.
              </li>
            </ul>
          </Section>

          <Section title="3. Mục đích sử dụng thông tin">
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Cung cấp trải nghiệm học tập cá nhân hóa qua Cô Mây.</li>
              <li>
                Gửi báo cáo học tập hàng tuần cho phụ huynh qua email (nếu đã đăng ký email).
              </li>
              <li>Hỗ trợ giáo viên theo dõi tiến độ và phát hiện học sinh cần hỗ trợ thêm.</li>
              <li>Cải thiện chất lượng hệ thống giáo dục AI.</li>
            </ul>
          </Section>

          <Section title="4. Chia sẻ thông tin">
            <p>
              Chúng tôi <strong>không bán</strong> thông tin cá nhân cho bên thứ ba. Dữ liệu chỉ
              được chia sẻ trong các trường hợp sau:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Giáo viên phụ trách:</strong> Có thể xem lịch sử học tập của học sinh trong
                lớp để hỗ trợ giảng dạy.
              </li>
              <li>
                <strong>Phụ huynh:</strong> Có thể xem toàn bộ lịch sử hội thoại của con em mình.
              </li>
              <li>
                <strong>Nhà cung cấp dịch vụ kỹ thuật:</strong> Google (xử lý AI), Supabase (lưu trữ
                dữ liệu), Vercel (hosting) — theo hợp đồng bảo mật nghiêm ngặt.
              </li>
            </ul>
          </Section>

          <Section title="5. Bảo mật dữ liệu">
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Dữ liệu được mã hóa khi truyền tải (HTTPS/TLS).</li>
              <li>Xác thực bằng OTP, không lưu mật khẩu.</li>
              <li>
                Kiểm soát truy cập theo vai trò — phụ huynh chỉ thấy dữ liệu của con em mình, giáo
                viên chỉ thấy học sinh trong lớp.
              </li>
              <li>Dữ liệu được lưu trên hạ tầng đám mây với tiêu chuẩn bảo mật cao.</li>
            </ul>
          </Section>

          <Section title="6. Quyền của người dùng">
            <p>Phụ huynh và giáo viên có quyền:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Xem toàn bộ dữ liệu liên quan đến con em / học sinh.</li>
              <li>Yêu cầu xóa dữ liệu bằng cách liên hệ với chúng tôi.</li>
              <li>Ngừng sử dụng dịch vụ bất cứ lúc nào.</li>
            </ul>
          </Section>

          <Section title="7. Chính sách dành cho trẻ em">
            <p>
              {APP_NAME} phục vụ học sinh tiểu học. Tài khoản học sinh được tạo và quản lý bởi phụ
              huynh hoặc giáo viên — không có học sinh nào tự đăng ký. Toàn bộ hoạt động của học
              sinh đều có thể được phụ huynh và giáo viên giám sát.
            </p>
          </Section>

          <Section title="8. Liên hệ">
            <p>
              Mọi thắc mắc về quyền riêng tư, vui lòng liên hệ qua email:{" "}
              <a
                href="mailto:hoccungemvn@gmail.com"
                className="text-sky-600 underline underline-offset-4 hover:text-sky-700"
              >
                hoccungemvn@gmail.com
              </a>
            </p>
          </Section>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-center text-sm text-slate-500">
        <p>{APP_SLOGAN}</p>
        <p className="mt-1">
          <Link href={ROUTES.home} className="underline underline-offset-4 hover:text-slate-700">
            Quay về trang chủ
          </Link>
        </p>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  )
}
