// src/server/ai/guard.ts
// Lớp validate output của AI trước khi gửi ra cho HS.

const FORBIDDEN_PATTERNS: Array<{ regex: RegExp; reason: string }> = [
  { regex: /đáp\s*(số|án)\s*(là|=|:)/i, reason: "direct_answer" },
  // Negative lookbehind (?<!\d\s*): không block arithmetic scaffolds như "7 + 5 = 12."
  { regex: /(?<!\d\s*)=\s*\d+\s*[.\n]/, reason: "computed_result" },
  { regex: /bài\s*tập\s*về\s*nhà|btvn|bài\s*về\s*nhà/i, reason: "btvn_term" },
  // Chỉ block khi "= số [đơn vị]" đứng cuối dòng — không block formula như "= 4 × cạnh"
  // hay câu hỏi Socrates như "cạnh = 5 thì chu vi là gì?"
  { regex: /^.{0,20}=\s*\d+(?:\.\d+)?(?:\s*(?:cm²?|m²?|km|mm|dm|kg|g|ml?|l|ha))?\s*$/im, reason: "leading_equation" },
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
