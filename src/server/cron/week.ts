// src/server/cron/week.ts
// Helpers tính tuần ICT (Asia/Ho_Chi_Minh) cho cron weekly jobs.
import "server-only"

const ICT_OFFSET_HOURS = 7

/**
 * Lấy ngày bắt đầu tuần (Thứ Hai) của tuần *vừa kết thúc* tính theo ICT.
 * Cron chạy đầu tuần mới (sáng thứ Hai ICT) và tổng hợp tuần trước đó.
 * Trả về ISO date string `YYYY-MM-DD`.
 */
export function previousWeekStartICT(now: Date = new Date()): string {
  // Đưa về giờ ICT
  const ictMs = now.getTime() + ICT_OFFSET_HOURS * 3600_000
  const ict = new Date(ictMs)
  // getUTCDay sau khi shift = ngày trong tuần ICT (0=CN, 1=T2, ..., 6=T7)
  const dow = ict.getUTCDay()
  // Khoảng cách từ ICT hôm nay tới Thứ Hai gần nhất *trước đó* của tuần trước
  // (nếu hôm nay là T2: tuần trước bắt đầu cách 7 ngày; T3: 8; ... CN: 13)
  const daysSinceMonday = (dow + 6) % 7
  const daysBack = daysSinceMonday + 7
  const monday = new Date(
    Date.UTC(ict.getUTCFullYear(), ict.getUTCMonth(), ict.getUTCDate() - daysBack),
  )
  const yyyy = monday.getUTCFullYear()
  const mm = String(monday.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(monday.getUTCDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Trả về [start, endExclusive] dưới dạng Date UTC tương ứng tuần (T2 00:00 ICT → T2 00:00 ICT tuần sau).
 */
export function weekRangeUTC(weekStart: string): { start: Date; endExclusive: Date } {
  const [y, m, d] = weekStart.split("-").map((s) => Number.parseInt(s, 10))
  // T2 00:00 ICT = T1 17:00 UTC ngày trước
  const start = new Date(Date.UTC(y!, m! - 1, d!, -ICT_OFFSET_HOURS, 0, 0, 0))
  const endExclusive = new Date(start.getTime() + 7 * 24 * 3600_000)
  return { start, endExclusive }
}
