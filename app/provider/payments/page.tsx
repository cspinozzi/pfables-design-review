"use client"

import { useMemo } from "react"
import { Calendar, DollarSign, FileText, MessageSquare } from "lucide-react"
import { PaymentsView, type PaymentItem } from "@/components/views/payments-view"
import { useLessonCompletion } from "@/lib/lesson-completion-context"

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
  const { completedLessons } = useLessonCompletion()

  const extraPayments = useMemo<PaymentItem[]>(
    () =>
      completedLessons.map((l) => ({
        id: `pay-${l.id}`,
        avatar: l.parentAvatar || l.studentAvatar,
        avatarAlt: l.parent,
        title: l.title,
        subtitle: `${l.student} (${l.parent})`,
        amount: l.rate,
        date: l.completedAt,
        status: "waiting" as const,
        modalPeople: [
          { name: l.parent, role: "Parent", avatar: l.parentAvatar },
          { name: l.student, role: "Student" },
        ],
        modalFields: [
          { icon: <Calendar className="h-4 w-4" />, label: "Lesson date", value: l.originalDate },
          { icon: <DollarSign className="h-4 w-4" />, label: "Rate", value: `$${l.rate}` },
          { icon: <FileText className="h-4 w-4" />, label: "Topic", value: l.topic },
          ...(l.comment
            ? [{ icon: <MessageSquare className="h-4 w-4" />, label: "Notes", value: l.comment }]
            : []),
        ],
      })),
    [completedLessons],
  )

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
      extraPayments={extraPayments}
    />
  )
}
