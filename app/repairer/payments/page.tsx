"use client"

import { Wrench } from "lucide-react"
import { PaymentsView, type PaymentItem } from "@/components/views/payments-view"

const AVATARS = {
  sarah: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  james: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
  maria: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  david: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  anna: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  robert: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
}

function repair(
  id: string,
  client: string,
  clientAvatar: string,
  service: string,
  instrument: string,
  amount: number,
  date: Date,
  status: PaymentItem["status"],
): PaymentItem {
  return {
    id,
    avatar: clientAvatar,
    avatarAlt: client,
    title: service,
    subtitle: `${client} - ${instrument}`,
    amount,
    date,
    status,
    modalPeople: [{ name: client, role: "Customer", avatar: clientAvatar }],
    modalFields: [
      { icon: <Wrench className="h-4 w-4" />, label: "Instrument", value: instrument },
    ],
  }
}

const PAYMENTS: PaymentItem[] = [
  repair("pay-1", "Sarah Thompson", AVATARS.sarah, "Violin Bridge Replacement", "1920 German Violin", 180, new Date("2026-02-03"), "done"),
  repair("pay-2", "James Park", AVATARS.james, "Bow Rehair", "Cello Bow", 85, new Date("2026-02-03"), "waiting"),
  repair("pay-3", "Maria Santos", AVATARS.maria, "Soundpost Adjustment", "Viola", 60, new Date("2026-01-31"), "done"),
  repair("pay-4", "David Lee", AVATARS.david, "Full Setup & Adjustment", "Student Violin", 120, new Date("2026-01-27"), "done"),
  repair("pay-5", "Anna Chen", AVATARS.anna, "Crack Repair & Varnish", "French Cello", 450, new Date("2026-01-27"), "waiting"),
  repair("pay-6", "Sarah Thompson", AVATARS.sarah, "Bow Rehair", "Violin Bow", 75, new Date("2026-01-24"), "refunded"),
  repair("pay-7", "Robert Johnson", AVATARS.robert, "String Replacement", "Classical Guitar", 45, new Date("2026-01-29"), "requested"),
]

export default function RepairerPaymentsPage() {
  return (
    <PaymentsView
      noun="repair"
      payoutNote="Payments are deposited to your account within 3-5 business days after repair completion and client pickup."
      waitingEmptyText="No repairs awaiting payment"
      initialPayoutMethod={{
        id: "payout-1",
        bankName: "Bank of America",
        last4: "3456",
        accountType: "Checking",
        isDefault: true,
      }}
      initialPayments={PAYMENTS}
    />
  )
}
