"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { mockProviders, mockSubscriptions } from "@/lib/mock-data"
import { Check, CreditCard, Calendar, DollarSign, Download, Crown, Star, Zap } from "lucide-react"
import { SubscriptionModal } from "@/components/subscription-modal"
import { CancelSubscriptionModal } from "@/components/cancel-subscription-modal"
import { CardModal } from "@/components/card-modal"

export default function ProviderSubscriptionPage() {
  const { user } = useAuth()
  const provider = mockProviders.find((p) => p.userId === user?.id)
  const subscription = mockSubscriptions.find((s) => s.providerId === provider?.id)
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number; interval: string } | null>(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [currentTier, setCurrentTier] = useState(provider?.subscriptionTier || 'featured')
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(true)

  const tiers = [
    {
      id: "basic",
      name: "Basic",
      price: 29,
      icon: Star,
      color: "from-blue-500 to-blue-600",
      features: [
        "Listed in provider directory",
        "Standard profile page",
        "Contact form inquiries",
        "Message inbox",
        "Basic analytics",
      ],
    },
    {
      id: "featured",
      name: "Featured",
      price: 59,
      popular: true,
      icon: Crown,
      color: "from-amber-500 to-amber-600",
      features: [
        "Everything in Basic",
        "Featured badge on profile",
        "Top placement in search",
        "Enhanced profile options",
        "Priority support",
        "Advanced analytics",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 99,
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      features: [
        "Everything in Featured",
        "Premium badge display",
        "Homepage carousel",
        "Custom URL",
        "API access",
        "Dedicated manager",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">

      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
        <div className="mb-8 sm:mb-10">
          <h1 className="mb-2 font-display text-2xl sm:text-3xl font-medium">Subscription</h1>
          <p className="text-sm text-muted-foreground md:text-base">Choose the perfect plan for your business</p>
        </div>

        {subscription && (
          <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-lg font-semibold capitalize">{subscription.tier} Plan</h3>
                  <p className="text-2xl font-bold text-primary">
                    ${subscription.price}
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </p>
                </div>
                <Badge className="bg-primary text-primary-foreground">Active</Badge>
              </div>

              <div className="mb-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>Renews {subscription.nextBillingDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4 flex-shrink-0" />
                  <span>Card ending in {subscription.paymentMethod.last4}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-10 bg-transparent"
                  onClick={() => setShowCardModal(true)}
                >
                  Update Payment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-10 bg-transparent text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3 md:grid md:grid-cols-3 md:gap-3 md:space-y-0">
          {tiers.map((tier) => {
            const Icon = tier.icon
            return (
              <Card
                key={tier.id}
                className={`relative overflow-hidden transition-all ${
                  tier.popular ? "border-2 border-primary shadow-lg" : "border-2 border-transparent"
                } ${selectedPlan?.id === tier.id ? "ring-2 ring-primary" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute right-0 top-0 bg-primary px-3 py-1 text-xs font-semibold text-white">
                    POPULAR
                  </div>
                )}

                <CardContent className="p-5">
                  <div className={`mb-4 inline-flex items-center justify-center rounded-2xl ${tier.color} p-3`}>
                    <Icon className={`h-6 w-6 ${tier.color}`} />
                  </div>

                  <h3 className="mb-2 text-xl font-bold">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${tier.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <ul className="mb-6 space-y-2.5">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="h-12 w-full"
                    variant={tier.id === currentTier ? "secondary" : "default"}
                    onClick={() => {
                      setSelectedPlan({ id: tier.id, name: tier.name, price: tier.price, interval: 'month' })
                      setShowSubscriptionModal(true)
                    }}
                    disabled={tier.id === currentTier}
                  >
                    {tier.id === currentTier ? "Current Plan" : `Choose ${tier.name}`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-6">
          <CardContent className="p-5">
            <h3 className="mb-4 text-base font-semibold">Billing History</h3>
            <div className="space-y-3">
              {[
                { date: "2025-01-01", amount: 59, status: "paid", invoice: "INV-2025-001" },
                { date: "2024-12-01", amount: 59, status: "paid", invoice: "INV-2024-012" },
                { date: "2024-11-01", amount: 59, status: "paid", invoice: "INV-2024-011" },
              ].map((payment) => (
                <div
                  key={payment.invoice}
                  className="flex items-center gap-3 rounded-lg border bg-card p-4 active:bg-accent"
                >
                  <DollarSign className="h-8 w-8 flex-shrink-0 rounded-full bg-success/10 p-1.5 text-success" />
                  <div className="flex-1 min-w-0">
                    <div className="mb-0.5 font-medium">${payment.amount}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString()} • {payment.invoice}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-9 w-9 flex-shrink-0 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <SubscriptionModal
        open={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false)
          setSelectedPlan(null)
        }}
        onSuccess={(planId) => {
          setCurrentTier(planId)
          setIsSubscriptionActive(true)
        }}
        plan={selectedPlan}
        currentPlan={currentTier}
      />

      {subscription && (
        <CancelSubscriptionModal
          open={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onCancel={() => setIsSubscriptionActive(false)}
          planName={`${subscription.tier.charAt(0).toUpperCase()}${subscription.tier.slice(1)}`}
          renewalDate={subscription.nextBillingDate.toLocaleDateString()}
        />
      )}

      <CardModal
        open={showCardModal}
        onClose={() => setShowCardModal(false)}
        onSave={(cardData) => {
          console.log("Card updated:", cardData)
          setShowCardModal(false)
        }}
        card={subscription ? {
          id: "current-card",
          last4: subscription.paymentMethod.last4,
          brand: subscription.paymentMethod.brand,
          expMonth: subscription.paymentMethod.expMonth,
          expYear: subscription.paymentMethod.expYear,
          isDefault: true
        } : undefined}
      />
    </div>
  )
}
