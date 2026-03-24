'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

interface CancelSubscriptionModalProps {
  open: boolean
  onClose: () => void
  onCancel: () => void
  planName: string
  renewalDate: string
}

export function CancelSubscriptionModal({
  open,
  onClose,
  onCancel,
  planName,
  renewalDate,
}: CancelSubscriptionModalProps) {
  const [status, setStatus] = useState<'confirm' | 'reason' | 'processing' | 'complete'>('confirm')
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [otherReason, setOtherReason] = useState('')

  const reasons = [
    { id: 'too-expensive', label: 'Too expensive' },
    { id: 'not-using', label: "I'm not using it enough" },
    { id: 'missing-features', label: 'Missing features I need' },
    { id: 'switching', label: 'Switching to another service' },
    { id: 'temporary', label: 'Taking a break temporarily' },
    { id: 'other', label: 'Other reason' },
  ]

  const handleContinue = () => {
    if (status === 'confirm') {
      setStatus('reason')
    } else if (status === 'reason') {
      setStatus('processing')
      // Simulate API call
      setTimeout(() => {
        setStatus('complete')
        setTimeout(() => {
          onCancel()
          onClose()
          resetForm()
        }, 2000)
      }, 1500)
    }
  }

  const resetForm = () => {
    setStatus('confirm')
    setSelectedReason(null)
    setOtherReason('')
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && status !== 'processing') {
      onClose()
      setTimeout(() => resetForm(), 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            {status === 'complete' ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Subscription Cancelled
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Cancel Subscription
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {status === 'confirm' && (
          <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
            {/* Warning message */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800">
                    Are you sure you want to cancel?
                  </p>
                  <p className="text-sm text-amber-700">
                    Your {planName} subscription will remain active until {renewalDate}. After that, you will lose access to premium features.
                  </p>
                </div>
              </div>
            </div>

            {/* What you'll lose */}
            <div className="rounded-lg border bg-card p-4">
              <h4 className="text-sm font-semibold mb-3">{"What you'll lose:"}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  Featured badge on your profile
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  Top placement in search results
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  Priority support access
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  Advanced analytics
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={onClose}
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-11"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {(status === 'reason' || status === 'processing') && (
          <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
            <p className="text-sm text-muted-foreground">
              Before you go, please let us know why you are cancelling. Your feedback helps us improve.
            </p>

            {/* Reason selection */}
            <div className="space-y-2">
              {reasons.map((reason) => (
                <button
                  key={reason.id}
                  type="button"
                  onClick={() => setSelectedReason(reason.id)}
                  disabled={status === 'processing'}
                  className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                    selectedReason === reason.id
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-secondary/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {reason.label}
                </button>
              ))}
            </div>

            {/* Other reason textarea */}
            {selectedReason === 'other' && (
              <Textarea
                placeholder="Please tell us more..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                disabled={status === 'processing'}
                className="min-h-[80px] resize-none"
              />
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setStatus('confirm')}
                disabled={status === 'processing'}
              >
                Back
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-11"
                onClick={handleContinue}
                disabled={!selectedReason || status === 'processing'}
              >
                {status === 'processing' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cancelling...
                  </span>
                ) : (
                  'Cancel Subscription'
                )}
              </Button>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div className="flex flex-col items-center justify-center px-4 pb-6 pt-4 sm:px-6 sm:pb-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Subscription Cancelled
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your subscription will remain active until {renewalDate}. You can resubscribe anytime.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
