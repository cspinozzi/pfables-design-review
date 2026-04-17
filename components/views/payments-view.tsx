"use client"

import { ReactNode, useState } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import { PayoutMethodModal } from "@/components/payout-method-modal"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { FilterPills } from "@/components/shared/filter-pills"
import { EmptyState } from "@/components/shared/empty-state"
import { AlertCircle, Calendar, Clock, DollarSign, Landmark, Plus, TrendingUp } from "lucide-react"

const ServiceDetailModal = dynamic(
  () => import("@/components/service-detail-modal").then((m) => ({ default: m.ServiceDetailModal })),
  { ssr: false },
)

export type PaymentStatus = "waiting" | "done" | "requested" | "refunded"

export interface PaymentItem {
  id: string
  avatar: string
  avatarAlt: string
  title: string
  subtitle: string
  amount: number
  date: Date
  status: PaymentStatus
  modalPeople: Array<{ name: string; role: string; avatar?: string }>
  modalFields: Array<{ icon: ReactNode; label: string; value: string }>
}

export interface PayoutMethod {
  id: string
  bankName: string
  last4: string
  accountType: string
  isDefault: boolean
}

export interface PaymentsViewProps {
  /** Singular noun used in the waiting-payment alert (e.g. "lesson" / "repair"). */
  noun: string
  /** Text that appears under the payout method list. */
  payoutNote: string
  /** Text shown in empty state for the "waiting" filter. */
  waitingEmptyText: string
  /** Initial payout method for the role. */
  initialPayoutMethod: PayoutMethod
  /** Initial payments for the role, already normalized to the shared shape. */
  initialPayments: PaymentItem[]
}

export function PaymentsView({
  noun,
  payoutNote,
  waitingEmptyText,
  initialPayoutMethod,
  initialPayments,
}: PaymentsViewProps) {
  const [filter, setFilter] = useState<"waiting" | "done" | "refunded">("waiting")
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null)
  const [payoutModalOpen, setPayoutModalOpen] = useState(false)
  const [editingPayout, setEditingPayout] = useState<PayoutMethod | null>(null)
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([initialPayoutMethod])
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments)

  const handlePaymentStatusChange = (id: string, newStatus: PaymentStatus) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)))
    if (selectedPayment?.id === id) {
      setSelectedPayment((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const handleSavePayout = (method: PayoutMethod) => {
    setPayoutMethods((prev) => {
      const exists = prev.find((m) => m.id === method.id)
      if (exists) {
        return prev.map((m) =>
          m.id === method.id ? { ...m, ...method } : method.isDefault ? { ...m, isDefault: false } : m,
        )
      }
      const reset = method.isDefault ? prev.map((m) => ({ ...m, isDefault: false })) : prev
      return [...reset, method]
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

  const now = new Date()
  const thisMonthTotal = payments
    .filter((p) => p.date.getMonth() === now.getMonth() && p.date.getFullYear() === now.getFullYear())
    .reduce((sum, p) => sum + p.amount, 0)

  const filteredPayments =
    filter === "refunded"
      ? payments.filter((p) => p.status === "requested" || p.status === "refunded")
      : payments.filter((p) => p.status === filter)

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-12">
      <div className="page-container pt-6">
        <PageHeader
          title="Payments"
          subtitle="Track received payments and pending balances"
          className="mb-6"
        />

        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <StatCard label="Total Done" value={`$${totalDone.toLocaleString()}`} icon={TrendingUp} tone="success" />
          <StatCard label="Waiting Payment" value={`$${totalWaiting.toLocaleString()}`} icon={Clock} tone="warning" />
          <StatCard label="This Month" value={`$${thisMonthTotal.toLocaleString()}`} icon={DollarSign} tone="primary" />
        </div>

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
                        <p className="font-medium">
                          {method.bankName} &bull;&bull;&bull;&bull; {method.last4}
                        </p>
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

          <p className="mt-3 text-xs text-muted-foreground">{payoutNote}</p>
        </div>

        <FilterPills
          className="mb-6"
          value={filter}
          onChange={setFilter}
          options={[
            { key: "waiting", label: `Waiting Payment (${waiting.length})` },
            { key: "done", label: `Done (${done.length})` },
            { key: "refunded", label: `Refunded (${refundRelated.length})` },
          ]}
        />

        {filteredPayments.length > 0 ? (
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <ServiceCard
                key={payment.id}
                image={payment.avatar}
                imageAlt={payment.avatarAlt}
                title={payment.title}
                subtitle={payment.subtitle}
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
          <EmptyState
            icon={DollarSign}
            title="No payments found"
            description={
              filter === "waiting"
                ? waitingEmptyText
                : filter === "refunded"
                  ? "No refunded payments"
                  : "Your payment history will appear here"
            }
          />
        )}

        {selectedPayment && (
          <ServiceDetailModal
            open={!!selectedPayment}
            onClose={() => setSelectedPayment(null)}
            title={selectedPayment.title}
            subtitle={selectedPayment.subtitle}
            status={selectedPayment.status}
            onStatusChange={(s) => handlePaymentStatusChange(selectedPayment.id, s as PaymentStatus)}
            people={selectedPayment.modalPeople}
            fields={[
              ...selectedPayment.modalFields,
              {
                icon: <Calendar className="h-4 w-4" />,
                label: "Date",
                value: selectedPayment.date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }),
              },
              {
                icon: <DollarSign className="h-4 w-4" />,
                label: "Amount",
                value: `$${selectedPayment.amount}`,
              },
            ]}
            price={`$${selectedPayment.amount}`}
          />
        )}

        {waiting.length > 0 && filter === "waiting" && (
          <Card className="mt-6 p-4 border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {waiting.length} {noun}
                  {waiting.length > 1 ? "s" : ""} awaiting payment (${totalWaiting})
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Payments are typically processed within 3-5 business days after the customer pays.
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
