// src/app/api/cron/weekly-reports/route.ts
import { timingSafeEqual } from "node:crypto"
import { NextResponse, type NextRequest } from "next/server"
import { runWeeklyReports } from "@/server/cron/weekly-reports"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 300

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = req.headers.get("authorization")
  if (header && safeEqual(header, `Bearer ${secret}`)) return true
  const url = new URL(req.url)
  const token = url.searchParams.get("token")
  return token !== null && safeEqual(token, secret)
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }
  const result = await runWeeklyReports()
  return NextResponse.json({ ok: true, result })
}
