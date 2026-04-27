// Shared layout primitives — dùng cho tất cả các trang để giữ visual hierarchy nhất quán.
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </header>
  )
}

export function SectionHeader({
  title,
  count,
  action,
  description,
  className,
}: {
  title: React.ReactNode
  count?: number
  action?: React.ReactNode
  description?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div>
        <h2 className="text-base font-semibold">
          {title}
          {typeof count === "number" && (
            <span className="text-muted-foreground ml-1.5 text-sm font-normal">({count})</span>
          )}
        </h2>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/** Empty state nhất quán cho mọi list rỗng. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-gray-50/40 px-6 py-10 text-center",
        className,
      )}
    >
      {icon && (
        <div className="text-3xl" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="text-muted-foreground max-w-sm text-xs">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

/** Link "← Quay lại" consistent. */
export function BackLink({
  href,
  children = "Quay lại",
  className,
}: {
  href: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-3", className)}
    >
      ← {children}
    </Link>
  )
}

/** Container chính cho mọi trang nội dung. */
export function PageContainer({
  children,
  size = "default",
  className,
}: {
  children: React.ReactNode
  size?: "sm" | "default" | "lg"
  className?: string
}) {
  const max = size === "sm" ? "max-w-xl" : size === "lg" ? "max-w-5xl" : "max-w-3xl"
  return <main className={cn("container mx-auto px-4 py-8", max, className)}>{children}</main>
}
