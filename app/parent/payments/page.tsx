"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { ServiceCard } from "@/components/service-card"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus, TrendingUp, DollarSign, AlertCircle, CheckCircle2, Calendar, User, AlertTriangle } from "lucide-react"

const ServiceDetailModal = dynamic(() => import("@/components/service-detail-modal").then(m => ({ default: m.ServiceDetailModal })), { ssr: false })
const PaymentModal = dynamic(() => import("@/components/payment-modal").then(m => ({ default: m.PaymentModal })), { ssr: false })
const CardModal = dynamic(() => import("@/components/card-modal").then(m => ({ default: m.CardModal })), { ssr: false })
const RefundModal = dynamic(() => import("@/components/refund-modal").then(m => ({ default: m.RefundModal })), { ssr: false })
import { mockServiceContracts } from "@/lib/mock-data"

type Transaction = {
  id: string
  provider: string
  providerAvatar: string
  service: string
  amount: number
  date: Date
  status: "topay" | "paid" | "requested" | "refunded"
  student: string
}

export default function ParentPaymentsPage() {
  const [filter, setFilter] = useState<"topay" | "paid" | "refund">("topay")
  // "refund" filter shows both requested and refunded statuses
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [payingTx, setPayingTx] = useState<Transaction | null>(null)
  const [cardModalOpen, setCardModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<typeof paymentMethods[0] | null>(null)
  const [refundingTx, setRefundingTx] = useState<Transaction | null>(null)

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "pm-1",
      type: "Visa",
      last4: "4242",
      expiry: "12/26",
      isDefault: true,
    },
  ])

  const [transactions, setTransactions] = useState([
    {
      id: "tx-1",
      provider: "Emily Carter",
      providerAvatar: "/music-teacher-woman-piano.jpg",
      service: "Piano Lessons",
      amount: 65,
      date: new Date("2025-01-10"),
      status: "paid" as const,
      student: "Emma",
    },
    {
      id: "tx-2",
      provider: "Michael Rodriguez",
      providerAvatar: "/guitar-teacher-man.jpg",
      service: "Guitar Lessons",
      amount: 55,
      date: new Date("2025-01-05"),
      status: "topay" as const,
      student: "Jake",
    },
    {
      id: "tx-3",
      provider: "Tom's Piano Service",
      providerAvatar: "/luthier-carousel-1.jpg",
      service: "Piano Tuning",
      amount: 135,
      date: new Date("2024-12-28"),
      status: "paid" as const,
      student: "",
    },
    {
      id: "tx-4",
      provider: "Emily Carter",
      providerAvatar: "/music-teacher-woman-piano.jpg",
      service: "Piano Lessons",
      amount: 65,
      date: new Date("2025-01-17"),
      status: "paid" as const,
      student: "Emma",
    },
    {
      id: "tx-5",
      provider: "Michael Rodriguez",
      providerAvatar: "/guitar-teacher-man.jpg",
      service: "Guitar Lessons",
      amount: 55,
      date: new Date("2025-01-19"),
      status: "topay" as const,
      student: "Jake",
    },
    {
      id: "tx-6",
      provider: "Emily Carter",
      providerAvatar: "/music-teacher-woman-piano.jpg",
      service: "Piano Lessons",
      amount: 65,
      date: new Date("2025-01-24"),
      status: "paid" as const,
      student: "Emma",
    },
    {
      id: "tx-7",
      provider: "Emily Carter",
      providerAvatar: "/music-teacher-woman-piano.jpg",
      service: "Piano Lesson",
      amount: 65,
      date: new Date("2025-01-27"),
      status: "paid" as const,
      student: "Emma",
    },
    {
      id: "tx-8",
      provider: "Tom's Piano Service",
      providerAvatar: "/luthier-carousel-1.jpg",
      service: "Piano Tuning",
      amount: 135,
      date: new Date("2024-12-26"),
      status: "refunded" as const,
      student: "",
    },
    {
      id: "tx-9",
      provider: "Marcus Rivera",
      providerAvatar: "/luthier-carousel-1.jpg",
      service: "Drum Lesson",
      amount: 45,
      date: new Date("2025-01-14"),
      status: "requested" as const,
      student: "Jake",
    },
  ])

  const handlePay = (tx: Transaction) => {
    setPayingTx(tx)
  }

  const handlePaymentSuccess = (id: string) => {
    handleTransactionStatusChange(id, "paid")
    setPayingTx(null)
  }

  const handleSaveCard = (card: { id: string; type: string; last4: string; expiry: string; isDefault: boolean }) => {
    setPaymentMethods((prev) => {
      const exists = prev.find((m) => m.id === card.id)
      if (exists) {
        // Update existing card
        return prev.map((m) => 
          m.id === card.id 
            ? { ...m, ...card }
            : card.isDefault ? { ...m, isDefault: false } : m
        )
      } else {
        // Add new card
        const newMethods = card.isDefault 
          ? prev.map((m) => ({ ...m, isDefault: false }))
          : prev
        return [...newMethods, card]
      }
    })
    setEditingCard(null)
    setCardModalOpen(false)
  }

  const handleDeleteCard = (id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id))
    setEditingCard(null)
    setCardModalOpen(false)
  }

  const handleTransactionStatusChange = (id: string, newStatus: "topay" | "paid" | "requested" | "refunded") => {
    setTransactions((prev) => prev.map((t) => t.id === id ? { ...t, status: newStatus } : t))
    if (selectedTx?.id === id) {
      setSelectedTx((prev) => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const contracts = mockServiceContracts.filter((c) => c.parentId === "user-1")
  const activeContracts = contracts.filter((c) => c.status === "active")
  const totalSpent = contracts.reduce((sum, c) => sum + c.totalPaid, 0)
  const topay = transactions.filter((t) => t.status === "topay")
  const paid = transactions.filter((t) => t.status === "paid")
  const refund = transactions.filter((t) => t.status === "requested" || t.status === "refunded")
  const totalToPay = topay.reduce((sum, t) => sum + t.amount, 0)

  const filteredTransactions = filter === "refund" 
    ? transactions.filter((t) => t.status === "requested" || t.status === "refunded")
    : transactions.filter((t) => t.status === filter)

  const filters = [
    { key: "topay" as const, label: `To Pay (${topay.length})` },
    { key: "paid" as const, label: `Paid (${paid.length})` },
    { key: "refund" as const, label: `Refund (${refund.length})` },
  ]

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-12">
      <div className="page-container pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">Manage payment methods and transactions</p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Services</p>
                <p className="text-2xl font-bold">{activeContracts.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Payment Methods</h2>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-2 bg-transparent"
              onClick={() => {
                setEditingCard(null)
                setCardModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Card</span>
            </Button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {method.type} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditingCard(method)
                      setCardModalOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Payments are processed securely through our platform. Teachers receive payment after service completion.
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

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <ServiceCard
                key={tx.id}
                image={tx.providerAvatar}
                imageAlt={tx.provider}
                title={tx.service}
                subtitle={tx.provider}
                price={`$${tx.amount}`}
                priceClassName={
                  tx.status === "paid" || tx.status === "requested" || tx.status === "refunded" ? "text-muted-foreground" : "text-primary"
                }
                status={tx.status}
                onClick={() => setSelectedTx(tx)}
                details={
                  <>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {tx.provider}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {tx.date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {tx.student && <span>{tx.student}</span>}
                  </>
                }
                footer={tx.status === "topay" ? (
                  <div className="flex items-center justify-end px-4 sm:px-6 py-3 bg-primary rounded-b-xl">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full px-5 font-semibold"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePay(tx)
                      }}
                    >
                      Pay Now
                    </Button>
                  </div>
                ) : undefined}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-1">No transactions found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "topay"
                ? "No unpaid services at the moment"
                : filter === "refund"
                ? "No refund requests"
                : "Your payment history will appear here"}
            </p>
          </Card>
        )}

        {selectedTx && (
          <ServiceDetailModal
            open={!!selectedTx}
            onClose={() => setSelectedTx(null)}
            title={selectedTx.service}
            subtitle={selectedTx.provider}
            status={selectedTx.status}
            onStatusChange={(s) => handleTransactionStatusChange(selectedTx.id, s as "topay" | "paid" | "requested" | "refunded")}
            people={[
              { name: selectedTx.provider, role: "Provider", avatar: selectedTx.providerAvatar },
              ...(selectedTx.student ? [{ name: selectedTx.student, role: "Student" }] : []),
            ]}
            fields={[
              { icon: <Calendar className="h-4 w-4" />, label: "Date", value: selectedTx.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) },
              { icon: <DollarSign className="h-4 w-4" />, label: "Amount", value: `$${selectedTx.amount}` },
            ]}
            price={`$${selectedTx.amount}`}
            extraActions={selectedTx.status === "paid" ? (
              <Button
                className="flex-1 rounded-full"
                variant="outline"
                onClick={() => {
                  setRefundingTx(selectedTx)
                  setSelectedTx(null)
                }}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Request a Refund
              </Button>
            ) : undefined}
          />
        )}

        {payingTx && (
          <PaymentModal
            open={!!payingTx}
            onClose={() => setPayingTx(null)}
            onSuccess={() => handlePaymentSuccess(payingTx.id)}
            serviceName={payingTx.service}
            providerName={payingTx.provider}
            amount={payingTx.amount}
            studentName={payingTx.student || undefined}
            date={payingTx.date}
          />
        )}

        <CardModal
          open={cardModalOpen}
          onClose={() => {
            setCardModalOpen(false)
            setEditingCard(null)
          }}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          card={editingCard}
        />

        {refundingTx && (
          <RefundModal
            open={!!refundingTx}
            onClose={() => setRefundingTx(null)}
            onSubmit={() => handleTransactionStatusChange(refundingTx.id, "requested")}
            serviceName={refundingTx.service}
            providerName={refundingTx.provider}
            amount={refundingTx.amount}
            transactionId={refundingTx.id}
            date={refundingTx.date}
          />
        )}
      </div>
    </div>
  )
}
