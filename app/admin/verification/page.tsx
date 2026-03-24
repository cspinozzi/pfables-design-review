"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockBackgroundChecks, mockProviders } from "@/lib/mock-data"
import { FileText, Calendar, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function AdminVerificationPage() {
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending")

  const pendingChecks = mockBackgroundChecks.filter((bg) => bg.status === "pending")
  const approvedChecks = mockBackgroundChecks.filter((bg) => bg.status === "approved")
  const rejectedChecks = mockBackgroundChecks.filter((bg) => bg.status === "rejected")

  const filters = [
    { key: "pending" as const, label: `Pending (${pendingChecks.length})` },
    { key: "approved" as const, label: `Approved (${approvedChecks.length})` },
    { key: "rejected" as const, label: `Rejected (${rejectedChecks.length})` },
  ]

  const currentChecks =
    filter === "pending" ? pendingChecks : filter === "approved" ? approvedChecks : rejectedChecks

  const renderCheckCard = (check: (typeof mockBackgroundChecks)[0]) => {
    const provider = mockProviders.find((p) => p.id === check.providerId)

    return (
      <Card key={check.id} className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={provider?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-sm">{provider?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h4 className="font-semibold text-sm truncate">{provider?.name}</h4>
              <div className="flex items-center gap-2 shrink-0">
                {check.status === "pending" && (
                  <>
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">Reject</Button>
                    <Button size="sm" className="h-7 text-xs">Approve</Button>
                  </>
                )}
                <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                  <Link href={`/admin/users/${provider?.userId || check.providerId}`}>Review</Link>
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{provider?.specialty.join(", ")}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 pt-2 border-t text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Submitted {formatDistanceToNow(check.submittedDate, { addSuffix: true })}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {check.documents.length} documents
              </span>
            </div>
            {check.status === "approved" && check.reviewedDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Approved {formatDistanceToNow(check.reviewedDate, { addSuffix: true })}
              </p>
            )}
            {check.notes && (
              <p className="text-xs text-muted-foreground mt-1 italic">{check.notes}</p>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground">Background Check Verification</h1>
          <p className="text-sm text-muted-foreground">Review and approve provider background checks</p>
        </div>

        {/* Filter Pills */}
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

        {/* Checks List */}
        {currentChecks.length > 0 ? (
          <div className="space-y-3">
            {currentChecks.map(renderCheckCard)}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-sm text-foreground mb-1">No {filter} verifications</h3>
            <p className="text-xs text-muted-foreground">
              {filter === "pending"
                ? "All caught up - no pending verifications at this time"
                : filter === "approved"
                  ? "No approved verifications yet"
                  : "No rejected verifications"}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
