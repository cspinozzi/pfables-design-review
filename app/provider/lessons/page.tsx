"use client"

import { useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { ServiceCard } from "@/components/service-card"
const ServiceDetailModal = dynamic(() => import("@/components/service-detail-modal").then(m => ({ default: m.ServiceDetailModal })), { ssr: false })
import { ReviewDisplay, type ReviewData } from "@/components/review-display"
import { useRouter, useSearchParams } from "next/navigation"
import { BookOpen, Calendar, CheckCircle2, Clock, MapPin, User, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CompleteLessonDialog } from "@/components/provider/complete-lesson-dialog"
import { useMockMessages } from "@/hooks/use-mock-messages"
import { useAuth } from "@/lib/auth-context"
import { useReschedule } from "@/lib/reschedule-context"
import { useMessageContext } from "@/lib/message-context"
import { useLessonCompletion } from "@/lib/lesson-completion-context"

type LessonStatus = "active" | "completed" | "cancelled"
type FilterKey = "active" | "received"

interface Lesson {
  id: string
  title: string
  student: string
  studentAvatar: string
  parent: string
  parentAvatar?: string
  date: string
  dateObj?: Date
  time: string
  duration: string
  location: string
  rate: number
  status: LessonStatus
  paid?: boolean
  pendingApproval?: boolean
  review?: ReviewData
  /** Topic covered during the lesson — populated for completed lessons. */
  topic?: string
  originalDate?: string
  originalTime?: string
  isRescheduleRequest?: boolean
}

// Module-scope helpers — evaluated once at bundle time, identical on server and client
function fmtDate(d: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`
}

// Fixed reference: Mar 27 2026 08:00 local — stable across server and client
const _ref  = new Date(2026, 2, 27, 8, 0, 0)
const _in12h = new Date(_ref.getTime() + 12 * 60 * 60 * 1000)
const _in2d  = new Date(_ref.getTime() + 2 * 24 * 60 * 60 * 1000)
const _in4d  = new Date(_ref.getTime() + 4 * 24 * 60 * 60 * 1000)
const _in6d  = new Date(_ref.getTime() + 6 * 24 * 60 * 60 * 1000)
const _in8d  = new Date(_ref.getTime() + 8 * 24 * 60 * 60 * 1000)

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
  const { rescheduledIds, addProviderReschedule } = useReschedule()
  const { findConversationByParticipantName, sendMessage } = useMessageContext()
  const { completeLesson, getCompletion } = useLessonCompletion()
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [completingLesson, setCompletingLesson] = useState<Lesson | null>(null)

  const handleCompleteSubmit = ({ topic, comment }: { topic: string; comment: string }) => {
    const lesson = completingLesson
    if (!lesson) return

    completeLesson({
      id: lesson.id,
      title: lesson.title,
      student: lesson.student,
      studentAvatar: lesson.studentAvatar,
      parent: lesson.parent,
      parentAvatar: lesson.parentAvatar,
      rate: lesson.rate,
      duration: lesson.duration,
      location: lesson.location,
      originalDate: lesson.date,
      topic,
      comment: comment || undefined,
      completedAt: new Date(),
    })

    setCompletingLesson(null)

    toast.success("Lesson marked as complete", {
      description: "Payment moved to Waiting Payment.",
    })
  }

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
      id: "lesson-1",
      title: "Piano Lesson",
      student: "Emma Thompson",
      studentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      parent: "Sarah Thompson",
      date: fmtDate(_in12h),
      dateObj: _in12h,
      time: "4:00 PM",
      duration: "45 min",
      location: "Naperville, IL",
      rate: 65,
      status: "active",
    },
    {
      id: "lesson-2",
      title: "Music Theory Session",
      student: "Jake Wilson",
      studentAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      parent: "Lisa Wilson",
      date: fmtDate(_in2d),
      dateObj: _in2d,
      time: "5:00 PM",
      duration: "30 min",
      location: "Online",
      rate: 45,
      status: "active",
    },
    {
      id: "lesson-3",
      title: "Piano Lesson",
      student: "Sophia Martinez",
      studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      parent: "Ana Martinez",
      date: fmtDate(_in4d),
      dateObj: _in4d,
      time: "3:30 PM",
      duration: "60 min",
      location: "Downers Grove, IL",
      rate: 75,
      status: "active",
    },
    {
      id: "lesson-4",
      title: "Piano Lesson",
      student: "Emma Thompson",
      studentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      parent: "Sarah Thompson",
      date: fmtDate(_in6d),
      dateObj: _in6d,
      time: "4:00 PM",
      duration: "45 min",
      location: "Naperville, IL",
      rate: 65,
      status: "active",
    },
    {
      id: "lesson-5",
      title: "Piano Lesson",
      student: "Mia Johnson",
      studentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      parent: "Robert Johnson",
      date: fmtDate(_in8d),
      dateObj: _in8d,
      time: "2:00 PM",
      duration: "45 min",
      location: "Online",
      rate: 65,
      status: "active",
      pendingApproval: true,
    },
    // Rescheduled lesson — provider already proposed new time, showing old/new dates
    {
      id: "lesson-rescheduled-1",
      title: "Guitar Lesson",
      student: "Jake Wilson",
      studentAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      parent: "Mike Wilson",
      date: fmtDate(_in4d),
      dateObj: _in4d,
      time: "3:00 PM",
      duration: "45 min",
      location: "Naperville, IL",
      rate: 55,
      status: "active",
      originalDate: fmtDate(_in2d),
      originalTime: "4:00 PM",
    },
    // Reschedule request — parent requested reschedule, awaiting provider acceptance
    {
      id: "lesson-reschedule-request-1",
      title: "Violin Lesson",
      student: "Sophia Martinez",
      studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      parent: "Ana Martinez",
      date: fmtDate(_in6d),
      dateObj: _in6d,
      time: "2:00 PM",
      duration: "60 min",
      location: "Online",
      rate: 70,
      status: "active",
      isRescheduleRequest: true,
      originalDate: fmtDate(_in2d),
      originalTime: "3:30 PM",
    },
    {
      id: "lesson-c1",
      title: "Piano Lesson",
      student: "Emma Thompson",
      studentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      parent: "Sarah Thompson",
      parentAvatar: "/parent-woman.jpg",
      date: "Fri, Jan 30",
      time: "4:00 PM",
      duration: "45 min",
      location: "Naperville, IL",
  rate: 65,
  status: "completed",
  paid: true,
  topic: "Major scales and sight-reading basics",
  review: {
  id: "review-1",
  rating: 5,
  comment: "Emma had an amazing lesson! The teacher was patient and really helped her understand the new piece.",
  reviewerName: "Sarah Thompson",
  reviewerAvatar: "/parent-woman.jpg",
  date: new Date(2026, 0, 31),
  },
  },
    {
      id: "lesson-c2",
      title: "Music Theory Session",
      student: "Jake Wilson",
      studentAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      parent: "Lisa Wilson",
      parentAvatar: "/avatars/jennifer-wilson.jpg",
      date: "Thu, Jan 29",
      time: "5:00 PM",
      duration: "30 min",
      location: "Online",
  rate: 45,
  status: "completed",
  paid: true,
  topic: "Chord progressions and circle of fifths",
  review: {
  id: "review-2",
  rating: 4,
  comment: "Great session! Jake really enjoyed learning about chord progressions.",
  reviewerName: "Lisa Wilson",
  reviewerAvatar: "/avatars/jennifer-wilson.jpg",
  date: new Date(2026, 0, 30),
  },
  },
    {
      id: "lesson-c3",
      title: "Piano Lesson",
      student: "Sophia Martinez",
      studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      parent: "Ana Martinez",
      parentAvatar: "/avatars/amanda-martinez.jpg",
      date: "Wed, Jan 28",
      time: "3:30 PM",
      duration: "60 min",
      location: "Downers Grove, IL",
  rate: 75,
  status: "completed",
  paid: false,
  topic: "Introduction to arpeggios and hand coordination",
  },
    {
      id: "lesson-c4",
      title: "Violin Lesson",
      student: "Oliver Chen",
      studentAvatar: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100&h=100&fit=crop",
      parent: "Mei Chen",
      parentAvatar: "/avatars/amanda-martinez.jpg",
      date: "Tue, Jan 27",
      time: "5:30 PM",
      duration: "45 min",
      location: "Aurora, IL",
      rate: 70,
      status: "completed",
      paid: true,
      review: {
        id: "review-4",
        rating: 5,
        comment: "Oliver loved the lesson and can't wait for the next one!",
        reviewerName: "Mei Chen",
        reviewerAvatar: "/avatars/amanda-martinez.jpg",
        date: new Date(2026, 0, 27),
      },
    },
    {
      id: "lesson-c5",
      title: "Drum Lesson",
      student: "Noah Brooks",
      studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      parent: "Rachel Brooks",
      date: "Mon, Jan 26",
      time: "6:00 PM",
      duration: "45 min",
      location: "Naperville, IL",
      rate: 60,
      status: "completed",
      paid: true,
    },
    {
      id: "lesson-x1",
      title: "Guitar Lesson",
      student: "Liam Parker",
      studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      parent: "David Parker",
      date: "Thu, Jan 22",
      time: "4:30 PM",
      duration: "45 min",
      location: "Naperville, IL",
      rate: 65,
      status: "cancelled",
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

  const filters: { key: FilterKey; label: string }[] = [
    { key: "active", label: `Active (${activeLessons.length})` },
    { key: "received", label: `Received (${completedLessons.length})` },
  ]

  const currentLessons = filter === "active" ? activeLessons : completedLessons

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-12">
      <div className="page-container pt-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="mb-1 font-display text-2xl font-medium text-foreground">Lessons</h1>
            <p className="text-sm text-muted-foreground">View your active and past lessons</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-1.5 self-start"
            onClick={() => router.push("/provider/lessons/history")}
          >
            <BookOpen className="h-4 w-4" />
            View History
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
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
                  lesson.status === "cancelled" || lesson.paid === true
                    ? "text-muted-foreground"
                    : "text-primary"
                }
                status={
                  lesson.isRescheduleRequest ? "reschedule_request" :
                  (lesson.originalDate && !lesson.isRescheduleRequest) || rescheduledIds.has(lesson.id) ? "rescheduled" :
                  lesson.status === "completed" && lesson.paid === true ? "received" :
                  lesson.status === "completed" && lesson.paid === false ? "completed" :
                  lesson.status === "cancelled" ? "cancelled" :
                  lesson.pendingApproval ? "pending" : "active"
                }
                onClick={() => setSelectedLesson(lesson)}
                footer={lesson.isRescheduleRequest ? (
                  <div className="flex items-center justify-end gap-2 px-4 sm:px-6 py-3 bg-primary rounded-b-xl">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full px-5 font-semibold"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Accept reschedule — mark as rescheduled (not a request anymore)
                        setLessons((prev) => prev.map((l) =>
                          l.id === lesson.id ? { ...l, isRescheduleRequest: false } : l
                        ))
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
                        // Decline reschedule — revert to original date/time
                        setLessons((prev) => prev.map((l) =>
                          l.id === lesson.id ? { ...l, isRescheduleRequest: false, date: l.originalDate ?? l.date, time: l.originalTime ?? l.time, originalDate: undefined, originalTime: undefined } : l
                        ))
                      }}
                    >
                      Decline
                    </Button>
                  </div>
                ) : lesson.pendingApproval ? (
                  <div className="flex items-center justify-end gap-2 px-4 sm:px-6 py-3 bg-primary rounded-b-xl">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full px-5 font-semibold"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLessons((prev) => prev.map((l) =>
                          l.id === lesson.id ? { ...l, pendingApproval: false } : l
                        ))
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
                        setLessons((prev) => prev.map((l) =>
                          l.id === lesson.id ? { ...l, status: "cancelled", pendingApproval: false } : l
                        ))
                      }}
                    >
                      Decline
                    </Button>
                  </div>
                ) : lesson.status === "completed" ? (() => {
                  const completion = getCompletion(lesson.id)
                  const topic = completion?.topic ?? lesson.topic
                  const review = lesson.review

                  // Has topic → fully completed. Show topic on the left and review (or
                  // "No review yet" placeholder) on the right. No Complete button.
                  if (topic) {
                    const topicNode = (
                      <div className="flex items-center gap-2 text-sm min-w-0">
                        <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">
                          <span className="text-muted-foreground">Topic: </span>
                          <span className="font-medium text-foreground">{topic}</span>
                        </span>
                      </div>
                    )
                    if (review) {
                      return (
                        <ReviewDisplay
                          review={review}
                          serviceName={lesson.title}
                          leftContent={topicNode}
                        />
                      )
                    }
                    return (
                      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-primary/10 rounded-b-xl">
                        <div className="flex-1 min-w-0">{topicNode}</div>
                        <span className="text-xs text-muted-foreground italic shrink-0">No review yet</span>
                      </div>
                    )
                  }

                  // Topic missing → provider still needs to log it. Show the Complete
                  // button, plus the review on the right if the parent already left one.
                  const completeBtn = (
                    <Button
                      size="sm"
                      className="rounded-full px-4 py-1.5 h-auto text-sm font-semibold gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCompletingLesson(lesson)
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </Button>
                  )
                  const topicHint = (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                      <BookOpen className="h-4 w-4 shrink-0" />
                      <span className="truncate">Add lesson topic to finish this session</span>
                    </div>
                  )
                  if (review) {
                    return (
                      <ReviewDisplay
                        review={review}
                        serviceName={lesson.title}
                        leftContent={topicHint}
                        rightAction={completeBtn}
                      />
                    )
                  }
                  return (
                    <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-primary/10 rounded-b-xl">
                      <div className="flex-1 min-w-0">{topicHint}</div>
                      {completeBtn}
                    </div>
                  )
                })() : undefined}
                details={
                  <>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {lesson.parent}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {lesson.date}
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
              />
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
            status={selectedLesson.pendingApproval ? "pending" : selectedLesson.status}
            onStatusChange={(s) => handleStatusChange(selectedLesson.id, s as LessonStatus)}
            people={[
              { name: selectedLesson.student, role: "Student", avatar: selectedLesson.studentAvatar },
              { name: selectedLesson.parent, role: "Parent / Guardian" },
            ]}
            fields={[
              { icon: <Calendar className="h-4 w-4" />, label: "Date", value: selectedLesson.date },
              { icon: <Clock className="h-4 w-4" />, label: "Time", value: `${selectedLesson.time} (${selectedLesson.duration})` },
              { icon: <MapPin className="h-4 w-4" />, label: "Location", value: selectedLesson.location },
              { icon: <DollarSign className="h-4 w-4" />, label: "Rate", value: `$${selectedLesson.rate}` },
            ]}
            originalDate={selectedLesson.originalDate}
            originalTime={selectedLesson.originalTime}
            isRescheduleRequest={selectedLesson.isRescheduleRequest}
            onAcceptReschedule={(selectedLesson.isRescheduleRequest || selectedLesson.pendingApproval) ? () => {
              if (selectedLesson.isRescheduleRequest) {
                // Accept reschedule — mark as rescheduled (not a request anymore)
                setLessons((prev) => prev.map((l) =>
                  l.id === selectedLesson.id ? { ...l, isRescheduleRequest: false } : l
                ))
                setSelectedLesson((prev) => prev ? { ...prev, isRescheduleRequest: false } : null)
              } else if (selectedLesson.pendingApproval) {
                // Accept pending lesson
                setLessons((prev) => prev.map((l) =>
                  l.id === selectedLesson.id ? { ...l, pendingApproval: false, status: "active" } : l
                ))
                setSelectedLesson(null)
              }
            } : undefined}
            onDeclineReschedule={(selectedLesson.isRescheduleRequest || selectedLesson.pendingApproval) ? () => {
              if (selectedLesson.isRescheduleRequest) {
                // Decline reschedule — revert to original date/time
                setLessons((prev) => prev.map((l) =>
                  l.id === selectedLesson.id
                    ? { ...l, isRescheduleRequest: false, date: l.originalDate ?? l.date, time: l.originalTime ?? l.time, originalDate: undefined, originalTime: undefined }
                    : l
                ))
              } else if (selectedLesson.pendingApproval) {
                // Decline pending lesson — remove from list
                setLessons((prev) => prev.filter((l) => l.id !== selectedLesson.id))
              }
              setSelectedLesson(null)
            } : undefined}
            price={`$${selectedLesson.rate}`}
            onMessage={() => {
              handleMessageParent(selectedLesson.parent)
              setSelectedLesson(null)
            }}
            messageLabel="Message Parent"
            showRescheduleButton={(selectedLesson.status === "active" || selectedLesson.status === "rescheduled" || (selectedLesson.originalDate && !selectedLesson.isRescheduleRequest)) && !selectedLesson.pendingApproval && !selectedLesson.isRescheduleRequest}
            currentSessionDate={selectedLesson.dateObj}
            currentSessionTime={selectedLesson.time}
            onReschedule={(newDate: Date, newTime: string) => {
              const lesson = selectedLesson
              const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
              const formatted = `${days[newDate.getDay()]}, ${months[newDate.getMonth()]} ${newDate.getDate()}`
              setLessons((prev) => prev.map((l) =>
                l.id === lesson.id
                  ? { ...l, date: formatted, dateObj: newDate, time: newTime, originalDate: l.originalDate ?? l.date, originalTime: l.originalTime ?? l.time }
                  : l
              ))
              setSelectedLesson((prev) => prev
                ? { ...prev, date: formatted, dateObj: newDate, time: newTime, originalDate: prev.originalDate ?? prev.date, originalTime: prev.originalTime ?? prev.time }
                : null
              )
              addProviderReschedule({
                id: lesson.id,
                title: lesson.title,
                parentName: user?.name ?? "Provider",
                parentAvatar: user?.avatar ?? "/music-teacher-woman.jpg",
                childName: lesson.student,
                newDate,
                newTime,
                duration: lesson.duration,
                location: lesson.location,
                rescheduledAt: new Date(),
              })
              const conv = findConversationByParticipantName(lesson.parent, user?.id)
              if (conv && user) {
                sendMessage(
                  conv.id,
                  `Hi! I need to reschedule our ${lesson.title} for ${lesson.student} to ${formatted} at ${newTime}. Please let me know if this works for you.`,
                  user.id,
                  user.name,
                  user.avatar
                )
              }
            }}
            review={selectedLesson.review}
            topic={getCompletion(selectedLesson.id)?.topic ?? selectedLesson.topic}
            providerNote={getCompletion(selectedLesson.id)?.comment}
          />
        )}

        <CompleteLessonDialog
          open={!!completingLesson}
          onClose={() => setCompletingLesson(null)}
          lessonTitle={completingLesson?.title}
          studentName={completingLesson?.student}
          onSubmit={handleCompleteSubmit}
        />
      </div>
    </div>
  )
}
