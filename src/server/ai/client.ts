import "server-only"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateObject } from "ai"
import type { z } from "zod"

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
})

// Free tier — gemini-2.5-flash có quota generous; gemini-2.5-flash-lite làm fallback rẻ hơn
export const FLASH = "gemini-2.5-flash"
export const FLASH_BACKUP = "gemini-2.5-flash-lite"

/**
 * generateObject có khả năng chịu lỗi: thử model chính, nếu lỗi (rate-limit,
 * 5xx, hoặc model sinh output không khớp schema) thì tự động thử model backup.
 * Dùng temperature thấp để output có cấu trúc ổn định hơn.
 *
 * Trả về object kèm `modelUsed` (model thực sự tạo ra kết quả) để ghi telemetry.
 * Ném lỗi cuối cùng nếu tất cả model đều thất bại — caller tự xử lý.
 */
export async function generateObjectWithFallback<SCHEMA extends z.ZodTypeAny>(opts: {
  schema: SCHEMA
  prompt: string
  system?: string
  temperature?: number
  models?: string[]
}): Promise<{ object: z.infer<SCHEMA>; modelUsed: string }> {
  const models = opts.models ?? [FLASH, FLASH_BACKUP]
  let lastError: unknown
  for (const model of models) {
    try {
      const { object } = await generateObject({
        model: google(model),
        schema: opts.schema,
        prompt: opts.prompt,
        temperature: opts.temperature ?? 0.4,
        ...(opts.system ? { system: opts.system } : {}),
      })
      return { object: object as z.infer<SCHEMA>, modelUsed: model }
    } catch (e) {
      lastError = e
      console.warn(`[ai] generateObject thất bại với model ${model}, thử model tiếp theo`, e)
    }
  }
  throw lastError
}

