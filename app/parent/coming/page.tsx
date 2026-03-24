"use client"

import { useState } from "react"
import { ServiceCard } from "@/components/service-card"
import { ServiceDetailModal } from "@/components/service-detail-modal"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, User, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/payment-modal"
import { ReviewModal } from "@/components/review-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMockMessages } from "@/hooks/use-mock-messages"
import { useAuth } from "@/lib/auth-context"
import { Star } from "lucide-react"
import Image from "next/image"

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
  const [viewingReview, setViewingReview] = useState<LessonItem | null>(null)

  const handleMessageProvider = (providerName: string) => {
    const conv = conversations.find((c) =>
      c.participants.some((p) => p.name === providerName && p.id !== user?.id)
    )
    router.push(conv ? `/messages?conv=${conv.id}` : `/messages`)
  }

  const [items, setItems] = useState<LessonItem[]>([
    {
      id: "class-1", type: "lesson", title: "Piano Lesson", provider: "Emily Carter",
      providerAvatar: "/music-teacher-woman-piano.jpg", date: new Date("2026-02-04"),
      time: "4:00 PM", duration: "45 min", location: "Naperville, IL", student: "Emma",
      status: "active", price: 65,
    },
    {
      id: "class-2", type: "lesson", title: "Guitar Lesson", provider: "Michael Rodriguez",
      providerAvatar: "/guitar-teacher-man.jpg", date: new Date("2026-02-06"),
      time: "3:30 PM", duration: "60 min", location: "Online", student: "Jake",
      status: "active", price: 55,
    },
    {
      id: "class-3", type: "lesson", title: "Piano Lesson", provider: "Emily Carter",
      providerAvatar: "/music-teacher-woman-piano.jpg", date: new Date("2026-02-11"),
      time: "4:00 PM", duration: "45 min", location: "Naperville, IL", student: "Emma",
      status: "active", price: 65,
    },
    {
      id: "repair-1", type: "repair", title: "Violin String Replacement", provider: "Marcus Chen",
      providerAvatar: "/luthier-carousel-1.jpg", date: new Date("2026-02-07"),
      time: "In Progress", duration: "Est. completion", location: "Drop-off", student: "Jake",
      status: "active", price: 85,
    },
    {
      id: "class-4", type: "lesson", title: "Piano Lesson", provider: "Sophia Martinez",
      providerAvatar: "/music-teacher-woman-piano.jpg", date: new Date("2026-01-27"),
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

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

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
                onClick={() => setSelectedItem(item)}
                details={
                  <>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {item.provider}
                    </span>
                    <span className="flex items-center gap-1">
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
                footer={item.status === "completed" && item.price ? (
                  item.review ? (
                    <div 
                      className="flex items-center justify-between px-4 sm:px-6 py-3 bg-muted/30 rounded-b-xl cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        setViewingReview(item)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= item.review!.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        {item.review.comment && (
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            "{item.review.comment}"
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">View Review</span>
                    </div>
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
                ) : undefined}
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

        {/* View Review Modal */}
        {viewingReview && viewingReview.review && (
          <Dialog open={!!viewingReview} onOpenChange={() => setViewingReview(null)}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Your Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Provider Info */}
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0">
                    <Image 
                      src={viewingReview.providerAvatar} 
                      alt={viewingReview.provider} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{viewingReview.provider}</p>
                    <p className="text-sm text-muted-foreground">{viewingReview.title}</p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center justify-center gap-1 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 ${
                        star <= viewingReview.review!.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                {viewingReview.review.comment && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm italic">"{viewingReview.review.comment}"</p>
                  </div>
                )}

                {/* Date */}
                <p className="text-xs text-center text-muted-foreground">
                  Reviewed on {viewingReview.review.date.toLocaleDateString("en-US", { 
                    month: "long", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
