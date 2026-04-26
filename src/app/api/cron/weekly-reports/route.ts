// src/app/api/cron/weekly-reports/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { runWeeklyReports } from "@/server/cron/weekly-reports"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 300

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = req.headers.get("authorization")
  if (header === `Bearer ${secret}`) return true
  const url = new URL(req.url)
  return url.searchParams.get("token") === secret
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }
  const result = await runWeeklyReports()
  return NextResponse.json({ ok: true, result })
}
