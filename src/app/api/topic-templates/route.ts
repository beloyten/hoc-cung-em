// src/app/api/topic-templates/route.ts
import { NextResponse } from "next/server"
import { and, asc, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { topicTemplates } from "@/db/schema"
import { subjectEnum } from "@/db/schema/study-topics"
import { AuthError, requireUser } from "@/server/auth"

const querySchema = z.object({
  grade: z.coerce.number().int().min(1).max(5),
  subject: z.enum(subjectEnum.enumValues).optional(),
})

export async function GET(req: Request) {
  try {
    await requireUser()
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    throw e
  }

  const { searchParams } = new URL(req.url)
  const parsed = querySchema.safeParse({
    grade: searchParams.get("grade"),
    subject: searchParams.get("subject") ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query params" }, { status: 400 })
  }

  const { grade, subject } = parsed.data

  const templates = await db
    .select()
    .from(topicTemplates)
    .where(
      subject
        ? and(eq(topicTemplates.grade, grade), eq(topicTemplates.subject, subject))
        : eq(topicTemplates.grade, grade),
    )
    .orderBy(asc(topicTemplates.title))

  return NextResponse.json(templates)
}
