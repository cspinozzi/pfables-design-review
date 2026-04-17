"use client"

import { PaymentsView, type PaymentItem } from "@/components/views/payments-view"

const AVATARS = {
  sarah: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  lisa: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
  ana: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  robert: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
}

function lesson(
  id: string,
  student: string,
  parent: string,
  parentAvatar: string,
  service: string,
  amount: number,
  date: Date,
  status: PaymentItem["status"],
): PaymentItem {
  return {
    id,
    avatar: parentAvatar,
    avatarAlt: parent,
    title: service,
    subtitle: `${student} (${parent})`,
    amount,
    date,
    status,
    modalPeople: [
      { name: parent, role: "Parent", avatar: parentAvatar },
      { name: student, role: "Student" },
    ],
    modalFields: [],
  }
}

const PAYMENTS: PaymentItem[] = [
  lesson("pay-1", "Emma Thompson", "Sarah Thompson", AVATARS.sarah, "Piano Lesson", 65, new Date("2026-02-03"), "done"),
  lesson("pay-2", "Jake Wilson", "Lisa Wilson", AVATARS.lisa, "Music Theory Session", 45, new Date("2026-02-03"), "waiting"),
  lesson("pay-3", "Sophia Martinez", "Ana Martinez", AVATARS.ana, "Piano Lesson", 75, new Date("2026-01-31"), "done"),
  lesson("pay-4", "Emma Thompson", "Sarah Thompson", AVATARS.sarah, "Piano Lesson", 65, new Date("2026-01-27"), "done"),
  lesson("pay-5", "Jake Wilson", "Lisa Wilson", AVATARS.lisa, "Music Theory Session", 45, new Date("2026-01-27"), "refunded"),
  lesson("pay-7", "Mia Johnson", "Robert Johnson", AVATARS.robert, "Piano Lesson", 65, new Date("2026-01-30"), "requested"),
  lesson("pay-6", "Sophia Martinez", "Ana Martinez", AVATARS.ana, "Piano Lesson", 75, new Date("2026-01-24"), "waiting"),
]

export default function ProviderPaymentsPage() {
  return (
    <PaymentsView
      noun="lesson"
      payoutNote="Payments are deposited to your account within 3-5 business days after lesson completion."
      waitingEmptyText="No payments awaiting processing"
      initialPayoutMethod={{
        id: "payout-1",
        bankName: "Chase Bank",
        last4: "8742",
        accountType: "Checking",
        isDefault: true,
      }}
      initialPayments={PAYMENTS}
    />
  )
}
