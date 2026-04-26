// src/db/seed.ts
// Seed dev data cho lớp 4A1
// pnpm db:seed (dùng DATABASE_URL_MIGRATE để bypass RLS)

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

async function seed() {
  console.log("🌱 Seeding dev data cho lớp 4A1...")

  const [teacher] = await db
    .insert(schema.teachers)
    .values({
      authUserId: "00000000-0000-0000-0000-000000000001",
      fullName: "Cô Linh",
      email: "co.linh@hoccungem.test",
    })
    .onConflictDoNothing()
    .returning()

  if (!teacher) {
    console.log("⚠️  Teacher đã tồn tại — skip seed")
    return
  }

  const [classRow] = await db
    .insert(schema.classes)
    .values({
      teacherId: teacher.id,
      name: "4A1",
      grade: 4,
      joinCode: "K7M2P9",
    })
    .returning()

  if (!classRow) throw new Error("Failed to insert class")

  const studentNames = ["Nguyễn An", "Trần Bình", "Lê Châu", "Phạm Dung", "Hoàng Em"]
  await db.insert(schema.students).values(
    studentNames.map((name, i) => ({
      classId: classRow.id,
      fullName: name,
      studentCode: `HS${String(i + 1).padStart(2, "0")}`,
    })),
  )

  await db.insert(schema.studyTopics).values({
    classId: classRow.id,
    title: "Phép cộng có nhớ trong phạm vi 10000",
    weekNumber: 1,
    startDate: "2026-04-27",
    endDate: "2026-05-03",
    context: "Học sinh ôn tập phép cộng có nhớ với số có 4 chữ số.",
  })

  console.log("✅ Seed done — lớp 4A1, 5 học sinh, 1 chủ đề")
}

seed()
  .catch((e) => {
    console.error("❌", e)
    process.exitCode = 1
  })
  .finally(() => client.end())
