import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AI_PERSONA_NAME, APP_NAME, APP_SLOGAN, ROUTES } from "@/lib/constants"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-linear-to-b from-sky-50 via-white to-white">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/logo.png"
            alt={`${APP_NAME} logo`}
            width={40}
            height={40}
            priority
            className="rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight text-slate-900">{APP_NAME}</span>
        </div>
        <Link href={ROUTES.login} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Đăng nhập
        </Link>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 py-16 text-center">
        <Image
          src="/icons/logo.png"
          alt={`${APP_NAME} logo`}
          width={160}
          height={160}
          priority
          className="mb-8 drop-shadow-md"
        />
        <h1 className="max-w-3xl text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          AI không làm bài hộ.
          <br />
          <span className="text-sky-600">AI học cùng em.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
          Trợ giảng Toán lớp 4 cùng <strong className="text-slate-900">{AI_PERSONA_NAME}</strong> —
          phương pháp Socratic, từng bước giúp em tự tìm ra đáp án thay vì cho sẵn lời giải.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={ROUTES.login}
            className={`${buttonVariants({ size: "lg" })} bg-sky-600 px-8 hover:bg-sky-700`}
          >
            Bắt đầu học
          </Link>
          <Link
            href={ROUTES.parent.home}
            className={`${buttonVariants({ variant: "outline", size: "lg" })} px-8`}
          >
            Dành cho phụ huynh
          </Link>
        </div>

        {/* Features */}
        <section className="mt-20 grid w-full gap-4 sm:grid-cols-3">
          <Card className="border-sky-100">
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="text-3xl">🤔</div>
              <h3 className="font-semibold text-slate-900">Hỏi để hiểu</h3>
              <p className="text-sm text-slate-600">
                Cô Mây dẫn dắt bằng câu hỏi thay vì đưa đáp án sẵn.
              </p>
            </CardContent>
          </Card>
          <Card className="border-sky-100">
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="text-3xl">📊</div>
              <h3 className="font-semibold text-slate-900">Báo cáo cho ba mẹ</h3>
              <p className="text-sm text-slate-600">
                Tóm tắt tuần qua email — em học gì, vướng đâu.
              </p>
            </CardContent>
          </Card>
          <Card className="border-sky-100">
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="text-3xl">👩‍🏫</div>
              <h3 className="font-semibold text-slate-900">Hỗ trợ giáo viên</h3>
              <p className="text-sm text-slate-600">
                Insight cả lớp — phần nào nhiều bạn còn vướng.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-center text-sm text-slate-500">
        <p>{APP_SLOGAN}</p>
        <p className="mt-1">Sản phẩm dự thi Sáng tạo KHKT — Lớp 4A1</p>
      </footer>
    </div>
  )
}
