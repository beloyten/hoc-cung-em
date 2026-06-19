"use client"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AI_PERSONA_NAME } from "@/lib/constants"

interface DemoBubble {
  role: "user" | "assistant"
  text: string
}

const DEMO_SCRIPT: DemoBubble[] = [
  { role: "user", text: "Cô ơi, 24 × 5 bằng bao nhiêu ạ?" },
  {
    role: "assistant",
    text: "Con thử nhớ lại: 24 × 5 cũng giống 24 × 10 rồi chia đôi không nhỉ? 24 × 10 bằng bao nhiêu con biết không?",
  },
  { role: "user", text: "Dạ 240 ạ!" },
  {
    role: "assistant",
    text: "Chính xác! Vậy 240 chia đôi là bao nhiêu? Con tính thử xem nhé 😊",
  },
  { role: "user", text: "Là 120 ạ! Vậy 24 × 5 = 120!" },
  {
    role: "assistant",
    text: "Giỏi quá! Con tự tìm ra rồi đó — cách tính này con sẽ nhớ rất lâu vì tự nghĩ ra mà!",
  },
]

// Delay between each bubble appearing (ms)
const BUBBLE_DELAY = 1400
// Typing indicator duration before assistant bubble appears (ms)
const TYPING_DURATION = 900

export function AnimatedChatDemo() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showTyping, setShowTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visibleCount >= DEMO_SCRIPT.length) return

    const next = DEMO_SCRIPT[visibleCount]
    const isAssistant = next?.role === "assistant"

    // State machine:
    // - User bubble or first bubble: wait BUBBLE_DELAY then reveal it.
    // - Assistant bubble, typing not shown yet: wait a moment then show typing indicator.
    // - Assistant bubble, typing already shown: wait TYPING_DURATION then reveal bubble.

    const timer = setTimeout(
      () => {
        if (isAssistant && !showTyping) {
          setShowTyping(true)
        } else {
          setShowTyping(false)
          setVisibleCount((c) => c + 1)
        }
      },
      isAssistant && !showTyping
        ? visibleCount === 0
          ? 300
          : BUBBLE_DELAY
        : isAssistant
          ? TYPING_DURATION
          : visibleCount === 0
            ? 600
            : BUBBLE_DELAY,
    )

    return () => clearTimeout(timer)
  }, [visibleCount, showTyping])

  // Auto-scroll as new bubbles appear
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [visibleCount, showTyping])

  return (
    <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-white px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm">
          🌥️
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{AI_PERSONA_NAME}</p>
          <p className="text-xs text-slate-500">Gia sư tiểu học lớp 1–5</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-400">Đang hoạt động</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="h-72 space-y-3 overflow-y-auto bg-slate-50 p-4"
        aria-live="polite"
        aria-label="Demo cuộc trò chuyện với Cô Mây"
      >
        <AnimatePresence initial={false}>
          {DEMO_SCRIPT.slice(0, visibleCount).map((bubble, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={bubble.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  bubble.role === "user"
                    ? "max-w-[78%] rounded-2xl rounded-tr-sm bg-sky-600 px-3.5 py-2 text-sm text-white"
                    : "max-w-[78%] rounded-2xl rounded-tl-sm border bg-white px-3.5 py-2 text-sm text-slate-800 shadow-sm"
                }
              >
                {bubble.role === "assistant" && (
                  <p className="mb-0.5 text-xs font-medium text-slate-400">{AI_PERSONA_NAME}</p>
                )}
                {bubble.text}
              </div>
            </motion.div>
          ))}

          {showTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="rounded-2xl rounded-tl-sm border bg-white px-4 py-3 shadow-sm">
                <p className="mb-1 text-xs font-medium text-slate-400">{AI_PERSONA_NAME}</p>
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:300ms]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
