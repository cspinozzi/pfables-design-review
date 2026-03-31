"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { ServiceCard } from "@/components/service-card"
const ServiceDetailModal = dynamic(() => import("@/components/service-detail-modal").then(m => ({ default: m.ServiceDetailModal })), { ssr: false })
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Clock, AlertCircle, Landmark, Plus, Calendar, User, Wrench } from "lucide-react"
import { PayoutMethodModal } from "@/components/payout-method-modal"

type Payment = {
  id: string
  client: string
  clientAvatar: string
  service: string
  instrument: string
  amount: number
  date: Date
  status: "waiting" | "done" | "requested" | "refunded"
}

export default function RepairerPaymentsPage() {
  const [filter, setFilter] = useState<"waiting" | "done" | "refunded">("waiting")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [payoutModalOpen, setPayoutModalOpen] = useState(false)
  const [editingPayout, setEditingPayout] = useState<typeof payoutMethods[0] | null>(null)

  const [payoutMethods, setPayoutMethods] = useState([
    { id: "payout-1", bankName: "Bank of America", last4: "3456", accountType: "Checking", isDefault: true },
  ])

  const [payments, setPayments] = useState([
    {
      id: "pay-1",
      client: "Sarah Thompson",
      clientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      service: "Violin Bridge Replacement",
      instrument: "1920 German Violin",
      amount: 180,
      date: new Date("2026-02-03"),
      status: "done" as const,
    },
    {
      id: "pay-2",
      client: "James Park",
      clientAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      service: "Bow Rehair",
      instrument: "Cello Bow",
      amount: 85,
      date: new Date("2026-02-03"),
      status: "waiting" as const,
    },
    {
      id: "pay-3",
      client: "Maria Santos",
      clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      service: "Soundpost Adjustment",
      instrument: "Viola",
      amount: 60,
      date: new Date("2026-01-31"),
      status: "done" as const,
    },
    {
      id: "pay-4",
      client: "David Lee",
      clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      service: "Full Setup & Adjustment",
      instrument: "Student Violin",
      amount: 120,
      date: new Date("2026-01-27"),
      status: "done" as const,
    },
    {
      id: "pay-5",
      client: "Anna Chen",
      clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      service: "Crack Repair & Varnish",
      instrument: "French Cello",
      amount: 450,
      date: new Date("2026-01-27"),
      status: "waiting" as const,
    },
    {
      id: "pay-6",
      client: "Sarah Thompson",
      clientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      service: "Bow Rehair",
      instrument: "Violin Bow",
      amount: 75,
      date: new Date("2026-01-24"),
      status: "refunded" as const,
    },
    {
      id: "pay-7",
      client: "Robert Johnson",
      clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      service: "String Replacement",
      instrument: "Classical Guitar",
      amount: 45,
      date: new Date("2026-01-29"),
      status: "requested" as const,
    },
  ])

  const handlePaymentStatusChange = (id: string, newStatus: "waiting" | "done" | "requested" | "refunded") => {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus } : p))
    if (selectedPayment?.id === id) {
      setSelectedPayment((prev) => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const handleSavePayout = (method: { id: string; bankName: string; last4: string; accountType: string; isDefault: boolean }) => {
    setPayoutMethods((prev) => {
      const exists = prev.find((m) => m.id === method.id)
      if (exists) {
        return prev.map((m) => 
          m.id === method.id 
            ? { ...m, ...method }
            : method.isDefault ? { ...m, isDefault: false } : m
        )
      } else {
        const newMethods = method.isDefault 
          ? prev.map((m) => ({ ...m, isDefault: false }))
          : prev
        return [...newMethods, method]
      }
    })
    setEditingPayout(null)
    setPayoutModalOpen(false)
  }

  const handleDeletePayout = (id: string) => {
    setPayoutMethods((prev) => prev.filter((m) => m.id !== id))
    setEditingPayout(null)
    setPayoutModalOpen(false)
  }

  const waiting = payments.filter((p) => p.status === "waiting")
  const done = payments.filter((p) => p.status === "done")
  const refundRelated = payments.filter((p) => p.status === "requested" || p.status === "refunded")
  const totalWaiting = waiting.reduce((sum, p) => sum + p.amount, 0)
  const totalDone = done.reduce((sum, p) => sum + p.amount, 0)

  const filteredPayments = filter === "refunded" 
    ? payments.filter((p) => p.status === "requested" || p.status === "refunded")
    : payments.filter((p) => p.status === filter)

  const filters = [
    { key: "waiting" as const, label: `Waiting Payment (${waiting.length})` },
    { key: "done" as const, label: `Done (${done.length})` },
    { key: "refunded" as const, label: `Refunded (${refundRelated.length})` },
  ]

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-12">
      <div className="page-container pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">Track received payments and pending balances</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Done</p>
                <p className="text-2xl font-bold">${totalDone.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Waiting Payment</p>
                <p className="text-2xl font-bold">${totalWaiting.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  ${payments
                    .filter(
                      (p) =>
                        p.date.getMonth() === new Date().getMonth() &&
                        p.date.getFullYear() === new Date().getFullYear()
                    )
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payout Method */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Payout Method</h2>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-2 bg-transparent"
              onClick={() => {
                setEditingPayout(null)
                setPayoutModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Account</span>
            </Button>
          </div>

          <div className="space-y-3">
            {payoutMethods.map((method) => (
              <Card key={method.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Landmark className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{method.bankName} •••• {method.last4}</p>
                        {method.isDefault && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.accountType} Account</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground"
                    onClick={() => {
                      setEditingPayout(method)
                      setPayoutModalOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Payments are deposited to your account within 3-5 business days after repair completion and client pickup.
          </p>
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

        {/* Payments List */}
        {filteredPayments.length > 0 ? (
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <ServiceCard
                key={payment.id}
                image={payment.clientAvatar}
                imageAlt={payment.client}
                title={payment.service}
                subtitle={`${payment.client} - ${payment.instrument}`}
                status={payment.status}
                onClick={() => setSelectedPayment(payment)}
                details={
                  <>
                    <span>
                      {payment.date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="font-semibold">${payment.amount}</span>
                  </>
                }
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-1">No payments found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "waiting"
                ? "No repairs awaiting payment"
                : filter === "refunded"
                ? "No refunded payments"
                : "Your payment history will appear here"}
            </p>
          </Card>
        )}

        {selectedPayment && (
          <ServiceDetailModal
            open={!!selectedPayment}
            onClose={() => setSelectedPayment(null)}
            title={selectedPayment.service}
            subtitle={`${selectedPayment.client} - ${selectedPayment.instrument}`}
            status={selectedPayment.status}
            onStatusChange={(s) => handlePaymentStatusChange(selectedPayment.id, s as "waiting" | "done" | "requested" | "refunded")}
            people={[
              { name: selectedPayment.client, role: "Customer", avatar: selectedPayment.clientAvatar },
            ]}
            fields={[
              { icon: <Wrench className="h-4 w-4" />, label: "Instrument", value: selectedPayment.instrument },
              { icon: <Calendar className="h-4 w-4" />, label: "Date", value: selectedPayment.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) },
              { icon: <DollarSign className="h-4 w-4" />, label: "Amount", value: `$${selectedPayment.amount}` },
            ]}
            price={`$${selectedPayment.amount}`}
          />
        )}

        {/* Waiting Payment Alert */}
        {waiting.length > 0 && filter === "waiting" && (
          <Card className="mt-6 p-4 border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {waiting.length} repair{waiting.length > 1 ? "s" : ""} awaiting payment (${totalWaiting})
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Payments are typically processed within 3-5 business days after the client pays.
                </p>
              </div>
            </div>
          </Card>
        )}

        <PayoutMethodModal
          open={payoutModalOpen}
          onClose={() => {
            setPayoutModalOpen(false)
            setEditingPayout(null)
          }}
          onSave={handleSavePayout}
          onDelete={handleDeletePayout}
          method={editingPayout}
        />
      </div>
    </div>
  )
}
