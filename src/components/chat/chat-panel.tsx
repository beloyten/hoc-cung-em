"use client"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AI_PERSONA_NAME } from "@/lib/constants"

interface ChatPanelProps {
  chatId: string
  initialMessages: Array<{
    id: string
    role: "user" | "assistant"
    parts: Array<{ type: "text"; text: string }>
  }>
}

export function ChatPanel({ chatId, initialMessages }: ChatPanelProps) {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: { chatId } }),
    [chatId],
  )

  const { messages, sendMessage, status, error } = useChat({
    id: chatId,
    messages: initialMessages as UIMessage[],
    transport,
  })

  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, status])

  const isStreaming = status === "submitted" || status === "streaming"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isStreaming) return
    sendMessage({ text })
    setInput("")
  }

  return (
    <>
      <div
        ref={scrollRef}
        className="bg-muted/30 flex-1 space-y-3 overflow-y-auto rounded-2xl border p-4"
      >
        {messages.length === 0 && (
          <p className="text-muted-foreground text-center text-sm">
            Chào con! {AI_PERSONA_NAME} đang ở đây. Con có câu hỏi gì nào? 😊
          </p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isStreaming && messages.at(-1)?.role !== "assistant" && (
          <p className="text-muted-foreground text-xs italic">{AI_PERSONA_NAME} đang nghĩ...</p>
        )}
        {error && <p className="text-destructive text-xs">Có lỗi xảy ra. Con thử gửi lại nhé.</p>}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Con có câu hỏi gì?"
          rows={2}
          className="flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          disabled={isStreaming}
        />
        <Button type="submit" disabled={isStreaming || !input.trim()}>
          Gửi
        </Button>
      </form>
    </>
  )
}

function MessageBubble({ message }: { message: UIMessage }) {
  const text = (message.parts ?? [])
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n")

  const isUser = message.role === "user"
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "bg-primary text-primary-foreground max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2 text-sm"
            : "bg-card max-w-[80%] rounded-2xl rounded-tl-sm border px-4 py-2 text-sm shadow-sm"
        }
      >
        {!isUser && (
          <p className="text-muted-foreground mb-1 text-xs font-medium">{AI_PERSONA_NAME}</p>
        )}
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  )
}
