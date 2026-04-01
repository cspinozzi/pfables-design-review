"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  MessageSquare,
  User,
  Music,
  Wrench
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type RefundRequest = {
  id: string
  parentName: string
  parentAvatar: string
  parentId: string
  providerName: string
  providerAvatar: string
  providerId: string
  providerType: "teacher" | "repairer"
  service: string
  amount: number
  requestDate: Date
  serviceDate: Date
  reason: string
  details: string
  status: "pending" | "approved" | "denied"
}

const mockRefundRequests: RefundRequest[] = [
  {
    id: "ref-1",
    parentName: "Sarah Thompson",
    parentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    parentId: "parent-1",
    providerName: "Emily Carter",
    providerAvatar: "/music-teacher-woman-piano.jpg",
    providerId: "provider-1",
    providerType: "teacher",
    service: "Piano Lesson",
    amount: 65,
    requestDate: new Date("2026-02-05"),
    serviceDate: new Date("2026-01-28"),
    reason: "Service not provided",
    details: "Teacher did not show up for the scheduled lesson and did not notify us in advance. We waited for 30 minutes before leaving.",
    status: "pending",
  },
  {
    id: "ref-2",
    parentName: "Lisa Wilson",
    parentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    parentId: "parent-2",
    providerName: "Tom's Piano Service",
    providerAvatar: "/luthier-carousel-1.jpg",
    providerId: "repairer-1",
    providerType: "repairer",
    service: "Piano Tuning",
    amount: 135,
    requestDate: new Date("2026-02-03"),
    serviceDate: new Date("2026-01-20"),
    reason: "Quality issue",
    details: "The piano was not properly tuned after the service. Several keys are still out of tune and the middle C sounds wrong.",
    status: "pending",
  },
  {
    id: "ref-3",
    parentName: "Ana Martinez",
    parentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    parentId: "parent-3",
    providerName: "Michael Rodriguez",
    providerAvatar: "/guitar-teacher-man.jpg",
    providerId: "provider-2",
    providerType: "teacher",
    service: "Guitar Lessons",
    amount: 55,
    requestDate: new Date("2026-02-01"),
    serviceDate: new Date("2026-01-15"),
    reason: "Duplicate charge",
    details: "I was charged twice for the same lesson on January 15th. Please refund the duplicate charge.",
    status: "pending",
  },
  {
    id: "ref-4",
    parentName: "David Lee",
    parentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    parentId: "parent-4",
    providerName: "Heritage String Repair",
    providerAvatar: "/luthier-carousel-2.jpg",
    providerId: "repairer-2",
    providerType: "repairer",
    service: "Violin Bridge Replacement",
    amount: 180,
    requestDate: new Date("2026-01-28"),
    serviceDate: new Date("2026-01-10"),
    reason: "Service not completed",
    details: "The bridge was replaced but the sound post was knocked over during the repair. The violin is now unplayable.",
    status: "approved",
  },
  {
    id: "ref-5",
    parentName: "Jennifer Wilson",
    parentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    parentId: "parent-5",
    providerName: "Amanda Martinez",
    providerAvatar: "/music-teacher-woman-violin.jpg",
    providerId: "provider-3",
    providerType: "teacher",
    service: "Violin Lesson",
    amount: 70,
    requestDate: new Date("2026-01-25"),
    serviceDate: new Date("2026-01-18"),
    reason: "Changed mind",
    details: "We decided to cancel after booking but the lesson was already charged.",
    status: "denied",
  },
]

export default function AdminRefundsPage() {
  const [refundRequests, setRefundRequests] = useState(mockRefundRequests)
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [filter, setFilter] = useState<"pending" | "approved" | "denied">("pending")

  const pending = refundRequests.filter((r) => r.status === "pending")
  const approved = refundRequests.filter((r) => r.status === "approved")
  const denied = refundRequests.filter((r) => r.status === "denied")
  
  const filteredRequests = refundRequests.filter((r) => r.status === filter)
  const totalPendingAmount = pending.reduce((sum, r) => sum + r.amount, 0)

  const handleRefundDecision = (decision: "approved" | "denied") => {
    if (!selectedRefund) return
    setIsProcessing(true)
    setTimeout(() => {
      setRefundRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRefund.id ? { ...r, status: decision } : r
        )
      )
      setSelectedRefund(null)
      setAdminNotes("")
      setIsProcessing(false)
    }, 500)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const filters = [
    { key: "pending" as const, label: `Pending (${pending.length})` },
    { key: "approved" as const, label: `Approved (${approved.length})` },
    { key: "denied" as const, label: `Denied (${denied.length})` },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-medium mb-2">Refund Management</h1>
          <p className="text-muted-foreground">Review and process refund requests from parents</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pending.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold">${totalPendingAmount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approved.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Refund Requests List */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CheckCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">No {filter} refund requests</p>
                <p className="text-sm text-muted-foreground">
                  {filter === "pending" 
                    ? "All refund requests have been processed" 
                    : `No refund requests have been ${filter} yet`}
                </p>
              </div>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card
                key={request.id}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  request.status === "pending" ? "border-amber-200 bg-amber-50/30" : ""
                }`}
                onClick={() => setSelectedRefund(request)}
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0">
                    <Image src={request.parentAvatar} alt={request.parentName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{request.parentName}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          request.status === "pending" 
                            ? "bg-amber-100 text-amber-700 border-amber-300"
                            : request.status === "approved"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-red-100 text-red-700 border-red-300"
                        }`}
                      >
                        {request.status === "pending" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {request.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {request.status === "denied" && <XCircle className="h-3 w-3 mr-1" />}
                        {request.status === "pending" ? "Pending Review" : request.status === "approved" ? "Approved" : "Denied"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {request.service} with {request.providerName}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">${request.amount}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(request.requestDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        {request.providerType === "teacher" ? (
                          <Music className="h-3 w-3" />
                        ) : (
                          <Wrench className="h-3 w-3" />
                        )}
                        {request.providerType === "teacher" ? "Teacher" : "Repairer"}
                      </span>
                      <span className="text-amber-700">{request.reason}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Refund Decision Modal */}
      <Dialog open={!!selectedRefund} onOpenChange={() => setSelectedRefund(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Refund Request</DialogTitle>
            <DialogDescription>
              Review the details and decide whether to approve or deny this refund.
            </DialogDescription>
          </DialogHeader>

          {selectedRefund && (
            <div className="space-y-4">
              {/* Parent Info */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2 font-medium">REQUESTER</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                      <Image src={selectedRefund.parentAvatar} alt={selectedRefund.parentName} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{selectedRefund.parentName}</p>
                      <p className="text-xs text-muted-foreground">Parent</p>
                    </div>
                  </div>
                  <Link href={`/admin/messages?user=${selectedRefund.parentId}`}>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Provider Info */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  {selectedRefund.providerType === "teacher" ? "TEACHER" : "REPAIRER"}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                      <Image src={selectedRefund.providerAvatar} alt={selectedRefund.providerName} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{selectedRefund.providerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedRefund.providerType === "teacher" ? "Music Teacher" : "Repair Service"}
                      </p>
                    </div>
                  </div>
                  <Link href={`/admin/messages?provider=${selectedRefund.providerId}`}>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Service</p>
                  <p className="text-sm font-medium">{selectedRefund.service}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Amount</p>
                  <p className="text-sm font-bold text-primary">${selectedRefund.amount}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Service Date</p>
                  <p className="text-sm font-medium">{formatDate(selectedRefund.serviceDate)}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Request Date</p>
                  <p className="text-sm font-medium">{formatDate(selectedRefund.requestDate)}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 font-medium mb-1">Reason: {selectedRefund.reason}</p>
                <p className="text-sm text-amber-900">{selectedRefund.details}</p>
              </div>

              {/* Admin Notes */}
              {selectedRefund.status === "pending" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Admin Notes (optional)</label>
                  <Textarea
                    placeholder="Add notes about your decision..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
              )}

              {/* Status Badge for processed requests */}
              {selectedRefund.status !== "pending" && (
                <div className={`p-3 rounded-lg ${
                  selectedRefund.status === "approved" 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-red-50 border border-red-200"
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedRefund.status === "approved" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <p className={`font-medium ${
                      selectedRefund.status === "approved" ? "text-green-700" : "text-red-700"
                    }`}>
                      This refund has been {selectedRefund.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedRefund?.status === "pending" && (
            <DialogFooter className="flex gap-2 sm:gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => handleRefundDecision("denied")}
                disabled={isProcessing}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Deny Refund
              </Button>
              <Button
                className="flex-1 rounded-full"
                onClick={() => handleRefundDecision("approved")}
                disabled={isProcessing}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Refund
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
