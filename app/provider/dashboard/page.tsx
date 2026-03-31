"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users, MessageCircle, DollarSign, Eye, TrendingUp, Calendar, ChevronRight, ShieldCheck, CheckCircle2, Clock, Timer, AlertCircle, Phone, MapPin, User, Inbox, CalendarCheck, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VerificationBadge } from "@/components/verification-badge"
import { useAuth } from "@/lib/auth-context"
import { useReschedule } from "@/lib/reschedule-context"
import { useMessageContext } from "@/lib/message-context"
import { cn } from "@/lib/utils"
import { mockProviders, mockConversations } from "@/lib/mock-data"
import { useMockMessages } from "@/hooks/use-mock-messages"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { LessonsCalendar, type CalendarLesson } from "@/components/lessons-calendar"
import { ServiceCard } from "@/components/service-card"
import dynamic from "next/dynamic"
const ServiceDetailModal = dynamic(() => import("@/components/service-detail-modal").then(m => ({ default: m.ServiceDetailModal })), { ssr: false })

interface LessonRequest {
  id: string
  title: string
  parent: string
  parentId: string
  parentAvatar: string
  child: string
  date: string
  dateObj?: Date
  time: string
  duration: string
  location: string
  isReschedule?: boolean
  originalDate?: string
  originalTime?: string
}

export default function ProviderDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { conversations } = useMockMessages()
  const provider = mockProviders.find((p) => p.userId === user?.id)

  const { rescheduledLessons, addProviderReschedule } = useReschedule()
  const { findConversationByParticipantName, sendMessage } = useMessageContext()

  const [selectedLesson, setSelectedLesson] = useState<CalendarLesson | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<LessonRequest | null>(null)
  const [baseRequests, setBaseRequests] = useState<LessonRequest[]>([
    { id: "lr-1", title: "Piano Lesson", parent: "Sarah Thompson", parentId: "user-1", parentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", child: "Emma", date: "Thu, Feb 6", time: "4:00 PM", duration: "45 min", location: "Naperville, IL" },
    { id: "lr-2", title: "Music Theory Session", parent: "Mike Wilson", parentId: "user-2", parentAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", child: "Jake", date: "Thu, Feb 6", time: "5:00 PM", duration: "30 min", location: "Online" },
    { id: "lr-3", title: "Piano Lesson", parent: "Laura Martinez", parentId: "user-3", parentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", child: "Sophia", date: "Fri, Feb 7", time: "3:30 PM", duration: "60 min", location: "Downers Grove, IL" },
    // Reschedule request — parent requested reschedule, provider needs to suggest new time
    { id: "lr-reschedule-1", title: "Guitar Lesson", parent: "Sarah Thompson", parentId: "user-1", parentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", child: "Emma", date: "Wed, Apr 1", time: "4:00 PM", duration: "60 min", location: "Online", isReschedule: true, originalDate: "Mon, Mar 30", originalTime: "3:00 PM" },
  ])

  // Merge static base requests with any rescheduled lessons from the parent side
  const rescheduledAsRequests: LessonRequest[] = rescheduledLessons
    .filter((r) => !baseRequests.some((br) => br.id === `reschedule-${r.id}`))
    .map((r) => ({
      id: `reschedule-${r.id}`,
      title: r.title,
      parent: r.parentName,
      parentId: "",
      parentAvatar: r.parentAvatar,
      child: r.childName,
      date: (() => {
        const d = r.newDate
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`
      })(),
      time: r.newTime,
      duration: r.duration,
      location: r.location,
      isReschedule: true,
    }))
  const requests = [...baseRequests, ...rescheduledAsRequests]

  const handleMessage = (parentName: string) => {
    const conv = conversations.find((c) =>
      c.participants.some((p) => p.name === parentName && p.id !== user?.id)
    )
    if (conv) {
      router.push(`/provider/messages?conv=${conv.id}`)
    } else {
      router.push(`/provider/messages`)
    }
  }

  const handleAccept = (request: LessonRequest) => {
    setBaseRequests((prev) => prev.filter((r) => r.id !== request.id))
    toast.success("Lesson Confirmed", {
      description: `${request.title} requested by ${request.parent} has been confirmed.`,
    })
  }

  // Calendar lessons data — past, upcoming (confirmed), and requests
  const calendarLessons: CalendarLesson[] = [
    // Past lessons
    { id: "cl-p1", title: "Piano Lesson", date: new Date("2026-01-28"), time: "3:30 PM", student: "Laura Martinez", type: "past" },
    { id: "cl-p2", title: "Music Theory", date: new Date("2026-01-29"), time: "5:00 PM", student: "Mike Wilson", type: "past" },
    { id: "cl-p3", title: "Piano Lesson", date: new Date("2026-01-30"), time: "4:00 PM", student: "Sarah Thompson", type: "past" },
    { id: "cl-p4", title: "Piano Lesson", date: new Date("2026-02-03"), time: "4:00 PM", student: "Sarah Thompson", type: "past" },
    { id: "cl-p5", title: "Guitar Lesson", date: new Date("2026-02-04"), time: "3:00 PM", student: "David Parker", type: "past" },
    { id: "cl-p6", title: "Music Theory", date: new Date("2026-02-05"), time: "5:00 PM", student: "Mike Wilson", type: "past" },
    { id: "cl-p7", title: "Piano Lesson", date: new Date("2026-02-10"), time: "4:00 PM", student: "Sarah Thompson", type: "past" },
    { id: "cl-p8", title: "Piano Lesson", date: new Date("2026-02-11"), time: "3:30 PM", student: "Laura Martinez", type: "past" },
    { id: "cl-p9", title: "Music Theory", date: new Date("2026-02-12"), time: "5:00 PM", student: "Mike Wilson", type: "past" },
    { id: "cl-p10", title: "Piano Lesson", date: new Date("2026-02-17"), time: "4:00 PM", student: "Sarah Thompson", type: "past" },
    // Upcoming confirmed lessons
    { id: "cl-u1", title: "Piano Lesson", date: new Date("2026-02-19"), time: "4:00 PM", student: "Sarah Thompson", type: "upcoming" },
    { id: "cl-u2", title: "Music Theory", date: new Date("2026-02-19"), time: "5:00 PM", student: "Mike Wilson", type: "upcoming" },
    { id: "cl-u3", title: "Piano Lesson", date: new Date("2026-02-20"), time: "3:30 PM", student: "Laura Martinez", type: "upcoming" },
    { id: "cl-u4", title: "Piano Lesson", date: new Date("2026-02-24"), time: "4:00 PM", student: "Sarah Thompson", type: "upcoming" },
    { id: "cl-u5", title: "Guitar Lesson", date: new Date("2026-02-25"), time: "3:00 PM", student: "David Parker", type: "upcoming" },
    { id: "cl-u6", title: "Music Theory", date: new Date("2026-02-26"), time: "5:00 PM", student: "Mike Wilson", type: "upcoming" },
    { id: "cl-u7", title: "Piano Lesson", date: new Date("2026-02-27"), time: "3:30 PM", student: "Laura Martinez", type: "upcoming" },
    // Requests (pending)
    ...requests.map((r) => ({
      id: `cl-r-${r.id}`,
      title: r.title,
      date: new Date(r.id === "lr-1" ? "2026-02-21" : r.id === "lr-2" ? "2026-02-21" : "2026-02-22"),
      time: r.time,
      student: r.parent,
      type: "request" as const,
    })),
  ]

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold">Provider Profile Not Found</h1>
          <p className="text-muted-foreground">Please contact support to set up your provider profile.</p>
        </div>
      </div>
    )
  }

  const providerConversations = mockConversations.filter((conv) => conv.participants.some((p) => p.id === user?.id))

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        {/* Header */}
        <div className="mb-10">
          

          {(() => {
            const now = new Date()
            const startOfWeek = new Date(now)
            startOfWeek.setDate(now.getDate() - now.getDay())
            const endOfWeek = new Date(startOfWeek)
            endOfWeek.setDate(startOfWeek.getDate() + 6)
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

            const lessonRequests = requests.length
            const pendingThisWeek = calendarLessons.filter(
              (l) => l.type === "upcoming" && l.date >= startOfWeek && l.date <= endOfWeek
            ).length
            const pendingTotal = calendarLessons.filter((l) => l.type === "upcoming").length
            const completedThisMonth = calendarLessons.filter(
              (l) => l.type === "past" && l.date >= startOfMonth && l.date <= endOfMonth
            ).length

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="flex flex-col items-center justify-center p-4">
                  <Inbox className="h-5 w-5 text-primary mb-1" />
                  <p className="text-2xl font-bold">{lessonRequests}</p>
                  <p className="text-xs text-muted-foreground">Requests</p>
                </Card>
                <Card className="flex flex-col items-center justify-center p-4">
                  <Calendar className="h-5 w-5 text-primary mb-1" />
                  <p className="text-2xl font-bold">{pendingThisWeek}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </Card>
                <Card className="flex flex-col items-center justify-center p-4">
                  <Clock className="h-5 w-5 text-primary mb-1" />
                  <p className="text-2xl font-bold">{pendingTotal}</p>
                  <p className="text-xs text-muted-foreground">Pending Total</p>
                </Card>
                <Card className="flex flex-col items-center justify-center p-4">
                  <CalendarCheck className="h-5 w-5 text-primary mb-1" />
                  <p className="text-2xl font-bold">{completedThisMonth}</p>
                  <p className="text-xs text-muted-foreground">Done This Month</p>
                </Card>
              </div>
            )
          })()}
        </div>

        {/* Monthly Calendar */}
        <div className="mb-10">
          <LessonsCalendar lessons={calendarLessons} onLessonClick={setSelectedLesson} />
        </div>

        {provider.backgroundCheckStatus !== "approved" && (
          <div className="mb-10">
            <Card className="border-warning/50 bg-warning/5 p-5">
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <VerificationBadge status={provider.backgroundCheckStatus} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 text-sm">
                      {provider.backgroundCheckStatus === "pending"
                        ? "Verification In Progress"
                        : provider.backgroundCheckStatus === "rejected"
                          ? "Verification Issue"
                          : "Get Verified"}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {provider.backgroundCheckStatus === "pending"
                        ? "Usually takes 2-3 business days"
                        : provider.backgroundCheckStatus === "rejected"
                          ? "Contact support for details"
                          : "Gain parent trust with verification"}
                    </p>
                    {provider.backgroundCheckStatus === "none" && (
                      <Button asChild size="sm" className="h-9 w-full">
                        <Link href="/provider/verification">Start Verification</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lesson Requests */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-medium">Lesson Requests</h2>
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link href="/provider/lessons?tab=requested">
                View All
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="space-y-10">
            {requests.length === 0 ? (
              <Card className="p-5">
                <div className="py-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 font-semibold text-sm">All caught up</h3>
                  <p className="text-xs text-muted-foreground">No pending lesson requests</p>
                </div>
              </Card>
            ) : null}
            {requests.map((request) => (
              <ServiceCard
                key={request.id}
                image={request.parentAvatar}
                imageAlt={request.parent}
                title={request.title}
                subtitle={`Requested by ${request.parent}`}
                status={request.isReschedule ? "reschedule_request" : undefined}
                onClick={() => setSelectedRequest(request)}
                details={
                  <>
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{request.child}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{request.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{request.time} ({request.duration})</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{request.location}</span>
                  </>
                }
                footer={
                  <div className="flex flex-wrap items-center justify-end gap-2 px-4 sm:px-6 py-3 bg-primary rounded-b-xl" onClick={(e) => e.stopPropagation()}>
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs rounded-full border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/20 gap-1.5">
                      <Link href={`/browse/${request.parentId}`}>
                        <User className="h-3 w-3" />
                        View Profile
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs rounded-full border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/20 gap-1.5" onClick={() => handleMessage(request.parent)}>
                      <MessageCircle className="h-3 w-3" />
                      Message
                    </Button>
                    <Button size="sm" className="h-7 text-xs rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/80 gap-1.5" onClick={() => handleAccept(request)}>
                      <CheckCircle2 className="h-3 w-3" />
                      Accept
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        </div>

        {/* Leads / Inquiries */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-medium">Leads</h2>
            <Badge variant="secondary" className="text-xs">
              {providerConversations.length} {providerConversations.length === 1 ? "inquiry" : "inquiries"}
            </Badge>
          </div>

          {providerConversations.length === 0 ? (
            <Card className="p-5">
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 font-semibold text-sm">No inquiries yet</h3>
                <p className="mb-4 text-xs text-muted-foreground">Complete your profile to attract parents</p>
                <Button asChild size="sm">
                  <Link href="/provider/profile">Complete Profile</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-10">
              {providerConversations.map((conv) => {
                const parent = conv.participants.find((p) => p.role === "parent")
                return (
                  <Card key={conv.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Link href="/provider/messages" className="block p-4 active:bg-accent transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={parent?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-sm">{parent?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {conv.unreadCount > 0 && (
                              <div className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-background">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <h4 className="font-semibold text-sm truncate">{parent?.name}</h4>
                              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(conv.lastMessage.timestamp, { addSuffix: true }).replace("about ", "")}
                              </span>
                            </div>
                            <p className={`text-xs line-clamp-1 ${conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                              {conv.lastMessage.content}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                        <div className="flex gap-2 mt-3 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-3 text-xs rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
                            onClick={(e) => {
                              e.preventDefault()
                              window.location.href = `tel:555-0123`
                            }}
                          >
                            <Phone className="mr-1.5 h-3.5 w-3.5" />
                            Call
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-3 text-xs rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
                            onClick={(e) => {
                              e.preventDefault()
                              window.location.href = `/browse/${parent?.id}`
                            }}
                          >
                            <User className="mr-1.5 h-3.5 w-3.5" />
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 px-3 text-xs rounded-full"
                          >
                            <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                            Reply
                          </Button>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        

        {/* Verification - only show when not fully verified */}
        {provider.backgroundCheckStatus !== "approved" && (
          <div className="mb-10">
            <h2 className="font-semibold mb-5">Verification</h2>
            <Card className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Background Check</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {provider.backgroundCheckStatus === "pending"
                      ? "Under review - usually 2-3 business days"
                      : provider.backgroundCheckStatus === "rejected"
                        ? "There was an issue with your verification"
                        : "Get verified to build trust with families"}
                  </p>
                </div>
                <div className="shrink-0">
                  {provider.backgroundCheckStatus === "pending" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                      <Clock className="h-3.5 w-3.5" />
                      Pending
                    </span>
                  )}
                  {provider.backgroundCheckStatus === "rejected" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Rejected
                    </span>
                  )}
                  {provider.backgroundCheckStatus === "none" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      Not Started
                    </span>
                  )}
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/provider/verification">
                  {provider.backgroundCheckStatus === "none" ? "Start Verification" : "View Details"}
                </Link>
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Lesson Detail Modal (from calendar) */}
      {selectedLesson && (
        <ServiceDetailModal
          open={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          title={selectedLesson.title}
          status={selectedLesson.type === "upcoming" ? "active" : selectedLesson.type === "request" ? "pending" : "completed"}
          people={[
            { name: selectedLesson.student, role: "Parent" },
          ]}
          fields={[
            { icon: <Calendar className="h-4 w-4" />, label: "Date", value: selectedLesson.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) },
            { icon: <Clock className="h-4 w-4" />, label: "Time", value: selectedLesson.time },
          ]}
          onMessage={() => {
            handleMessage(selectedLesson.student)
            setSelectedLesson(null)
          }}
          messageLabel="Message"
          extraActions={
            selectedLesson.type === "request" ? (
              <Button className="flex-1 rounded-full" onClick={() => {
                const req = requests.find((r) => r.parent === selectedLesson.student)
                if (req) handleAccept(req)
                setSelectedLesson(null)
              }}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Accept
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <ServiceDetailModal
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={selectedRequest.title}
          status="pending"
          people={[
            { name: selectedRequest.parent, role: "Parent" },
            { name: selectedRequest.child, role: "Student" },
          ]}
          fields={[
            { icon: <Calendar className="h-4 w-4" />, label: "Date", value: selectedRequest.date },
            { icon: <Clock className="h-4 w-4" />, label: "Time", value: selectedRequest.time },
            { icon: <Timer className="h-4 w-4" />, label: "Duration", value: selectedRequest.duration },
            { icon: <MapPin className="h-4 w-4" />, label: "Location", value: selectedRequest.location },
          ]}
          originalDate={selectedRequest.originalDate}
          originalTime={selectedRequest.originalTime}
          isRescheduleRequest={selectedRequest.isReschedule}
          showRescheduledBadge={selectedRequest.isReschedule}
          showRescheduleButton
          rescheduleLabel="Suggest New Time"
          currentSessionDate={selectedRequest.dateObj}
          currentSessionTime={selectedRequest.time}
          onReschedule={(newDate: Date, newTime: string) => {
            const req = selectedRequest
            const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            const formatted = `${days[newDate.getDay()]}, ${months[newDate.getMonth()]} ${newDate.getDate()}`
            addProviderReschedule({
              id: req.id,
              title: req.title,
              parentName: user?.name ?? "Provider",
              parentAvatar: user?.avatar ?? "/music-teacher-woman.jpg",
              childName: req.child,
              newDate,
              newTime,
              duration: req.duration,
              location: req.location,
              rescheduledAt: new Date(),
            })
            const conv = findConversationByParticipantName(req.parent, user?.id)
            if (conv && user) {
              sendMessage(
                conv.id,
                `Hi! I'd like to suggest a new time for our ${req.title} for ${req.child}: ${formatted} at ${newTime}. Please let me know if this works for you.`,
                user.id,
                user.name,
                user.avatar
              )
            }
            setSelectedRequest(null)
          }}
          extraActions={
            <>
              <Button variant="outline" className="w-full rounded-full" onClick={() => {
                handleMessage(selectedRequest.parent)
                setSelectedRequest(null)
              }}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <div className="flex items-center gap-2 w-full">
                <Button variant="outline" className="flex-1 rounded-full" onClick={() => {
                  // Decline the request - remove from list
                  setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id))
                  setSelectedRequest(null)
                }}>
                  Decline
                </Button>
                <Button className="flex-1 rounded-full" onClick={() => {
                  handleAccept(selectedRequest)
                  setSelectedRequest(null)
                }}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept
                </Button>
              </div>
            </>
          }
        />
      )}
    </div>
  )
}
