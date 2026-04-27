import "server-only"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
})

// Free tier — gemini-2.5-flash có quota generous; gemini-2.5-flash-lite làm fallback rẻ hơn
export const FLASH = "gemini-2.5-flash"
export const FLASH_BACKUP = "gemini-2.5-flash-lite"
