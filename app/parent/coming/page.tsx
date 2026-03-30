"use client"

import { useState } from "react"
import { ServiceCard } from "@/components/service-card"
import { ServiceDetailModal } from "@/components/service-detail-modal"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, User, DollarSign, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payment-modal"
import { ReviewModal } from "@/components/review-modal"
import { ReviewDisplay } from "@/components/review-display"
import { useMockMessages } from "@/hooks/use-mock-messages"
import { useAuth } from "@/lib/auth-context"
import { useReschedule } from "@/lib/reschedule-context"
import { useMessageContext } from "@/lib/message-context"
import { Star } from "lucide-react"

type ItemStatus = "active" | "completed" | "cancelled"

interface Review {
  rating: number
  comment: string
  date: Date
}

interface LessonItem {
  id: string
  type: string
  title: string
  provider: string
  providerAvatar: string
  date: Date
  time: string
  duration: string
  location: string
  student: string
  status: ItemStatus
  sessions?: number
  totalPaid?: number
  price?: number
  paid?: boolean
  pendingApproval?: boolean
  review?: Review
}

export default function LessonsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { conversations } = useMockMessages()
  const [filter, setFilter] = useState<"active" | "received">("active")
  const [selectedItem, setSelectedItem] = useState<LessonItem | null>(null)
  const [payingItem, setPayingItem] = useState<LessonItem | null>(null)
  const [reviewingItem, setReviewingItem] = useState<LessonItem | null>(null)
  const [suggestingItem, setSuggestingItem] = useState<LessonItem | null>(null)
  const { rescheduledIds, addReschedule, providerReschedules, removeProviderReschedule } = useReschedule()
  const { findConversationByParticipantName, sendMessage } = useMessageContext()

  const handleMessageProvider = (providerName: string) => {
    const conv = conversations.find((c) =>
      c.participants.some((p) => p.name === providerName && p.id !== user?.id)
    )
    router.push(conv ? `/messages?conv=${conv.id}` : `/messages`)
  }

  // First lesson is within 24h (reschedule disabled), rest are 2+ days out (reschedule enabled)
  const in12h = new Date(Date.now() + 12 * 60 * 60 * 1000)
  const in2days = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  const in4days = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
  const in6days = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
  const in8days = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)

  const [items, setItems] = useState<LessonItem[]>([
    {
      id: "class-1", type: "lesson", title: "Piano Lesson", provider: "Emily Carter",
      providerAvatar: "/music-teacher-woman-piano.jpg", date: in12h,
      time: "4:00 PM", duration: "45 min", location: "Naperville, IL", student: "Emma",
      status: "active", price: 65,
    },
    {
      id: "class-2", type: "lesson", title: "Guitar Lesson", provider: "Michael Rodriguez",
      providerAvatar: "/guitar-teacher-man.jpg", date: in2days,
      time: "3:30 PM", duration: "60 min", location: "Online", student: "Jake",
      status: "active", price: 55,
    },
    {
      id: "class-3", type: "lesson", title: "Piano Lesson", provider: "Emily Carter",
      providerAvatar: "/music-teacher-woman-piano.jpg", date: in4days,
      time: "4:00 PM", duration: "45 min", location: "Naperville, IL", student: "Emma",
      status: "active", price: 65,
    },
    {
      id: "repair-1", type: "repair", title: "Violin String Replacement", provider: "Marcus Chen",
      providerAvatar: "/luthier-carousel-1.jpg", date: in6days,
      time: "In Progress", duration: "Est. completion", location: "Drop-off", student: "Jake",
      status: "active", price: 85,
    },
    {
      id: "class-4", type: "lesson", title: "Piano Lesson", provider: "Sophia Martinez",
      providerAvatar: "/music-teacher-woman-piano.jpg", date: in8days,
      time: "3:30 PM", duration: "60 min", location: "Downers Grove, IL", student: "Emma",
      status: "active", price: 75, pendingApproval: true,
    },
    {
      id: "comp-1", type: "lesson", title: "Piano Lesson", provider: "Emma Thompson",
      providerAvatar: "/music-teacher-woman-piano.jpg", date: new Date("2026-01-29"),
      time: "4:00 PM", duration: "45 min", location: "Naperville, IL", student: "Emma",
      status: "completed", price: 65, paid: false,
    },
    {
      id: "comp-2", type: "lesson", title: "Music Theory Session", provider: "Jake Wilson",
      providerAvatar: "/guitar-teacher-man.jpg", date: new Date("2026-01-28"),
      time: "5:00 PM", duration: "30 min", location: "Online", student: "Jake",
      status: "completed", price: 45, paid: false,
      review: { rating: 5, comment: "Amazing teacher! Jake learned so much.", date: new Date("2026-01-29") },
    },
    {
      id: "comp-3", type: "lesson", title: "Piano Lesson", provider: "Sophia Martinez",
      providerAvatar: "/music-teacher-woman-piano.jpg", date: new Date("2026-01-30"),
      time: "3:30 PM", duration: "60 min", location: "Downers Grove, IL", student: "Emma",
      status: "completed", price: 75, paid: false,
      review: { rating: 4, comment: "Great lesson, very patient.", date: new Date("2026-01-31") },
    },
    {
      id: "comp-4", type: "lesson", title: "Piano Lesson", provider: "Emily Carter",
      providerAvatar: "/music-teacher-woman-piano.jpg", date: new Date("2026-01-26"),
      time: "4:00 PM", duration: "45 min", location: "Naperville, IL", student: "Emma",
      status: "completed", price: 65, paid: false,
    },
    {
      id: "canc-1", type: "lesson", title: "Drum Lesson", provider: "Marcus Rivera",
      providerAvatar: "/luthier-carousel-1.jpg", date: new Date("2026-01-15"),
      time: "5:00 PM", duration: "30 min", location: "Naperville, IL", student: "Jake",
      status: "cancelled", price: 45,
    },
  ])

  const handleStatusChange = (id: string, newStatus: ItemStatus) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: newStatus } : item))
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const handlePaymentSuccess = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, paid: true } : item))
    setPayingItem(null)
  }

  const handleReviewSubmit = (id: string, rating: number, comment: string) => {
    setItems((prev) => prev.map((item) => 
      item.id === id ? { ...item, review: { rating, comment, date: new Date() } } : item
    ))
    setReviewingItem(null)
  }

  const handleClassReceived = (item: LessonItem) => {
    // First mark as completed/received
    setItems((prev) => prev.map((i) => 
      i.id === item.id ? { ...i, status: "completed" as ItemStatus } : i
    ))
    // Close the detail modal and open review modal
    setSelectedItem(null)
    setReviewingItem(item)
  }

  const activeItems = items.filter((i) => i.status === "active")
  const completedItems = items.filter((i) => i.status === "completed" || i.status === "cancelled")

  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${days[date.getUTCDay()]}, ${months[date.getUTCMonth()]} ${date.getUTCDate()}`
  }

  const filters = [
    { key: "active" as const, label: `Active (${activeItems.length})` },
    { key: "received" as const, label: `Received (${completedItems.length})` },
  ]

  const currentItems = filter === "active" ? activeItems : filter === "received" ? completedItems : completedItems

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-12">
      <div className="page-container pt-6">
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground">Lessons</h1>
          <p className="text-sm text-muted-foreground">Your scheduled classes and services</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {currentItems.length > 0 ? (
          <div className="space-y-3">
            {currentItems.map((item) => (
              <ServiceCard
                key={item.id}
                image={item.providerAvatar}
                imageAlt={item.provider}
                title={item.title}
                subtitle={item.student ? `${item.student} (${item.provider})` : item.provider}
                price={`$${item.price || item.totalPaid || 0}`}
                priceClassName={
                  item.status === "cancelled" || item.paid === true ? "text-muted-foreground" : "text-primary"
                }
                status={item.status === "completed" ? "received" : item.status === "cancelled" ? "cancelled" : item.pendingApproval ? "pending" : "active"}
                rescheduled={rescheduledIds.has(item.id)}
                onClick={() => setSelectedItem(item)}
                details={
                  <>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {item.provider}
                    </span>
                    <span className="flex items-center gap-1" suppressHydrationWarning>
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(item.date)}
                    </span>
                    {item.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {item.time}{item.duration ? ` (${item.duration})` : ""}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                  </>
                }
                footer={(() => {
                  const providerReschedule = providerReschedules.find((r) => r.id === item.id)
                  if (providerReschedule && item.status === "active") {
                    return (
                      <div className="flex items-center justify-end gap-2 px-4 sm:px-6 py-3 bg-primary rounded-b-xl">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full px-5 font-semibold text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSuggestingItem(item)
                          }}
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                          Suggest New Time
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-full px-5 font-semibold"
                          onClick={(e) => {
                            e.stopPropagation()
                            setItems((prev) => prev.map((i) =>
                              i.id === item.id
                                ? { ...i, date: providerReschedule.newDate, time: providerReschedule.newTime }
                                : i
                            ))
                            removeProviderReschedule(item.id)
                          }}
                        >
                          Accept
                        </Button>
                      </div>
                    )
                  }
                  if (item.status === "completed" && item.price) {
                    return item.review ? (
                      <ReviewDisplay review={item.review} serviceName={item.title} />
                    ) : (
                      <div className="flex items-center justify-end px-4 sm:px-6 py-3 bg-primary rounded-b-xl">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-full px-5 font-semibold"
                          onClick={(e) => {
                            e.stopPropagation()
                            setReviewingItem(item)
                          }}
                        >
                          <Star className="h-4 w-4 mr-1.5" />
                          Review Class
                        </Button>
                      </div>
                    )
                  }
                  return undefined
                })()}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-1">No items found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "active"
                ? "Your active lessons and services will appear here"
                : "No completed lessons yet"}
            </p>
          </Card>
        )}

        {selectedItem && (
          <ServiceDetailModal
            open={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            title={selectedItem.title}
            status={selectedItem.status === "completed" ? "received" : selectedItem.status}
            onStatusChange={(s) => handleStatusChange(selectedItem.id, s as ItemStatus)}
            people={[
              { name: selectedItem.provider, role: selectedItem.type === "repair" ? "Repair Specialist" : "Music Teacher", avatar: selectedItem.providerAvatar },
              ...(selectedItem.student ? [{ name: selectedItem.student, role: "Your child" }] : []),
            ]}
            fields={[
              { icon: <Calendar className="h-4 w-4" />, label: "Date", value: formatDate(selectedItem.date) },
              ...(selectedItem.time ? [{ icon: <Clock className="h-4 w-4" />, label: "Time", value: `${selectedItem.time}${selectedItem.duration ? ` (${selectedItem.duration})` : ""}` }] : []),
              { icon: <MapPin className="h-4 w-4" />, label: "Location", value: selectedItem.location },
              ...(selectedItem.totalPaid ? [{ icon: <DollarSign className="h-4 w-4" />, label: "Total Paid", value: `$${selectedItem.totalPaid}` }] : []),
            ]}
            onMessage={() => {
              handleMessageProvider(selectedItem.provider)
              setSelectedItem(null)
            }}
            messageLabel="Message Provider"
            showRescheduleButton={selectedItem.status === "active" && !selectedItem.pendingApproval && selectedItem.type === "lesson"}
            showRescheduledBadge={rescheduledIds.has(selectedItem.id)}
            currentSessionTime={selectedItem.time}
            currentSessionDate={selectedItem.date instanceof Date ? selectedItem.date : undefined}
            onReschedule={(newDate: Date, newTime: string) => {
              const item = selectedItem
              setItems((prev) => prev.map((i) =>
                i.id === item.id ? { ...i, date: newDate, time: newTime } : i
              ))
              addReschedule({
                id: item.id,
                title: item.title,
                parentName: user?.name ?? "Parent",
                parentAvatar: user?.avatar ?? "/parent-woman.jpg",
                childName: item.student,
                newDate,
                newTime,
                duration: item.duration,
                location: item.location,
                rescheduledAt: new Date(),
              })
              // Send automatic message in the conversation with the provider
              const conv = findConversationByParticipantName(item.provider, user?.id)
              if (conv && user) {
                const formattedDate = newDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                sendMessage(
                  conv.id,
                  `Hi! I'd like to reschedule our ${item.title} for ${item.student} to ${formattedDate} at ${newTime}. Please let me know if this works for you.`,
                  user.id,
                  user.name,
                  user.avatar
                )
              }
            }}
            showClassReceivedButton={selectedItem.status === "active" && !selectedItem.pendingApproval}
            onClassReceived={() => handleClassReceived(selectedItem)}
          />
        )}

        {payingItem && payingItem.price && (
          <PaymentModal
            open={!!payingItem}
            onClose={() => setPayingItem(null)}
            onSuccess={() => handlePaymentSuccess(payingItem.id)}
            serviceName={payingItem.title}
            providerName={payingItem.provider}
            amount={payingItem.price}
            studentName={payingItem.student || undefined}
            date={payingItem.date}
          />
        )}

        {reviewingItem && (
          <ReviewModal
            open={!!reviewingItem}
            onClose={() => setReviewingItem(null)}
            onSubmit={(rating, comment) => handleReviewSubmit(reviewingItem.id, rating, comment)}
            serviceName={reviewingItem.title}
            providerName={reviewingItem.provider}
            providerAvatar={reviewingItem.providerAvatar}
            date={reviewingItem.date}
            studentName={reviewingItem.student || undefined}
          />
        )}

        {/* Suggest New Time modal — counter-propose when provider reschedules */}
        {suggestingItem && (
          <ServiceDetailModal
            open={!!suggestingItem}
            onClose={() => setSuggestingItem(null)}
            title={suggestingItem.title}
            status="active"
            people={[
              { name: suggestingItem.provider, role: "Music Teacher", avatar: suggestingItem.providerAvatar },
              ...(suggestingItem.student ? [{ name: suggestingItem.student, role: "Your child" }] : []),
            ]}
            fields={[
              { icon: <Calendar className="h-4 w-4" />, label: "Date", value: formatDate(suggestingItem.date) },
              { icon: <Clock className="h-4 w-4" />, label: "Time", value: `${suggestingItem.time}${suggestingItem.duration ? ` (${suggestingItem.duration})` : ""}` },
              { icon: <MapPin className="h-4 w-4" />, label: "Location", value: suggestingItem.location },
            ]}
            onMessage={() => {
              handleMessageProvider(suggestingItem.provider)
              setSuggestingItem(null)
            }}
            messageLabel="Message Provider"
            showRescheduleButton
            rescheduleLabel="Suggest New Time"
            currentSessionDate={suggestingItem.date instanceof Date ? suggestingItem.date : undefined}
            currentSessionTime={suggestingItem.time}
            onReschedule={(newDate: Date, newTime: string) => {
              const item = suggestingItem
              setItems((prev) => prev.map((i) =>
                i.id === item.id ? { ...i, date: newDate, time: newTime } : i
              ))
              addReschedule({
                id: item.id,
                title: item.title,
                parentName: user?.name ?? "Parent",
                parentAvatar: user?.avatar ?? "/parent-woman.jpg",
                childName: item.student,
                newDate,
                newTime,
                duration: item.duration,
                location: item.location,
                rescheduledAt: new Date(),
              })
              removeProviderReschedule(item.id)
              const conv = findConversationByParticipantName(item.provider, user?.id)
              if (conv && user) {
                const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
                const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                const formatted = `${days[newDate.getDay()]}, ${months[newDate.getMonth()]} ${newDate.getDate()}`
                sendMessage(
                  conv.id,
                  `Hi! I'd like to suggest a different time for our ${item.title} for ${item.student}: ${formatted} at ${newTime}. Please let me know if this works.`,
                  user.id,
                  user.name,
                  user.avatar
                )
              }
              setSuggestingItem(null)
            }}
          />
        )}

        {/* View Review Modal */}
      </div>
    </div>
  )
}
