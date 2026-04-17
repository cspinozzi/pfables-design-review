import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  variant?: "card" | "inline"
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "card",
  className,
}: EmptyStateProps) {
  const inner = (
    <div className="flex flex-col items-center text-center gap-2 py-8 px-4">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-1">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs text-pretty">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )

  if (variant === "inline") {
    return <div className={cn("w-full", className)}>{inner}</div>
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">{inner}</CardContent>
    </Card>
  )
}
