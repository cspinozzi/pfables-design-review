'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { CreditCard, Lock, Trash2 } from 'lucide-react'

interface CardData {
  id: string
  type?: string
  brand?: string
  last4: string
  expiry?: string
  expMonth?: number
  expYear?: number
  isDefault: boolean
}

interface CardModalProps {
  open: boolean
  onClose: () => void
  onSave: (card: CardData) => void
  onDelete?: (id: string) => void
  card?: CardData | null // If provided, we're in edit mode
}

export function CardModal({ open, onClose, onSave, onDelete, card }: CardModalProps) {
  const isEditMode = !!card
  
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [zip, setZip] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'deleting'>('idle')

  useEffect(() => {
    if (open && card) {
      // Pre-fill for edit mode (show masked card number)
      setCardNumber(`•••• •••• •••• ${card.last4}`)
      // Handle both expiry string format and expMonth/expYear format
      const expiryValue = card.expiry 
        ? card.expiry.replace('/', ' / ')
        : card.expMonth && card.expYear 
          ? `${String(card.expMonth).padStart(2, '0')} / ${String(card.expYear).slice(-2)}`
          : ''
      setExpiry(expiryValue)
      setCvc('')
      setName('')
      setIsDefault(card.isDefault)
    } else if (open && !card) {
      resetForm()
    }
  }, [open, card])

  const formatCardNumber = (value: string) => {
    if (value.includes('••••')) return value // Don't format masked numbers
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

  const resetForm = () => {
    setCardNumber('')
    setExpiry('')
    setCvc('')
    setName('')
    setZip('')
    setIsDefault(false)
    setStatus('idle')
  }

  const handleSave = () => {
    setStatus('saving')
    // Simulate API call
    setTimeout(() => {
      const last4 = cardNumber.includes('••••') 
        ? card?.last4 || '0000'
        : cardNumber.replace(/\s/g, '').slice(-4)
      
      onSave({
        id: card?.id || `card-${Date.now()}`,
        type: 'Visa', // In real implementation, detect from card number
        last4,
        expiry: expiry.replace(' / ', '/'),
        isDefault,
      })
      setStatus('idle')
      onClose()
      if (!isEditMode) resetForm()
    }, 1200)
  }

  const handleDelete = () => {
    if (!card || !onDelete) return
    setStatus('deleting')
    setTimeout(() => {
      onDelete(card.id)
      setStatus('idle')
      onClose()
    }, 1000)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && status === 'idle') {
      onClose()
    }
  }

  const isFormValid = isEditMode 
    ? true // In edit mode, just need to have the card
    : cardNumber.replace(/\s/g, '').length >= 15 && 
      expiry.replace(/\s|\//g, '').length === 4 && 
      cvc.length >= 3 && 
      name.length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {isEditMode ? 'Edit Card' : 'Add New Card'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update your card details' : 'Add a new payment method'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
          {/* Card form container */}
          <div className="rounded-lg border bg-card p-4 space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
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
                  disabled={status !== 'idle' || isEditMode}
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Expiration
              </label>
              <Input
                type="text"
                placeholder="MM / YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={7}
                className="h-11 font-mono"
                disabled={status !== 'idle'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                CVC
              </label>
              <Input
                type="text"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                className="h-11 font-mono"
                disabled={status !== 'idle'}
              />
            </div>
          </div>

          {/* Cardholder Name - only for new cards */}
          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Name on card
              </label>
              <Input
                type="text"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                disabled={status !== 'idle'}
              />
            </div>
          )}

          {/* Billing ZIP - only for new cards */}
          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Billing ZIP
              </label>
              <Input
                type="text"
                placeholder="12345"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                maxLength={5}
                className="h-11 font-mono w-32"
                disabled={status !== 'idle'}
              />
            </div>
          )}
          </div>

          {/* Set as Default */}
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="default-card"
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked === true)}
              disabled={status !== 'idle'}
            />
            <label htmlFor="default-card" className="text-sm text-muted-foreground cursor-pointer">
              Set as default payment method
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {isEditMode && onDelete && !card?.isDefault && (
              <Button
                variant="outline"
                className="h-11 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDelete}
                disabled={status !== 'idle'}
              >
                {status === 'deleting' ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={onClose}
              disabled={status !== 'idle'}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || status !== 'idle'}
              className="flex-1 h-11 bg-[#635BFF] hover:bg-[#5851DB] text-white"
            >
              {status === 'saving' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                isEditMode ? 'Save Changes' : 'Add Card'
              )}
            </Button>
          </div>

          {/* Stripe branding */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
            <Lock className="h-3 w-3" />
            <span>Secured by</span>
            <span className="font-semibold text-[#635BFF]">stripe</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
