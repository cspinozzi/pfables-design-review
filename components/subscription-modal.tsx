'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, CreditCard, Lock, Crown, Star, Zap } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  interval: string
}

interface SubscriptionModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: (planId: string) => void
  plan: Plan | null
  currentPlan?: string
}

export function SubscriptionModal({
  open,
  onClose,
  onSuccess,
  plan,
  currentPlan,
}: SubscriptionModalProps) {
  const [status, setStatus] = useState<'idle' | 'checkout' | 'processing' | 'complete'>('idle')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [zip, setZip] = useState('')

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + ' / ' + v.substring(2, 4)
    }
    return v
  }

  const handleSubscribe = () => {
    setStatus('processing')
    setTimeout(() => {
      setStatus('complete')
      setTimeout(() => {
        onSuccess?.(plan?.id || '')
        onClose()
        resetForm()
      }, 2000)
    }, 1500)
  }

  const resetForm = () => {
    setStatus('idle')
    setCardNumber('')
    setExpiry('')
    setCvc('')
    setName('')
    setZip('')
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose()
      setTimeout(() => resetForm(), 300)
    }
  }

  const isFormValid = cardNumber.replace(/\s/g, '').length >= 15 && 
    expiry.replace(/\s|\//g, '').length === 4 && 
    cvc.length >= 3 && 
    name.length > 0

  const isUpgrade = currentPlan && plan && getPlanOrder(plan.id) > getPlanOrder(currentPlan)
  const isDowngrade = currentPlan && plan && getPlanOrder(plan.id) < getPlanOrder(currentPlan)

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic': return <Star className="h-5 w-5" />
      case 'featured': return <Crown className="h-5 w-5" />
      case 'premium': return <Zap className="h-5 w-5" />
      default: return <Star className="h-5 w-5" />
    }
  }

  if (!plan) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            {getPlanIcon(plan.name)}
            {status === 'complete' 
              ? 'Subscription Confirmed!' 
              : isUpgrade 
                ? `Upgrade to ${plan.name}`
                : isDowngrade
                  ? `Switch to ${plan.name}`
                  : `Subscribe to ${plan.name}`
            }
          </DialogTitle>
          <DialogDescription>
            {status === 'complete' 
              ? 'Your subscription is now active'
              : isUpgrade 
                ? `Upgrade to ${plan.name} plan - $${plan.price}/${plan.interval}`
                : isDowngrade
                  ? `Switch to ${plan.name} plan - $${plan.price}/${plan.interval}`
                  : `Subscribe to ${plan.name} plan - $${plan.price}/${plan.interval}`
            }
          </DialogDescription>
        </DialogHeader>

        {status === 'idle' && (
          <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
            {/* Plan Summary */}
            <div className="rounded-lg border bg-secondary/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {getPlanIcon(plan.name)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{plan.name} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {isUpgrade ? 'Upgrade your subscription' : isDowngrade ? 'Change your plan' : 'Start your subscription'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${plan.price}</p>
                  <p className="text-xs text-muted-foreground">/{plan.interval}</p>
                </div>
              </div>
            </div>

            {isUpgrade && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-sm text-green-800">
                  You&apos;ll be charged the prorated difference for the remainder of your billing cycle.
                </p>
              </div>
            )}

            {isDowngrade && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  Your plan will change at the end of your current billing cycle. You&apos;ll continue to have access to {currentPlan} features until then.
                </p>
              </div>
            )}

            <Button 
              className="w-full h-11" 
              onClick={() => setStatus('checkout')}
            >
              {isUpgrade ? 'Continue to Payment' : isDowngrade ? 'Confirm Change' : 'Continue to Payment'}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Secured by</span>
              <span className="font-semibold text-[#635BFF]">stripe</span>
            </div>
          </div>
        )}

        {(status === 'checkout' || status === 'processing') && (
          <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
            {/* Plan reminder */}
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
              <div className="flex items-center gap-2">
                {getPlanIcon(plan.name)}
                <span className="font-medium">{plan.name} Plan</span>
              </div>
              <span className="font-bold">${plan.price}/{plan.interval}</span>
            </div>

            {/* Card form */}
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Card number
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="h-11 pl-10 font-mono"
                    disabled={status === 'processing'}
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Expiration
                  </label>
                  <Input
                    type="text"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={7}
                    className="h-11 font-mono"
                    disabled={status === 'processing'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    CVC
                  </label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    className="h-11 font-mono"
                    disabled={status === 'processing'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name on card
                </label>
                <Input
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                  disabled={status === 'processing'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Billing ZIP
                </label>
                <Input
                  type="text"
                  placeholder="12345"
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  maxLength={5}
                  className="h-11 font-mono w-32"
                  disabled={status === 'processing'}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setStatus('idle')}
                disabled={status === 'processing'}
              >
                Back
              </Button>
              <Button
                className="flex-[2] h-11 text-base font-semibold bg-[#635BFF] hover:bg-[#5851DB] text-white"
                onClick={handleSubscribe}
                disabled={!isFormValid || status === 'processing'}
              >
                {status === 'processing' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Subscribe - $${plan.price}/${plan.interval}`
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Secured by</span>
              <span className="font-semibold text-[#635BFF]">stripe</span>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div className="flex flex-col items-center justify-center px-4 pb-6 pt-4 sm:px-6 sm:pb-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Welcome to {plan.name}!
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your subscription is now active. Enjoy all the benefits of your new plan.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function getPlanOrder(planId: string): number {
  const order: Record<string, number> = {
    'basic': 1,
    'featured': 2,
    'premium': 3,
  }
  return order[planId.toLowerCase()] || 0
}
