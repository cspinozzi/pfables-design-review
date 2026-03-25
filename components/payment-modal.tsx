'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, CreditCard, Lock } from 'lucide-react'
import Image from 'next/image'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  serviceName: string
  providerName: string
  amount: number // in dollars
  studentName?: string
  date?: Date
}

export function PaymentModal({
  open,
  onClose,
  onSuccess,
  serviceName,
  providerName,
  amount,
  studentName,
  date,
}: PaymentModalProps) {
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

  const handlePayment = () => {
    setStatus('processing')
    // Simulate payment processing
    setTimeout(() => {
      setStatus('complete')
      setTimeout(() => {
        onSuccess?.()
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {status === 'complete' ? 'Payment Complete' : 'Complete Payment'}
          </DialogTitle>
          <DialogDescription>
            {status === 'complete' ? 'Your payment has been processed.' : `Pay $${amount.toFixed(2)} for ${serviceName}`}
          </DialogDescription>
        </DialogHeader>

        {status === 'idle' && (
          <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
            {/* Payment Summary */}
            <div className="rounded-lg border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Service</span>
                <span className="text-sm font-medium">{serviceName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Provider</span>
                <span className="text-sm font-medium">{providerName}</span>
              </div>
              {studentName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Student</span>
                  <span className="text-sm font-medium">{studentName}</span>
                </div>
              )}
              {date && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm font-medium">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-11 text-base font-semibold"
              onClick={() => setStatus('checkout')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ${amount.toFixed(2)}
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
            {/* Stripe-like checkout form */}
            <div className="rounded-lg border bg-card p-4 space-y-4">
              {/* Card Number */}
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

              {/* Expiry and CVC */}
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

              {/* Cardholder Name */}
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

              {/* Billing ZIP */}
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

            {/* Order Summary */}
            <div className="rounded-lg border bg-secondary/30 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{serviceName}</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                <span className="font-medium">Total due</span>
                <span className="text-lg font-bold">${amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
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
                onClick={handlePayment}
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
                  `Pay $${amount.toFixed(2)}`
                )}
              </Button>
            </div>

            {/* Stripe branding */}
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
              Payment Successful!
            </h3>
            <p className="text-sm text-muted-foreground">
              Thank you for your payment of ${amount.toFixed(2)}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
