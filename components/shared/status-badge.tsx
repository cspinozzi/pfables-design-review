import { CheckCircle2, Clock, XCircle, AlertCircle, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type StatusKind =
  | "pending"
  | "approved"
  | "verified"
  | "rejected"
  | "active"
  | "inactive"
  | "expired"
  | "paid"
  | "refunded"
  | "failed"

type StatusStyle = {
  label: string
  icon: LucideIcon
  classes: string
}

const STATUS_MAP: Record<StatusKind, StatusStyle> = {
  pending: { label: "Pending", icon: Clock, classes: "bg-amber-100 text-amber-800 border-amber-200" },
  approved: { label: "Approved", icon: CheckCircle2, classes: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  verified: { label: "Verified", icon: CheckCircle2, classes: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  rejected: { label: "Rejected", icon: XCircle, classes: "bg-red-100 text-red-800 border-red-200" },
  active: { label: "Active", icon: CheckCircle2, classes: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  inactive: { label: "Inactive", icon: AlertCircle, classes: "bg-muted text-muted-foreground border-border" },
  expired: { label: "Expired", icon: AlertCircle, classes: "bg-muted text-muted-foreground border-border" },
  paid: { label: "Paid", icon: CheckCircle2, classes: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  refunded: { label: "Refunded", icon: AlertCircle, classes: "bg-blue-100 text-blue-800 border-blue-200" },
  failed: { label: "Failed", icon: XCircle, classes: "bg-red-100 text-red-800 border-red-200" },
}

interface StatusBadgeProps {
  status: StatusKind
  label?: string
  showIcon?: boolean
  className?: string
}

export function StatusBadge({ status, label, showIcon = true, className }: StatusBadgeProps) {
  const style = STATUS_MAP[status]
  const Icon = style.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        style.classes,
        className,
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {label ?? style.label}
    </span>
  )
}
