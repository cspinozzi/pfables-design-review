"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, Shield, DollarSign, QrCode, Flag, ChevronRight, CheckCircle2, Clock, AlertCircle, Music, Wrench, User, AlertTriangle, Calendar, MessageSquare, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { mockProviders, mockBackgroundChecks, mockUsers } from "@/lib/mock-data"
import { useApproval } from "@/lib/approval-context"
import { PageHeader } from "@/components/shared/page-header"

type RefundRequest = {
  id: string
  parentName: string
  parentAvatar: string
  providerName: string
  providerAvatar: string
  providerType: "teacher" | "repairer"
  service: string
  amount: number
  date: Date
  requestDate: Date
  reason: string
  details: string
}

// Mock refund requests data
const mockRefundRequests: RefundRequest[] = [
  {
    id: "ref-1",
    parentName: "Sarah Thompson",
    parentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    providerName: "Emily Carter",
    providerAvatar: "/music-teacher-woman-piano.jpg",
    providerType: "teacher",
    service: "Piano Lesson",
    amount: 65,
    date: new Date("2026-01-28"),
    requestDate: new Date("2026-02-04"),
    reason: "Service not provided",
    details: "Teacher did not show up for the scheduled lesson and did not notify us in advance.",
  },
  {
    id: "ref-2",
    parentName: "Lisa Wilson",
    parentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    providerName: "Tom's Piano Service",
    providerAvatar: "/luthier-carousel-1.jpg",
    providerType: "repairer",
    service: "Piano Tuning",
    amount: 135,
    date: new Date("2026-01-19"),
    requestDate: new Date("2026-02-02"),
    reason: "Quality issue",
    details: "The piano was not properly tuned after the service. Several keys are still out of tune and the middle C sounds wrong.",
  },
  {
    id: "ref-3",
    parentName: "Ana Martinez",
    parentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    providerName: "Michael Rodriguez",
    providerAvatar: "/guitar-teacher-man.jpg",
    providerType: "teacher",
    service: "Guitar Lessons",
    amount: 55,
    date: new Date("2026-01-15"),
    requestDate: new Date("2026-01-31"),
    reason: "Duplicate charge",
    details: "I was charged twice for the same lesson on January 15th.",
  },
]

export default function AdminDashboardPage() {
  const { isApproved } = useApproval()
  const [refundRequests, setRefundRequests] = useState(mockRefundRequests)
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const pendingVerifications = mockBackgroundChecks.filter((bg) => bg.status === "pending").length
  const parents = mockUsers.filter((u) => u.role === "parent")
  const providers = mockProviders.filter((p) => p.providerType === "teacher")
  const repairers = mockProviders.filter((p) => p.providerType === "repair")
  const pendingProviders = mockProviders.filter((p) => !isApproved(p.id, p.verified))

  const handleRefundDecision = (approved: boolean) => {
    if (!selectedRefund) return
    setIsProcessing(true)
    setTimeout(() => {
      setRefundRequests((prev) => prev.filter((r) => r.id !== selectedRefund.id))
      setSelectedRefund(null)
      setAdminNotes("")
      setIsProcessing(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        <div className="mb-10">
          <PageHeader title="Admin Dashboard" subtitle="Platform operations and management" />

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <Card className="flex flex-col items-center justify-center p-4">
              <User className="h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold">{parents.length}</p>
              <p className="text-xs text-muted-foreground">Parents</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <Music className="h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold">{providers.length}</p>
              <p className="text-xs text-muted-foreground">Providers</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <Wrench className="h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold">{repairers.length}</p>
              <p className="text-xs text-muted-foreground">Repairers</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <Shield className="h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold">{pendingVerifications}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </Card>
          </div>
        </div>

        {/* Refund Requested */}
        {refundRequests.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-medium">Refund Requested</h2>
                <Badge variant="destructive" className="text-xs">{refundRequests.length}</Badge>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                <Link href="/admin/refunds">
                  View All
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {refundRequests.slice(0, 3).map((request) => (
                <Card 
                  key={request.id} 
                  className="p-4 border-red-200 bg-red-50/30 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedRefund(request)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                      <Image src={request.parentAvatar} alt={request.parentName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{request.parentName}</h4>
                        <span className="text-xs text-muted-foreground">requested refund</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {request.service} with {request.providerName} · <span className="font-semibold text-primary">${request.amount}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[11px] bg-red-100 text-red-700 border-red-300">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {request.reason}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedRefund(request)
                        }}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pending Approvals - only shown when there are pending items */}
        {pendingProviders.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-medium">Pending Approvals ({pendingProviders.length})</h2>
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link href="/admin/verification">
                View All
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
              {pendingProviders.slice(0, 5).map((provider) => (
                <Card key={provider.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{provider.name}</h4>
                        <Badge variant="outline" className="text-[11px]">
                          {provider.providerType === "repair" ? "Repairer" : "Provider"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {provider.specialty.join(", ")} · {provider.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[11px] shrink-0">
                        {provider.backgroundCheckStatus === "pending" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {provider.backgroundCheckStatus === "none" && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {provider.backgroundCheckStatus}
                      </Badge>
                      <Button asChild size="sm" variant="outline" className="h-8 text-xs bg-transparent">
                        <Link href={`/admin/users/${provider.id}`}>Review</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
        </div>
        )}

        {/* Platform Health */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-medium mb-5">Platform Health</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{mockProviders.filter(p => p.verified).length}</p>
                <p className="text-xs text-muted-foreground mt-1">Verified Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{mockUsers.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {mockProviders.length > 0 ? ((mockProviders.filter(p => p.verified).length / mockProviders.length) * 100).toFixed(0) : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Verification Rate</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="font-display text-2xl font-medium mb-5">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            {[
              { href: "/admin/users", icon: Users, label: "Manage Users", desc: "View all parents, providers, and repairers" },
              { href: "/admin/verification", icon: Shield, label: "Review Verifications", desc: "Background check approvals" },
              { href: "/admin/payments", icon: DollarSign, label: "View Payments", desc: "Platform transactions and revenue" },
              { href: "/admin/qr-codes", icon: QrCode, label: "QR Code Manager", desc: "Generate and manage QR codes" },
              { href: "/admin/refunds", icon: Flag, label: "Handle Refunds", desc: "Review refund requests" },
            ].map((action, i) => (
              <Link key={`quick-action-${i}`} href={action.href}>
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{action.label}</h4>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Refund Review Modal */}
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
              {/* Requester Info */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Requester</p>
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
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                </div>
              </div>

              {/* Provider Info */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                  {selectedRefund.providerType === "repairer" ? "Repairer" : "Teacher"}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                      <Image src={selectedRefund.providerAvatar} alt={selectedRefund.providerName} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{selectedRefund.providerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedRefund.providerType === "repairer" ? "Repair Service" : "Music Teacher"}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
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
                  <p className="text-sm font-medium">{selectedRefund.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Request Date</p>
                  <p className="text-sm font-medium">{selectedRefund.requestDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
              </div>

              {/* Reason & Explanation */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 font-medium mb-1">Reason: {selectedRefund.reason}</p>
                <p className="text-sm text-red-900">{selectedRefund.details}</p>
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
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
