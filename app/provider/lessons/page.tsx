"use client"

import { useState, Suspense } from "react"
import { ServiceCard } from "@/components/service-card"
import { ServiceDetailModal } from "@/components/service-detail-modal"
import { ReviewDisplay, type ReviewData } from "@/components/review-display"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, Clock, MapPin, User, DollarSign, Timer } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMockMessages } from "@/hooks/use-mock-messages"
import { useAuth } from "@/lib/auth-context"


type LessonStatus = "active" | "completed" | "cancelled"
type FilterKey = "active" | "received"

interface Lesson {
  id: string
  title: string
  student: string
  studentAvatar: string
  parent: string
  parentAvatar?: string
  date: Date
  time: string
  duration: string
  location: string
  rate: number
  status: LessonStatus
  paid?: boolean
  pendingApproval?: boolean
  review?: ReviewData
}



export default function ProviderLessonsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProviderLessonsContent />
    </Suspense>
  )
}

function ProviderLessonsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { conversations } = useMockMessages()
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  const initialTab = searchParams.get("tab")
  const [filter, setFilter] = useState<FilterKey>(
    initialTab === "received" ? "received" : "active"
  )

  const handleMessageParent = (parentName: string) => {
    const conv = conversations.find((c) =>
      c.participants.some((p) => p.name === parentName && p.id !== user?.id)
    )
    router.push(conv ? `/provider/messages?conv=${conv.id}` : `/provider/messages`)
  }

  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "lesson-1", title: "Piano Lesson", student: "Emma Thompson",
      studentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      parent: "Sarah Thompson", date: new Date("2026-02-06"), time: "4:00 PM",
      duration: "45 min", location: "Naperville, IL", rate: 65, status: "active",
    },
    {
      id: "lesson-2", title: "Music Theory Session", student: "Jake Wilson",
      studentAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      parent: "Lisa Wilson", date: new Date("2026-02-06"), time: "5:00 PM",
      duration: "30 min", location: "Online", rate: 45, status: "active",
    },
    {
      id: "lesson-3", title: "Piano Lesson", student: "Sophia Martinez",
      studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      parent: "Ana Martinez", date: new Date("2026-02-07"), time: "3:30 PM",
      duration: "60 min", location: "Downers Grove, IL", rate: 75, status: "active",
    },
    {
      id: "lesson-4", title: "Piano Lesson", student: "Emma Thompson",
      studentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      parent: "Sarah Thompson", date: new Date("2026-02-13"), time: "4:00 PM",
      duration: "45 min", location: "Naperville, IL", rate: 65, status: "active",
    },
    {
      id: "lesson-5", title: "Piano Lesson", student: "Mia Johnson",
      studentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      parent: "Robert Johnson", date: new Date("2026-02-10"), time: "2:00 PM",
      duration: "45 min", location: "Online", rate: 65, status: "active", pendingApproval: true,
    },
    {
      id: "lesson-c1", title: "Piano Lesson", student: "Emma Thompson",
      studentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      parent: "Sarah Thompson", parentAvatar: "/parent-woman.jpg", date: new Date("2026-01-30"), time: "4:00 PM",
      duration: "45 min", location: "Naperville, IL", rate: 65, status: "completed", paid: true,
      review: {
        id: "review-1",
        rating: 5,
        comment: "Emma had an amazing lesson! The teacher was patient and really helped her understand the new piece. We're so happy with the progress she's making.",
        reviewerName: "Sarah Thompson",
        reviewerAvatar: "/parent-woman.jpg",
        date: new Date("2026-01-31"),
      },
    },
    {
      id: "lesson-c2", title: "Music Theory Session", student: "Jake Wilson",
      studentAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      parent: "Lisa Wilson", parentAvatar: "/avatars/jennifer-wilson.jpg", date: new Date("2026-01-29"), time: "5:00 PM",
      duration: "30 min", location: "Online", rate: 45, status: "completed", paid: true,
      review: {
        id: "review-2",
        rating: 4,
        comment: "Great session! Jake really enjoyed learning about chord progressions. Would love more practice exercises for home.",
        reviewerName: "Lisa Wilson",
        reviewerAvatar: "/avatars/jennifer-wilson.jpg",
        date: new Date("2026-01-30"),
      },
    },
    {
      id: "lesson-c3", title: "Piano Lesson", student: "Sophia Martinez",
      studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      parent: "Ana Martinez", parentAvatar: "/avatars/amanda-martinez.jpg", date: new Date("2026-01-28"), time: "3:30 PM",
      duration: "60 min", location: "Downers Grove, IL", rate: 75, status: "completed", paid: false,
    },
    {
      id: "lesson-x1", title: "Guitar Lesson", student: "Liam Parker",
      studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      parent: "David Parker", date: new Date("2026-01-22"), time: "4:30 PM",
      duration: "45 min", location: "Naperville, IL", rate: 65, status: "cancelled",
    },
  ])

  const handleStatusChange = (id: string, newStatus: LessonStatus) => {
    setLessons((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l))
    if (selectedLesson?.id === id) {
      setSelectedLesson((prev) => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const activeLessons = lessons.filter((l) => l.status === "active")
  const completedLessons = lessons.filter((l) => l.status === "completed" || l.status === "cancelled")

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

  const filters: { key: FilterKey; label: string }[] = [
    { key: "active", label: `Active (${activeLessons.length})` },
    { key: "received", label: `Received (${completedLessons.length})` },
  ]

  const currentLessons = filter === "active" ? activeLessons : filter === "received" ? completedLessons : completedLessons

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-12">
      <div className="page-container pt-6">
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground">Lessons</h1>
          <p className="text-sm text-muted-foreground">View your active and past lessons</p>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {currentLessons.length > 0 ? (
          <div className="space-y-10">
            {currentLessons.map((lesson) => (
              <ServiceCard
                key={lesson.id}
                image={lesson.studentAvatar}
                imageAlt={lesson.student}
                title={lesson.title}
                subtitle={`${lesson.student} (${lesson.parent})`}
                price={`$${lesson.rate}`}
                priceClassName={
                  lesson.status === "cancelled" || lesson.paid === true ? "text-muted-foreground" : "text-primary"
                }
                status={lesson.status === "completed" && lesson.paid === true ? "paid" : lesson.status === "completed" && lesson.paid === false ? "completed" : lesson.status === "cancelled" ? "cancelled" : lesson.pendingApproval ? "pending" : "active"}
                onClick={() => setSelectedLesson(lesson)}
                footer={lesson.pendingApproval ? (
                  <div className="flex items-center justify-end gap-2 px-4 sm:px-6 py-3 bg-primary rounded-b-xl">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full px-5 font-semibold"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLessons((prev) => prev.map((l) => l.id === lesson.id ? { ...l, pendingApproval: false } : l))
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full px-5 font-semibold text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLessons((prev) => prev.map((l) => l.id === lesson.id ? { ...l, status: "cancelled", pendingApproval: false } : l))
                      }}
                    >
                      Decline
                    </Button>
                  </div>
                ) : undefined}
                details={
                  <>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {lesson.parent}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(lesson.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {lesson.time} ({lesson.duration})
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {lesson.location}
                    </span>
                  </>
                }
              >
                {lesson.review && (
                  <ReviewDisplay review={lesson.review} serviceName={lesson.title} />
                )}
              </ServiceCard>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-1">No lessons found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "active" ? "You have no active lessons scheduled" : "No completed lessons yet"}
            </p>
          </Card>
        )}

        {selectedLesson && (
          <ServiceDetailModal
            open={!!selectedLesson}
            onClose={() => setSelectedLesson(null)}
            title={selectedLesson.title}
            status={selectedLesson.status}
            onStatusChange={(s) => handleStatusChange(selectedLesson.id, s as LessonStatus)}
            people={[
              { name: selectedLesson.student, role: "Student", avatar: selectedLesson.studentAvatar },
              { name: selectedLesson.parent, role: "Parent / Guardian" },
            ]}
            fields={[
              { icon: <Calendar className="h-4 w-4" />, label: "Date", value: formatDate(selectedLesson.date) },
              { icon: <Clock className="h-4 w-4" />, label: "Time", value: `${selectedLesson.time} (${selectedLesson.duration})` },
              { icon: <MapPin className="h-4 w-4" />, label: "Location", value: selectedLesson.location },
              { icon: <DollarSign className="h-4 w-4" />, label: "Rate", value: `$${selectedLesson.rate}` },
            ]}
            price={`$${selectedLesson.rate}`}
            onMessage={() => {
              handleMessageParent(selectedLesson.parent)
              setSelectedLesson(null)
            }}
            messageLabel="Message Parent"
            review={selectedLesson.review}
          />
        )}

      </div>
    </div>
  )
}
