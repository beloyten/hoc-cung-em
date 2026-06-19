import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { AI_PERSONA_NAME, APP_NAME, APP_SLOGAN, ROUTES } from "@/lib/constants"

export const metadata: Metadata = {
  title: "HocCungEm — AI học cùng em",
  description:
    "Trợ giảng Toán lớp 4 cùng Cô Mây — phương pháp Socratic, giúp học sinh tự tìm ra đáp án thay vì cho sẵn lời giải.",
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/logo.png"
              alt={`${APP_NAME} logo`}
              width={36}
              height={36}
              priority
              className="rounded-lg"
            />
            <span className="text-base font-bold tracking-tight text-slate-900">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`${ROUTES.login}?role=teacher`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Giáo viên
            </Link>
            <Link href={`${ROUTES.login}?role=parent`} className={buttonVariants({ size: "sm" })}>
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-linear-to-b from-sky-50 to-white px-6 py-20 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
              ✨ Gia sư AI miễn phí cho học sinh lớp 4
            </div>
            <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              AI không làm bài hộ.
              <br />
              <span className="text-sky-600">AI học cùng em.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              <strong className="text-slate-800">{AI_PERSONA_NAME}</strong> là gia sư AI dạy Toán
              lớp 4 theo phương pháp Socratic — không cho đáp án sẵn, chỉ đặt câu hỏi dẫn dắt để
              học sinh tự tìm ra lời giải.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={`${ROUTES.login}?role=parent`}
                className={`${buttonVariants({ size: "lg" })} bg-sky-600 px-8 text-base hover:bg-sky-700`}
              >
                Bắt đầu học miễn phí
              </Link>
              <Link
                href={`${ROUTES.login}?role=teacher`}
                className={`${buttonVariants({ variant: "outline", size: "lg" })} px-8 text-base`}
              >
                Đăng ký cho lớp học
              </Link>
            </div>
          </div>
        </section>

        {/* Chat demo */}
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Cô Mây dạy như thế nào?
              </h2>
              <p className="mt-3 text-slate-600">
                Không bao giờ cho đáp án — chỉ gợi ý từng bước để em tự nghĩ ra.
              </p>
            </div>

            <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b bg-white px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm">
                  🌥️
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{AI_PERSONA_NAME}</p>
                  <p className="text-xs text-slate-500">Gia sư Toán lớp 4</p>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-3 bg-slate-50 p-4">
                <ChatBubble role="user" text="Cô ơi, 24 × 5 bằng bao nhiêu ạ?" />
                <ChatBubble
                  role="assistant"
                  text="Con thử nhớ lại: 24 × 5 cũng giống 24 × 10 rồi chia đôi không nhỉ? 24 × 10 bằng bao nhiêu con biết không?"
                />
                <ChatBubble role="user" text="Dạ 240 ạ!" />
                <ChatBubble
                  role="assistant"
                  text="Chính xác! Vậy 240 chia đôi là bao nhiêu? Con tính thử xem nhé 😊"
                />
                <ChatBubble role="user" text="Là 120 ạ! Vậy 24 × 5 = 120!" />
                <ChatBubble
                  role="assistant"
                  text="Giỏi quá! Con tự tìm ra rồi đó — và cách tính này con sẽ nhớ rất lâu vì tự nghĩ ra mà. Con có muốn thử bài khó hơn không?"
                />
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-slate-500">
              Học sinh tự tìm ra đáp án — Cô Mây chỉ đặt câu hỏi đúng lúc.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Hoạt động thế nào?</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              <Step
                number="1"
                title="Giáo viên tạo chủ đề"
                description="GV đăng ký lớp, tạo chủ đề tuần và gửi mã mời cho phụ huynh. Chỉ mất 2 phút."
              />
              <Step
                number="2"
                title="Học sinh hỏi Cô Mây"
                description="Phụ huynh mở app, con nhắn tin hỏi bài. Cô Mây dẫn dắt bằng câu hỏi Socratic — không cho đáp án sẵn."
              />
              <Step
                number="3"
                title="Phụ huynh & GV theo dõi"
                description="Báo cáo học tập hàng tuần qua email. GV xem insight cả lớp — phần nào học sinh còn vướng mắc."
              />
            </div>
          </div>
        </section>

        {/* Features by role */}
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Dành cho cả ba bên
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <RoleCard
                emoji="👦"
                role="Học sinh"
                color="sky"
                features={[
                  "Hỏi bài 24/7, không cần chờ",
                  "Cô Mây kiên nhẫn, không phán xét",
                  "Tự tin hơn khi tự tìm ra đáp án",
                ]}
              />
              <RoleCard
                emoji="👨‍👩‍👦"
                role="Phụ huynh"
                color="violet"
                features={[
                  "Xem toàn bộ hội thoại của con",
                  "Nhận báo cáo học tập hàng tuần",
                  "Yên tâm khi con học đúng cách",
                ]}
              />
              <RoleCard
                emoji="👩‍🏫"
                role="Giáo viên"
                color="emerald"
                features={[
                  "Tạo chủ đề, quản lý lớp dễ dàng",
                  "Insight: phần nào cả lớp vướng",
                  "Tiết kiệm thời gian giải đáp ngoài giờ",
                ]}
              />
            </div>
          </div>
        </section>

        {/* CTA bottom */}
        <section className="bg-sky-600 px-6 py-16 text-center text-white">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Bắt đầu ngay hôm nay — hoàn toàn miễn phí
            </h2>
            <p className="mt-4 text-sky-100">
              Không cần cài đặt. Mở trên bất kỳ điện thoại, máy tính bảng hay laptop nào.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={`${ROUTES.login}?role=parent`}
                className={`${buttonVariants({ size: "lg" })} bg-white px-8 text-base text-sky-700 hover:bg-sky-50`}
              >
                Phụ huynh — Đăng ký ngay
              </Link>
              <Link
                href={`${ROUTES.login}?role=teacher`}
                className={`${buttonVariants({ variant: "outline", size: "lg" })} border-white bg-transparent px-8 text-base text-white hover:bg-sky-700`}
              >
                Giáo viên — Tạo lớp học
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 px-6 py-10 text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center text-sm sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/logo.png"
              alt={APP_NAME}
              width={28}
              height={28}
              className="rounded-md opacity-80"
            />
            <div>
              <p className="font-semibold text-white">{APP_NAME}</p>
              <p className="text-xs">{APP_SLOGAN}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs sm:text-right">
            <Link href={ROUTES.privacy} className="hover:text-white underline underline-offset-4">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ChatBubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  const isUser = role === "user"
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-sky-600 px-3 py-2 text-sm text-white"
            : "max-w-[80%] rounded-2xl rounded-tl-sm border bg-white px-3 py-2 text-sm text-slate-800 shadow-sm"
        }
      >
        {!isUser && (
          <p className="mb-1 text-xs font-semibold text-sky-600">{AI_PERSONA_NAME}</p>
        )}
        {text}
      </div>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-lg font-bold text-white">
        {number}
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  )
}

type RoleColor = "sky" | "violet" | "emerald"

const ROLE_CARD_HEADER: Record<RoleColor, string> = {
  sky: "bg-sky-50 border-sky-100",
  violet: "bg-violet-50 border-violet-100",
  emerald: "bg-emerald-50 border-emerald-100",
}
const ROLE_CARD_BADGE: Record<RoleColor, string> = {
  sky: "bg-sky-100 text-sky-700",
  violet: "bg-violet-100 text-violet-700",
  emerald: "bg-emerald-100 text-emerald-700",
}
const ROLE_CARD_DOT: Record<RoleColor, string> = {
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
}

function RoleCard({
  emoji,
  role,
  color,
  features,
}: {
  emoji: string
  role: string
  color: RoleColor
  features: string[]
}) {

  return (
    <div className={`rounded-2xl border p-5 ${ROLE_CARD_HEADER[color]}`}>
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${ROLE_CARD_BADGE[color]}`}>
        <span>{emoji}</span>
        {role}
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${ROLE_CARD_DOT[color]}`} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
