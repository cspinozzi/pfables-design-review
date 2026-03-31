"use client"

import { Card, CardContent } from "@/components/ui/card"
import { type ReactNode } from "react"
import { CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react"

type StatusType = "active" | "completed" | "cancelled" | "received" | "pending" | "paid" | "refund" | "topay" | "waiting" | "done" | "refunded" | "requested" | "rescheduled" | "reschedule_request"

interface ServiceCardProps {
  image?: string
  imageAlt?: string
  title: string
  subtitle?: string
  price?: string
  /** Custom class name for the price text */
  priceClassName?: string
  status?: StatusType
  details?: ReactNode
  badge?: {
    label: string
    variant?: "default" | "success" | "warning" | "info" | "muted"
    icon?: ReactNode
  }
  tags?: string[]
  children?: ReactNode
  /** Shows a "Rescheduled" badge to the left of the status badge */
  rescheduled?: boolean
  /** Footer rendered below the card content, outside the click target. Used for action bars. */
  footer?: ReactNode
  /** Action that appears on hover next to the price */
  hoverAction?: ReactNode
  className?: string
  onClick?: () => void
}

const badgeVariants = {
  default: "bg-secondary text-foreground",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-blue-100 text-blue-700",
  muted: "bg-gray-100 text-gray-600",
}

const statusConfig: Record<StatusType, { label: string; bgClass: string; icon: ReactNode }> = {
  active: {
    label: "Active",
    bgClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <CheckCircle2 className="h-3 w-3 text-blue-700" />,
  },
  completed: {
    label: "Completed",
    bgClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3 w-3 text-amber-700" />,
  },
  cancelled: {
    label: "Cancelled",
    bgClass: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle className="h-3 w-3 text-red-700" />,
  },
  received: {
    label: "Received",
    bgClass: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle2 className="h-3 w-3 text-green-700" />,
  },
  pending: {
    label: "Pending",
    bgClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3 w-3 text-amber-700" />,
  },
  paid: {
    label: "Paid",
    bgClass: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle2 className="h-3 w-3 text-green-700" />,
  },
  refund: {
    label: "Refund",
    bgClass: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle className="h-3 w-3 text-red-700" />,
  },
  topay: {
    label: "To Pay",
    bgClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3 w-3 text-amber-700" />,
  },
  waiting: {
    label: "Waiting Payment",
    bgClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3 w-3 text-amber-700" />,
  },
  done: {
    label: "Done",
    bgClass: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle2 className="h-3 w-3 text-green-700" />,
  },
  refunded: {
    label: "Refunded",
    bgClass: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle className="h-3 w-3 text-red-700" />,
  },
  requested: {
    label: "Requested",
    bgClass: "bg-red-50 text-red-700 border-red-200",
    icon: <Clock className="h-3 w-3 text-red-700" />,
  },
  rescheduled: {
    label: "Rescheduled",
    bgClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <RefreshCw className="h-3 w-3 text-blue-700" />,
  },
  reschedule_request: {
    label: "Reschedule Requested",
    bgClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <RefreshCw className="h-3 w-3 text-amber-700" />,
  },
}

export function ServiceCard({
  image,
  imageAlt,
  title,
  subtitle,
  price,
  priceClassName,
  status,
  rescheduled = false,
  details,
  badge,
  tags,
  children,
  footer,
  hoverAction,
  className = "",
  onClick,
}: ServiceCardProps) {
  return (
    <Card className={`group ${footer ? "overflow-hidden" : "overflow-visible"} transition-colors hover:border-foreground/20 ${onClick ? "cursor-pointer" : ""} ${className}`}>
      <CardContent className="p-0">
        <div
          className="flex flex-col sm:flex-row"
          onClick={onClick}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick() } : undefined}
        >
          {/* Image */}
          <div className={`relative h-32 w-full sm:h-auto sm:w-32 flex-shrink-0 overflow-hidden ${footer ? "rounded-t-2xl sm:rounded-t-none sm:rounded-tl-2xl" : "rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image || "/placeholder.svg?height=128&width=128"}
              alt={imageAlt || title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base sm:text-lg font-medium text-foreground">{title}</h3>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {tags && tags.length > 0 && (
                  <div className="hidden sm:flex gap-1.5">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full border px-2.5 py-0.5 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {status ? (
                  <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusConfig[status].bgClass}`}>
                    {statusConfig[status].icon}
                    {statusConfig[status].label}
                  </span>
                ) : badge ? (
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${badgeVariants[badge.variant || "default"]}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Details */}
            {details && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {price && (
                  <span className={`text-base font-semibold ${priceClassName || "text-primary"}`}>{price}</span>
                )}
                {hoverAction && (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    {hoverAction}
                  </span>
                )}
                {details}
              </div>
            )}
            {/* Price when no details */}
            {!details && price && (
              <div className="mt-3">
                <span className={`text-base font-semibold ${priceClassName || "text-primary"}`}>{price}</span>
              </div>
            )}

            {/* Additional Content */}
            {children}
          </div>
        </div>
        {footer}
      </CardContent>
    </Card>
  )
}
