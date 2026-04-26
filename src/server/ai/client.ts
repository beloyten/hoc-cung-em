import "server-only"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
})

export const FLASH = "gemini-2.0-flash"
export const FLASH_BACKUP = "gemini-1.5-flash"
