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
import { Calendar, Clock, MapPin, User, DollarSign, MessageCircle, Wrench, CheckCircle2, Circle, XCircle, Star, RefreshCw, ChevronLeft, ChevronRight, CalendarCheck, AlertCircle, ArrowRight, Hourglass } from "lucide-react"
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
  customFields?: React.ReactNode
  price?: string
  onMessage?: () => void
  messageLabel?: string
  extraActions?: React.ReactNode
  onClassReceived?: () => void
  showClassReceivedButton?: boolean
  onReschedule?: (newDate: Date, newTime: string) => void
  showRescheduleButton?: boolean
  rescheduleLabel?: string
  showRescheduledBadge?: boolean
  currentSessionTime?: string
  currentSessionDate?: Date
  review?: ReviewData
  originalDate?: string
  originalTime?: string
  isRescheduleRequest?: boolean
  onAcceptReschedule?: () => void
  onDeclineReschedule?: () => void
}

// --- Reschedule helpers ---

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const TIME_SLOTS = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

// --- Main component ---

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
  onReschedule,
  showRescheduleButton = false,
  rescheduleLabel = "Reschedule Class",
  showRescheduledBadge = false,
  currentSessionTime,
  currentSessionDate,
  review,
  customFields,
  originalDate,
  originalTime,
  isRescheduleRequest = false,
  onAcceptReschedule,
  onDeclineReschedule,
}: ServiceDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<StatusType | undefined>(status)
  const [rescheduling, setRescheduling] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [closing, setClosing] = useState(false)

  const today = new Date()
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Sync internal state when the prop changes (e.g., opening a different item)
  useEffect(() => {
    setCurrentStatus(status)
    setRescheduling(false)
    setConfirming(false)
    setConfirmed(false)
    setClosing(false)
    // Pre-populate with the current session date/time so the calendar
    // and time grid start with the lesson's existing values highlighted
    if (currentSessionDate) {
      setSelectedDate(currentSessionDate)
      setCalMonth(currentSessionDate.getMonth())
      setCalYear(currentSessionDate.getFullYear())
    } else {
      setSelectedDate(null)
      setCalMonth(today.getMonth())
      setCalYear(today.getFullYear())
    }
    setSelectedTime(currentSessionTime ?? null)
  }, [status, open]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = (newStatus: StatusType) => {
    setCurrentStatus(newStatus)
    onStatusChange?.(newStatus)
  }

  // Compute whether reschedule is allowed (must be > 24h before class start)
  const rescheduleAllowed = (() => {
    if (!currentSessionDate || !currentSessionTime) return true
    // Parse the time string (e.g. "4:00 PM") into hours/minutes
    const match = currentSessionTime.match(/^(\d+):(\d+)\s*(AM|PM)$/i)
    if (!match) return true
    let hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    const meridiem = match[3].toUpperCase()
    if (meridiem === "PM" && hours !== 12) hours += 12
    if (meridiem === "AM" && hours === 12) hours = 0
    const classStart = new Date(
      currentSessionDate.getFullYear(),
      currentSessionDate.getMonth(),
      currentSessionDate.getDate(),
      hours,
      minutes,
    )
    const hoursUntilClass = (classStart.getTime() - Date.now()) / (1000 * 60 * 60)
    return hoursUntilClass > 24
  })()

  const handleConfirmReschedule = () => {
    if (selectedDate && selectedTime && onReschedule) {
      onReschedule(selectedDate, selectedTime)
      setConfirming(false)
      setConfirmed(true)
      setRescheduling(false)
    }
  }

  // Calendar rendering
  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)
  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isPastDay = (day: number) => {
    const d = new Date(calYear, calMonth, day)
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return d < t
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getFullYear() === calYear &&
      selectedDate.getMonth() === calMonth &&
      selectedDate.getDate() === day
    )
  }

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }

  // Reschedule view
  const rescheduleView = (
    <div className="space-y-4 py-1">
      {/* Calendar */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-full p-1 hover:bg-secondary transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="text-sm font-semibold">
            {MONTHS[calMonth]} {calYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-full p-1 hover:bg-secondary transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {calendarCells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />
            const past = isPastDay(day)
            const sel = isSelected(day)
            return (
              <button
                key={day}
                type="button"
                disabled={past}
                onClick={() => setSelectedDate(new Date(calYear, calMonth, day))}
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                  past && "text-muted-foreground/40 cursor-not-allowed",
                  !past && !sel && "hover:bg-secondary text-foreground",
                  sel && "bg-primary text-primary-foreground font-semibold",
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      <div className="rounded-lg border p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Select a time
        </p>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isCurrentSession = currentSessionTime && slot === currentSessionTime
            const isSelectedSlot = selectedTime === slot
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                className={cn(
                  "rounded-full border px-2 py-1.5 text-xs font-medium transition-colors",
                  isSelectedSlot
                    ? "bg-primary text-primary-foreground border-primary"
                    : isCurrentSession
                    ? "border-red-300 text-red-600 font-semibold hover:bg-red-50"
                    : "border-border text-foreground hover:bg-secondary"
                )}
              >
                {slot}
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 pb-0">
        <Button
          className="flex-1 rounded-full"
          variant="outline"
          onClick={() => setRescheduling(false)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          className="flex-1 rounded-full"
          disabled={!selectedDate || !selectedTime}
          onClick={() => setConfirming(true)}
        >
          Next
        </Button>
      </div>
    </div>
  )

  // Confirming view — "Are you sure?" step
  const confirmingView = (
    <div className="flex flex-col items-center justify-center py-8 gap-6 text-center">
      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10">
        <CalendarCheck className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-foreground">Confirm Reschedule</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
          Are you sure you want to reschedule this class?
        </p>
      </div>
      {selectedDate && selectedTime && (
        <div className="w-full flex items-stretch gap-3">
          {/* Current schedule */}
          <div className="flex-1 rounded-2xl border bg-secondary/40 p-3 space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide text-center">Current</p>
            <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5">
              <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Date</p>
                <p className="text-xs font-semibold text-foreground truncate">
                  {currentSessionDate
                    ? (() => {
                        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
                        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                        return `${days[currentSessionDate.getDay()]}, ${months[currentSessionDate.getMonth()]} ${currentSessionDate.getDate()}`
                      })()
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5">
              <Clock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Time</p>
                <p className="text-xs font-semibold text-foreground truncate">{currentSessionTime ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center flex-shrink-0">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* New schedule */}
          <div className="flex-1 rounded-2xl border bg-primary/10 p-3 space-y-2">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wide text-center">New</p>
            <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5">
              <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Date</p>
                <p className="text-xs font-semibold text-foreground truncate">
                  {(() => {
                    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
                    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                    return `${days[selectedDate.getDay()]}, ${months[selectedDate.getMonth()]} ${selectedDate.getDate()}`
                  })()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5">
              <Clock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Time</p>
                <p className="text-xs font-semibold text-foreground truncate">{selectedTime}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 w-full pb-0">
        <Button
          className="flex-1 rounded-full"
          variant="outline"
          onClick={() => setConfirming(false)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          className="flex-1 rounded-full"
          onClick={handleConfirmReschedule}
        >
          Confirm
        </Button>
      </div>
    </div>
  )

  // Confirmation view (shown after successful reschedule)
  const confirmationView = (
    <div className="flex flex-col items-center justify-center py-10 gap-6 text-center">
      {/* Hourglass icon */}
      <div className="flex items-center justify-center h-28 w-28 rounded-full bg-primary/10">
        <Hourglass className="h-12 w-12 text-primary" />
      </div>

      {/* Body copy */}
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[300px] mx-auto">
        Your request has been sent. The provider will confirm the new time shortly.
      </p>
    </div>
  )

  // Detail view
  const detailView = (
    <div className="space-y-4 py-1">
      {/* Status badge (no dropdown) */}
      {currentStatus && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Status</span>
          <div className="flex items-center gap-1.5">
            {/* Show reschedule request badge (amber) when pending, or rescheduled badge (blue) when confirmed */}
            {isRescheduleRequest ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                <RefreshCw className="h-3 w-3" />
                Reschedule Requested
              </span>
            ) : (showRescheduledBadge || originalDate) ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                <RefreshCw className="h-3 w-3" />
                Rescheduled
              </span>
            ) : (
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                statusStyles[currentStatus]
              )}>
                {statusIcons[currentStatus]}
                {statusLabels[currentStatus]}
              </span>
            )}
          </div>
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
      {customFields
        ? customFields
        : fields && fields.length > 0 && (
        originalDate && originalTime ? (
          /* Side-by-side PREVIOUS/CURRENT or CURRENT/NEW layout for rescheduled lessons */
          <div className="flex items-center gap-3">
            {/* Left card - PREVIOUS or CURRENT */}
            <div className="flex-1 rounded-xl bg-secondary/50 p-4">
              <p className="text-[10px] font-medium text-muted-foreground tracking-wider mb-3">
                {isRescheduleRequest ? "CURRENT" : "PREVIOUS"}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{originalDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Time</p>
                    <p className="text-sm font-medium">{originalTime}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Arrow */}
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            {/* Right card - CURRENT or NEW */}
            <div className="flex-1 rounded-xl bg-primary/10 p-4">
              <p className="text-[10px] font-medium text-primary tracking-wider mb-3">
                {isRescheduleRequest ? "NEW" : "CURRENT"}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{fields.find(f => f.label === "Date")?.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Time</p>
                    <p className="text-sm font-medium">{fields.find(f => f.label === "Time")?.value?.split(" (")[0]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard grid layout for non-rescheduled lessons */
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
        )
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
        {showRescheduleButton && onReschedule && (
          <div className="flex flex-col gap-1.5">
            <Button
              className="w-full rounded-full"
              variant="outline"
              disabled={!rescheduleAllowed}
              onClick={() => setRescheduling(true)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {rescheduleLabel}
            </Button>
            {!rescheduleAllowed && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <span className="font-semibold">Reschedules must be requested at least 24 hours before the class.</span>{" "}
                  This class is too close to reschedule.
                </p>
              </div>
            )}
          </div>
        )}
        {/* Accept/Decline buttons for reschedule requests */}
        {isRescheduleRequest && (onAcceptReschedule || onDeclineReschedule) && (
          <div className="flex items-center gap-2">
            {onDeclineReschedule && (
              <Button
                className="flex-1 rounded-full"
                variant="outline"
                onClick={onDeclineReschedule}
              >
                Decline
              </Button>
            )}
            {onAcceptReschedule && (
              <Button
                className="flex-1 rounded-full"
                onClick={onAcceptReschedule}
              >
                Accept
              </Button>
            )}
          </div>
        )}
        {/* Only show Class Received for Active/Rescheduled, NOT for reschedule requests or pending */}
        {showClassReceivedButton && onClassReceived && !isRescheduleRequest && currentStatus !== "pending" && (
          <Button className="w-full rounded-full" onClick={onClassReceived}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Class Received
          </Button>
        )}
        {extraActions}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto pb-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {(rescheduling && !confirmed && !confirming) && (
              <button
                type="button"
                onClick={() => setRescheduling(false)}
                className="rounded-full p-1 hover:bg-secondary transition-colors -ml-1"
                aria-label="Back"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            {confirmed ? "Reschedule request sent" : title}
          </DialogTitle>
          <DialogDescription>
            {confirmed
              ? "Your request has been sent to the provider"
              : confirming
              ? "Review your new schedule"
              : rescheduling
              ? "Select a new date and time for your class"
              : subtitle || "Service details and information"}
          </DialogDescription>
        </DialogHeader>

        {confirmed ? confirmationView : confirming ? confirmingView : rescheduling ? rescheduleView : detailView}
      </DialogContent>
    </Dialog>
  )
}
