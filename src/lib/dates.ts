// Helpers ngày tháng cho UI

function fmtISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Trả về ngày Monday của tuần chứa `d` (theo giờ địa phương). */
export function startOfWeek(d: Date): Date {
  const out = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dow = out.getDay() // 0 = Sun
  const diff = dow === 0 ? -6 : 1 - dow
  out.setDate(out.getDate() + diff)
  return out
}

/** Tuần ISO (1–53) — đủ chính xác cho hiển thị tuần học. */
export function isoWeekNumber(d: Date): number {
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dayNr = (target.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const diff = target.getTime() - firstThursday.getTime()
  return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000))
}

export function currentWeekDates(now = new Date()): {
  weekNumber: number
  startDate: string
  endDate: string
} {
  const start = startOfWeek(now)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return {
    weekNumber: isoWeekNumber(now),
    startDate: fmtISO(start),
    endDate: fmtISO(end),
  }
}
