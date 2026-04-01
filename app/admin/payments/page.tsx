"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { mockProviders, mockSubscriptions, mockUsers } from "@/lib/mock-data"
import { DollarSign, TrendingUp, Music, Wrench, AlertTriangle, Calendar, User, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"

type RefundRequest = {
  id: string
  parentName: string
  parentAvatar: string
  providerName: string
  providerAvatar: string
  service: string
  amount: number
  date: Date
  reason: string
  details: string
  status: "pending" | "approved" | "denied"
}

const mockRefundRequests: RefundRequest[] = [
  {
    id: "ref-1",
    parentName: "Sarah Thompson",
    parentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    providerName: "Emily Carter",
    providerAvatar: "/music-teacher-woman-piano.jpg",
    service: "Piano Lesson",
    amount: 65,
    date: new Date("2026-01-28"),
    reason: "Service not provided",
    details: "Teacher did not show up for the scheduled lesson and did not notify us in advance.",
    status: "pending",
  },
  {
    id: "ref-2",
    parentName: "Lisa Wilson",
    parentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    providerName: "Tom's Piano Service",
    providerAvatar: "/luthier-carousel-1.jpg",
    service: "Piano Tuning",
    amount: 135,
    date: new Date("2026-01-20"),
    reason: "Quality issue",
    details: "The piano was not properly tuned after the service. Several keys are still out of tune.",
    status: "pending",
  },
  {
    id: "ref-3",
    parentName: "Ana Martinez",
    parentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    providerName: "Michael Rodriguez",
    providerAvatar: "/guitar-teacher-man.jpg",
    service: "Guitar Lessons",
    amount: 55,
    date: new Date("2026-01-15"),
    reason: "Duplicate charge",
    details: "I was charged twice for the same lesson on January 15th.",
    status: "pending",
  },
]

export default function AdminPaymentsPage() {
  const [refundRequests, setRefundRequests] = useState(mockRefundRequests)
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const pendingRefunds = refundRequests.filter((r) => r.status === "pending")

  const handleRefundDecision = (approved: boolean) => {
    if (!selectedRefund) return
    setIsProcessing(true)
    setTimeout(() => {
      setRefundRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRefund.id ? { ...r, status: approved ? "approved" : "denied" } : r
        )
      )
      setSelectedRefund(null)
      setAdminNotes("")
      setIsProcessing(false)
    }, 500)
  }

  const totalRevenue = mockSubscriptions.reduce((sum, sub) => sum + sub.price, 0)
  const activeSubscriptions = mockSubscriptions.filter((sub) => sub.status === "active").length
  const providerSubs = mockSubscriptions.filter((sub) => {
    const provider = mockProviders.find((p) => p.id === sub.providerId)
    return provider?.providerType === "teacher"
  })
  const repairerSubs = mockSubscriptions.filter((sub) => {
    const provider = mockProviders.find((p) => p.id === sub.providerId)
    return provider?.providerType === "repair"
  })

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium">Payment Management</h1>
          <p className="text-sm text-muted-foreground">Track subscriptions and revenue across all user types</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <Card className="flex flex-col items-center justify-center p-4">
            <DollarSign className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">${totalRevenue}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4">
            <TrendingUp className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{activeSubscriptions}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4">
            <Music className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{providerSubs.length}</p>
            <p className="text-xs text-muted-foreground">Provider Subs</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4">
            <Wrench className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{repairerSubs.length}</p>
            <p className="text-xs text-muted-foreground">Repairer Subs</p>
          </Card>
        </div>

        {/* Refund Requests */}
        {pendingRefunds.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="font-display text-2xl font-medium">Refund Requested</h2>
              <Badge variant="destructive" className="text-xs">{pendingRefunds.length}</Badge>
            </div>
            <div className="space-y-3">
              {pendingRefunds.map((request) => (
                <Card
                  key={request.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow border-amber-200 bg-amber-50/30"
                  onClick={() => setSelectedRefund(request)}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0">
                      <Image src={request.parentAvatar} alt={request.parentName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{request.parentName}</h4>
                        <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Pending Review
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {request.service} with {request.providerName}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">${request.amount}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {request.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <span className="text-amber-700">{request.reason}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active Subscriptions */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-medium mb-5">Active Subscriptions</h2>
          <div className="space-y-3">
            {mockSubscriptions.map((subscription) => {
              const provider = mockProviders.find((p) => p.id === subscription.providerId)
              return (
                <Card key={subscription.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-sm">{provider?.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {provider?.providerType === "repair" ? "Repairer" : "Provider"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{subscription.tier}</Badge>
                        <span>${subscription.price}/mo</span>
                        <span>Next: {subscription.nextBillingDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge
                      className="text-xs shrink-0"
                      variant={subscription.status === "active" ? "default" : "secondary"}
                    >
                      {subscription.status}
                    </Badge>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Revenue by Plan */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-medium mb-5">Revenue by Plan</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{mockProviders.filter((p) => p.subscriptionTier === "basic").length}</p>
              <p className="text-xs text-muted-foreground mt-1">Basic Plan</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{mockProviders.filter((p) => p.subscriptionTier === "featured").length}</p>
              <p className="text-xs text-muted-foreground mt-1">Featured Plan</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{mockProviders.filter((p) => p.subscriptionTier === "premium").length}</p>
              <p className="text-xs text-muted-foreground mt-1">Premium Plan</p>
            </Card>
          </div>
        </div>

        {/* Revenue by User Type */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-medium mb-5">Revenue by User Type</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <Music className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${providerSubs.reduce((sum, s) => sum + s.price, 0)}/mo</p>
                  <p className="text-xs text-muted-foreground">Providers</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${repairerSubs.reduce((sum, s) => sum + s.price, 0)}/mo</p>
                  <p className="text-xs text-muted-foreground">Repairers</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Refund Decision Modal */}
      <Dialog open={!!selectedRefund} onOpenChange={() => setSelectedRefund(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Refund Request</DialogTitle>
            <DialogDescription>
              Review the details and decide whether to approve or deny this refund.
            </DialogDescription>
          </DialogHeader>

          {selectedRefund && (
            <div className="space-y-4">
              {/* Request Info */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                    <Image src={selectedRefund.parentAvatar} alt={selectedRefund.parentName} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selectedRefund.parentName}</p>
                    <p className="text-xs text-muted-foreground">Requested refund</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                    <Image src={selectedRefund.providerAvatar} alt={selectedRefund.providerName} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selectedRefund.providerName}</p>
                    <p className="text-xs text-muted-foreground">Service provider</p>
                  </div>
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
                  <p className="text-xs text-muted-foreground mb-0.5">Date</p>
                  <p className="text-sm font-medium">{selectedRefund.date.toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Reason</p>
                  <p className="text-sm font-medium">{selectedRefund.reason}</p>
                </div>
              </div>

              {/* Parent's Explanation */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 font-medium mb-1">Parent's Explanation</p>
                <p className="text-sm text-amber-900">{selectedRefund.details}</p>
              </div>

              {/* Admin Notes */}
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
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => handleRefundDecision(false)}
              disabled={isProcessing}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Deny Refund
            </Button>
            <Button
              className="flex-1 rounded-full"
              onClick={() => handleRefundDecision(true)}
              disabled={isProcessing}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
