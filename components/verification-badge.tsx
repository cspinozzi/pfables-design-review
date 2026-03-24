import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerificationBadgeProps {
  status: "approved" | "pending" | "rejected" | "none"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  filled?: boolean
}

export function VerificationBadge({ status, size = "md", showLabel = false, filled = false }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  if (status === "approved") {
    return (
      <div className={cn("flex items-center gap-1", showLabel && "rounded-[4px] bg-primary/10 px-2 py-0.5")}>
        <CheckCircle2 className={cn(sizeClasses[size], filled ? "fill-primary text-white" : "text-primary")} />
        {showLabel && <span className={cn(textSizes[size], "font-medium text-primary")}>Verified</span>}
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div className={cn("flex items-center gap-1", showLabel && "rounded-[4px] bg-muted px-2 py-0.5")}>
        <Clock className={cn(sizeClasses[size], "text-muted-foreground")} />
        {showLabel && <span className={cn(textSizes[size], "font-medium text-muted-foreground")}>Pending</span>}
      </div>
    )
  }

  if (status === "rejected") {
    return (
      <div className={cn("flex items-center gap-1", showLabel && "rounded-[4px] bg-destructive/10 px-2 py-0.5")}>
        <XCircle className={cn(sizeClasses[size], "text-destructive")} />
        {showLabel && <span className={cn(textSizes[size], "font-medium text-destructive")}>Rejected</span>}
      </div>
    )
  }

  return null
}
