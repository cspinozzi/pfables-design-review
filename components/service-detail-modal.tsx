"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User, DollarSign, MessageCircle, Wrench, CheckCircle2, Circle, XCircle, Star } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ReviewData } from "@/components/review-display"

type StatusType = "active" | "completed" | "cancelled" | "received" | "pending" | "paid"

const statusStyles: Record<StatusType, string> = {
  active: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  received: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-green-50 text-green-700 border-green-200",
}

const statusIcons: Record<StatusType, React.ReactNode> = {
  active: <CheckCircle2 className="h-3 w-3 text-blue-700" />,
  completed: <CheckCircle2 className="h-3 w-3 text-green-700" />,
  cancelled: <XCircle className="h-3 w-3 text-red-700" />,
  received: <CheckCircle2 className="h-3 w-3 text-green-700" />,
  pending: <Clock className="h-3 w-3 text-amber-700" />,
  paid: <CheckCircle2 className="h-3 w-3 text-green-700" />,
}

const statusLabels: Record<StatusType, string> = {
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
  received: "Received",
  pending: "Pending",
  paid: "Paid",
}

export interface DetailField {
  icon: React.ReactNode
  label: string
  value: string
}

export interface DetailPerson {
  name: string
  role: string
  avatar?: string
}

const allStatuses: StatusType[] = ["active", "pending", "completed", "cancelled", "paid", "received"]

export interface ServiceDetailModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  status?: StatusType
  onStatusChange?: (status: StatusType) => void
  people?: DetailPerson[]
  fields?: DetailField[]
  price?: string
  onMessage?: () => void
  messageLabel?: string
  extraActions?: React.ReactNode
  onClassReceived?: () => void
  showClassReceivedButton?: boolean
  review?: ReviewData
}

export function ServiceDetailModal({
  open,
  onClose,
  title,
  subtitle,
  status,
  onStatusChange,
  people,
  fields,
  price,
  onMessage,
  messageLabel = "Message",
  extraActions,
  onClassReceived,
  showClassReceivedButton = false,
  review,
}: ServiceDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<StatusType | undefined>(status)

  // Sync internal state when the prop changes (e.g., opening a different item)
  useEffect(() => {
    setCurrentStatus(status)
  }, [status])

  const handleStatusChange = (newStatus: StatusType) => {
    setCurrentStatus(newStatus)
    onStatusChange?.(newStatus)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
          </DialogTitle>
          <DialogDescription>
            {subtitle || 'Service details and information'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Status badge (no dropdown) */}
          {currentStatus && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                statusStyles[currentStatus]
              )}>
                {statusIcons[currentStatus]}
                {statusLabels[currentStatus]}
              </span>
            </div>
          )}

          {/* People */}
          {people && people.length > 0 && (
            <div className="rounded-lg border p-4">
              <div className="space-y-3">
                {people.map((person, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {person.avatar ? (
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                        <Image src={person.avatar} alt={person.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detail Fields */}
          {fields && fields.length > 0 && (
            <div className="rounded-lg border p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map((field, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-muted-foreground flex-shrink-0">{field.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{field.label}</p>
                      <p className="text-sm font-medium truncate">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          {price && (
            <div className="rounded-lg border p-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-lg font-semibold text-primary">{price}</span>
            </div>
          )}

          {/* Review */}
          {review && (
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Review</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 bg-muted">
                  <Image
                    src={review.reviewerAvatar || "/placeholder-user.jpg"}
                    alt={review.reviewerName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{review.reviewerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  {review.comment ? (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.comment}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1 italic">No comment provided</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            {onMessage && (
              <Button className="w-full rounded-full" variant="outline" onClick={onMessage}>
                <MessageCircle className="h-4 w-4 mr-2" />
                {messageLabel}
              </Button>
            )}
            {showClassReceivedButton && onClassReceived && (
              <Button className="w-full rounded-full" onClick={onClassReceived}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Class Received
              </Button>
            )}
            {extraActions}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
