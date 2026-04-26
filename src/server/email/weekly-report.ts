// src/server/email/weekly-report.ts
import "server-only"
import { appUrl, fromEmail, resend } from "./client"

interface SendWeeklyReportEmailArgs {
  to: string
  parentName: string
  studentName: string
  weekStart: string // YYYY-MM-DD
  summary: string
  highlights: string[]
  improve: string[]
  actions: string[]
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function listHtml(items: string[]): string {
  if (items.length === 0) return ""
  return `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`
}

function formatWeek(weekStart: string): string {
  const d = new Date(weekStart)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

export async function sendWeeklyReportEmail(args: SendWeeklyReportEmailArgs): Promise<void> {
  const subject = `Báo cáo tuần của ${args.studentName} (tuần ${formatWeek(args.weekStart)})`
  const url = `${appUrl()}/parent/reports`
  const html = `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8" /><title>${escapeHtml(subject)}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width:560px; margin:0 auto; padding:24px; color:#111;">
  <p>Kính gửi anh/chị ${escapeHtml(args.parentName)},</p>
  <p>Cô Mây gửi báo cáo tuần của <strong>${escapeHtml(args.studentName)}</strong>:</p>
  <p style="background:#f6f6f6; border-radius:8px; padding:12px;">${escapeHtml(args.summary)}</p>
  ${args.highlights.length ? `<h3 style="margin-bottom:4px;">Điểm tiến bộ</h3>${listHtml(args.highlights)}` : ""}
  ${args.improve.length ? `<h3 style="margin-bottom:4px;">Cần luyện thêm</h3>${listHtml(args.improve)}` : ""}
  ${args.actions.length ? `<h3 style="margin-bottom:4px;">Gợi ý cho phụ huynh</h3>${listHtml(args.actions)}` : ""}
  <p style="margin-top:24px;"><a href="${url}" style="background:#2563eb; color:#fff; padding:10px 16px; border-radius:8px; text-decoration:none;">Xem trên HọcCùngEm</a></p>
  <p style="color:#666; font-size:12px; margin-top:24px;">Bạn nhận email này vì đã liên kết với học sinh trên HọcCùngEm.</p>
</body>
</html>`

  const text = `${args.summary}

Xem chi tiết: ${url}`

  await resend().emails.send({
    from: fromEmail(),
    to: args.to,
    subject,
    html,
    text,
  })
}
