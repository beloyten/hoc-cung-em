// src/db/seed.ts
// Seed dev data cho local / staging
// pnpm tsx src/db/seed.ts

import { db } from "./index"

async function seed() {
  console.log("🌱 Seeding dev data...")
  // TODO: thêm seed data theo DATABASE_SCHEMA.md
  console.log("✅ Done")
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
