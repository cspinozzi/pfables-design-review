"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  X,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertCircle,
} from "lucide-react"

interface ChatProfilePanelProps {
  participant: {
    id: string
    name: string
    avatar: string
    role: string
  }
  onClose: () => void
}

// Mock data for lessons associated with this contact
function getMockLessons(participantId: string) {
  const now = new Date()
  const lessons = [
    {
      id: "l1",
      title: "Piano - Beginner",
      date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3),
      status: "upcoming" as const,
      duration: "60 min",
    },
    {
      id: "l2",
      title: "Piano - Scales Practice",
      date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10),
      status: "upcoming" as const,
      duration: "45 min",
    },
    {
      id: "l3",
      title: "Piano - Introduction",
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7),
      status: "completed" as const,
      duration: "60 min",
    },
    {
      id: "l4",
      title: "Piano - Music Theory",
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14),
      status: "completed" as const,
      duration: "60 min",
    },
    {
      id: "l5",
      title: "Piano - Rhythm Basics",
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 21),
      status: "completed" as const,
      duration: "45 min",
    },
    {
      id: "l6",
      title: "Piano - Sight Reading",
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
      status: "cancelled" as const,
      duration: "60 min",
    },
  ]

  // Vary lessons slightly for different participants
  if (participantId.includes("2") || participantId.includes("3")) {
    return lessons
  }
  return lessons.slice(0, 4)
}

function getMockPayments(participantId: string) {
  const now = new Date()
  return [
    {
      id: "p1",
      amount: 75,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7),
      status: "completed" as const,
      description: "Piano lesson - Nov 28",
    },
    {
      id: "p2",
      amount: 75,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14),
      status: "completed" as const,
      description: "Piano lesson - Nov 21",
    },
    {
      id: "p3",
      amount: 60,
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 21),
      status: "completed" as const,
      description: "Piano lesson - Nov 14",
    },
    {
      id: "p4",
      amount: 75,
      date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3),
      status: "pending" as const,
      description: "Piano lesson - Dec 8",
    },
    {
      id: "p5",
      amount: 50,
      date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10),
      status: "pending" as const,
      description: "Piano lesson - Dec 15",
    },
  ]
}

export function ChatProfilePanel({ participant, onClose }: ChatProfilePanelProps) {
  const [activeTab, setActiveTab] = useState<"lessons" | "payments">("lessons")
  const lessons = getMockLessons(participant.id)
  const payments = getMockPayments(participant.id)

  const upcomingLessons = lessons.filter((l) => l.status === "upcoming")
  const completedLessons = lessons.filter((l) => l.status === "completed")
  const cancelledLessons = lessons.filter((l) => l.status === "cancelled")

  const pendingPayments = payments.filter((p) => p.status === "pending")
  const completedPayments = payments.filter((p) => p.status === "completed")

  const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="w-full lg:w-80 xl:w-96 border-l bg-background flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-sm">Profile</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile info */}
      <div className="p-5 flex flex-col items-center text-center border-b flex-shrink-0">
        <Avatar className="h-16 w-16 mb-3">
          <AvatarImage src={participant.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-lg">{participant.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h4 className="font-semibold text-base">{participant.name}</h4>
        <Badge variant="outline" className="mt-1.5 capitalize text-xs">
          {participant.role}
        </Badge>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 border-b flex-shrink-0">
        <div className="p-3 text-center border-r">
          <p className="text-lg font-semibold">{upcomingLessons.length}</p>
          <p className="text-[10px] text-muted-foreground leading-tight">Upcoming</p>
        </div>
        <div className="p-3 text-center border-r">
          <p className="text-lg font-semibold">{completedLessons.length}</p>
          <p className="text-[10px] text-muted-foreground leading-tight">Completed</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-semibold">{cancelledLessons.length}</p>
          <p className="text-[10px] text-muted-foreground leading-tight">Cancelled</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b flex-shrink-0">
        <button
          onClick={() => setActiveTab("lessons")}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            activeTab === "lessons"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Lessons
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            activeTab === "payments"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Payments
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "lessons" ? (
          <div className="space-y-4">
            {/* Upcoming */}
            {upcomingLessons.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Upcoming ({upcomingLessons.length})
                </p>
                <div className="space-y-2">
                  {upcomingLessons.map((lesson) => (
                    <Card key={lesson.id} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {lesson.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0 bg-blue-50 text-blue-700 border-blue-200">
                          {lesson.duration}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedLessons.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3" />
                  Completed ({completedLessons.length})
                </p>
                <div className="space-y-2">
                  {completedLessons.map((lesson) => (
                    <Card key={lesson.id} className="p-3 opacity-80">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {lesson.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0 bg-green-50 text-green-700 border-green-200">
                          Done
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled */}
            {cancelledLessons.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <XCircle className="h-3 w-3" />
                  Cancelled ({cancelledLessons.length})
                </p>
                <div className="space-y-2">
                  {cancelledLessons.map((lesson) => (
                    <Card key={lesson.id} className="p-3 opacity-60">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate line-through">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {lesson.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0 bg-red-50 text-red-700 border-red-200">
                          Cancelled
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Payment summary */}
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                <p className="text-base font-semibold text-green-700">${totalPaid}</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Pending</p>
                <p className="text-base font-semibold text-amber-700">${totalPending}</p>
              </Card>
            </div>

            {/* Pending */}
            {pendingPayments.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3" />
                  Pending ({pendingPayments.length})
                </p>
                <div className="space-y-2">
                  {pendingPayments.map((payment) => (
                    <Card key={payment.id} className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{payment.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {payment.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-amber-700">${payment.amount}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedPayments.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3" />
                  Completed ({completedPayments.length})
                </p>
                <div className="space-y-2">
                  {completedPayments.map((payment) => (
                    <Card key={payment.id} className="p-3 opacity-80">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{payment.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {payment.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-green-700">${payment.amount}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
