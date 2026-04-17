import { SubscriptionView } from "@/components/views/subscription-view"

export default function RepairerSubscriptionPage() {
  return (
    <SubscriptionView
      subtitle="Choose the perfect plan for your repair business"
      basicDirectoryLabel="Listed in repair directory"
      basicProfileLabel="Standard business profile"
      invoicePrefix="INV-R-"
    />
  )
}
