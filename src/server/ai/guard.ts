// src/server/ai/guard.ts
// Lớp validate output của AI trước khi gửi ra cho HS.

const FORBIDDEN_PATTERNS: Array<{ regex: RegExp; reason: string }> = [
  { regex: /đáp\s*(số|án)\s*(là|=|:)/i, reason: "direct_answer" },
  { regex: /=\s*\d+\s*[.\n]/, reason: "computed_result" },
  { regex: /bài\s*tập\s*về\s*nhà|btvn|bài\s*về\s*nhà/i, reason: "btvn_term" },
  { regex: /^.{0,30}=\s*\d+/m, reason: "leading_equation" },
]

export type GuardResult =
  | { status: "passed"; text: string }
  | { status: "violated"; reason: string; text: string }

export function aiGuard(text: string): GuardResult {
  for (const { regex, reason } of FORBIDDEN_PATTERNS) {
    if (regex.test(text)) {
      return { status: "violated", reason, text }
    }
  }
  return { status: "passed", text }
}

export const FALLBACK_RESPONSE =
  "Cô đang nghĩ cách hỏi con cho dễ hiểu hơn. Con thử đọc lại đề và nói cho cô biết em hiểu gì nhé! 😊"
