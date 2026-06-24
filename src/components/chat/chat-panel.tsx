"use client"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CameraIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AI_PERSONA_NAME } from "@/lib/constants"

// Module-level store for pending image storage path keyed by chatId.
// Avoids React ref (triggers react-hooks/refs in useMemo) while staying stable across renders.
const pendingImagePaths = new Map<string, string>()

interface ChatPanelProps {
  chatId: string
  initialMessages: Array<{
    id: string
    role: "user" | "assistant"
    parts: Array<{ type: "text"; text: string }>
  }>
}

export function ChatPanel({ chatId, initialMessages }: ChatPanelProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-clear rate limit flag after 1 min so user can retry without a page refresh.
  useEffect(() => {
    if (!isRateLimited) return
    const id = setTimeout(() => setIsRateLimited(false), 60_000)
    return () => clearTimeout(id)
  }, [isRateLimited])

  // Revoke object URL on cleanup to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { chatId },
        fetch: async (url, init) => {
          try {
          // Inject imagePath into request body if pending; signed URL tạo server-side
          let body = init?.body
          const imagePath = pendingImagePaths.get(chatId)
          if (typeof body === "string" && imagePath) {
            const parsed = JSON.parse(body) as Record<string, unknown>
            parsed.imagePath = imagePath
              pendingImagePaths.delete(chatId)
              body = JSON.stringify(parsed)
            }
            const res = await fetch(url, { ...(init as RequestInit), body })
            if (!res.ok) {
              const json = await res.json().catch(() => null)
              setIsRateLimited(res.status === 429)
              setServerError(json?.error ?? "Có lỗi xảy ra. Con thử gửi lại nhé.")
            } else {
              setIsRateLimited(false)
              setServerError(null)
            }
            return res
          } catch (e) {
            setIsRateLimited(false)
            setServerError("Không thể kết nối. Con thử gửi lại nhé.")
            throw e
          }
        },
      }),
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
  const isBusy = isStreaming || isUploading

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so same file can be re-selected
    e.target.value = ""

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setServerError("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setServerError("Ảnh không được lớn hơn 5 MB.")
      return
    }

    // Show preview
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(URL.createObjectURL(file))
    setImageFile(file)
    setServerError(null)
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    pendingImagePaths.delete(chatId)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if ((!text && !imageFile) || isBusy) return

    // Upload image first if present
    if (imageFile) {
      setIsUploading(true)
      try {
        // Bước 1: lấy presigned upload URL
        const urlRes = await fetch("/api/chat-image-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            file: { name: imageFile.name, mimeType: imageFile.type, size: imageFile.size },
          }),
        })
        const urlJson = (await urlRes.json()) as {
          signedUploadUrl?: string
          path?: string
          error?: string
        }
        if (!urlRes.ok || !urlJson.signedUploadUrl || !urlJson.path) {
          setServerError(urlJson.error ?? "Upload ảnh thất bại. Vui lòng thử lại.")
          setIsUploading(false)
          return
        }
        // Bước 2: PUT file trực tiếp lên Supabase (bypass Vercel)
        const putRes = await fetch(urlJson.signedUploadUrl, {
          method: "PUT",
          body: imageFile,
          headers: { "Content-Type": imageFile.type },
        })
        if (!putRes.ok) {
          setServerError("Ảnh không thể gửi được. Con thử lại nhé.")
          setIsUploading(false)
          return
        }
        pendingImagePaths.set(chatId, urlJson.path)
      } catch {
        setServerError("Không thể upload ảnh. Con thử lại nhé.")
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }

    // Clear image UI; Maps are read and deleted by transport after request fires
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    sendMessage({ text: text || "📷 Con gửi ảnh đề bài để hỏi Cô Mây." })
    setInput("")
  }

  const displayError = serverError ?? (error ? "Có lỗi xảy ra. Con thử gửi lại nhé." : null)

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
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <MessageBubble message={m} />
            </motion.div>
          ))}
          {isStreaming && messages.at(-1)?.role !== "assistant" && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        {displayError && <p className="text-destructive text-xs">{displayError}</p>}
      </div>

      {/* Image preview strip */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center gap-2 overflow-hidden"
          >
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Ảnh đề bài"
                className="h-16 w-16 rounded-lg border object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={removeImage}
                className="bg-background absolute -top-1.5 -right-1.5 rounded-full border p-0.5 shadow-sm"
                aria-label="Xoá ảnh"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
            <p className="text-muted-foreground text-xs">Ảnh đề bài sẽ được gửi kèm tin nhắn.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Chọn ảnh đề bài"
        />

        {/* Camera button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy || isRateLimited}
          aria-label="Chụp hoặc chọn ảnh đề bài"
          title="Gửi ảnh đề bài"
          className="transition-transform duration-100 active:scale-[0.92]"
        >
          <CameraIcon className="h-4 w-4" />
        </Button>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={imageFile ? "Thêm ghi chú (tuỳ chọn)…" : "Con có câu hỏi gì?"}
          rows={2}
          className="flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              void handleSubmit(e)
            }
          }}
          disabled={isBusy || isRateLimited}
        />
        <Button
          type="submit"
          disabled={isBusy || isRateLimited || (!input.trim() && !imageFile)}
          className="transition-transform duration-100 active:scale-[0.97]"
        >
          {isUploading ? "Đang gửi…" : "Gửi"}
        </Button>
      </form>
    </>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-card rounded-2xl rounded-tl-sm border px-4 py-3 shadow-sm">
        <p className="text-muted-foreground mb-1 text-xs font-medium">{AI_PERSONA_NAME}</p>
        <div className="flex gap-1">
          <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0ms]" />
          <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:150ms]" />
          <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:300ms]" />
        </div>
      </div>
    </div>
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
