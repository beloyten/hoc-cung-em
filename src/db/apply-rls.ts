import { readFileSync } from "node:fs"
import { config } from "dotenv"
import postgres from "postgres"

config({ path: ".env.local", override: true })

const url = process.env.DATABASE_URL_MIGRATE
if (!url) {
  console.error("DATABASE_URL_MIGRATE missing")
  process.exit(1)
}

const sql = postgres(url, { prepare: false, max: 1 })
const text = readFileSync("src/db/rls-policies.sql", "utf8")

async function main() {
  try {
    await sql.unsafe(text)
    console.log("✅ RLS policies applied")
  } catch (e) {
    console.error("❌", e instanceof Error ? e.message : e)
    process.exitCode = 1
  } finally {
    await sql.end()
  }
}

void main()
