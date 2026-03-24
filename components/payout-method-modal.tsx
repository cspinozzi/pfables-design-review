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
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Building2, Lock, Trash2, AlertCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PayoutMethod {
  id: string
  bankName: string
  last4: string
  accountType: string
  isDefault: boolean
}

interface PayoutMethodModalProps {
  open: boolean
  onClose: () => void
  onSave: (method: PayoutMethod) => void
  onDelete?: (id: string) => void
  method?: PayoutMethod | null
}

export function PayoutMethodModal({
  open,
  onClose,
  onSave,
  onDelete,
  method,
}: PayoutMethodModalProps) {
  const isEditing = !!method
  
  const [routingNumber, setRoutingNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('')
  const [accountHolderName, setAccountHolderName] = useState('')
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking')
  const [isDefault, setIsDefault] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'deleting' | 'success'>('idle')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (open) {
      if (method) {
        // Editing - pre-fill with masked data
        setRoutingNumber('')
        setAccountNumber('')
        setConfirmAccountNumber('')
        setAccountHolderName('')
        setAccountType(method.accountType.toLowerCase() as 'checking' | 'savings')
        setIsDefault(method.isDefault)
      } else {
        // Adding new
        setRoutingNumber('')
        setAccountNumber('')
        setConfirmAccountNumber('')
        setAccountHolderName('')
        setAccountType('checking')
        setIsDefault(false)
      }
      setStatus('idle')
      setShowDeleteConfirm(false)
    }
  }, [open, method])

  const formatRoutingNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 9)
  }

  const formatAccountNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 17)
  }

  const getBankName = (routing: string): string => {
    // Mock bank name lookup based on routing number prefix
    const prefixes: Record<string, string> = {
      '021': 'Chase Bank',
      '026': 'Bank of America',
      '031': 'Wells Fargo',
      '071': 'JP Morgan',
      '121': 'Citibank',
      '322': 'Capital One',
    }
    const prefix = routing.slice(0, 3)
    return prefixes[prefix] || 'Bank'
  }

  const handleSave = () => {
    setStatus('saving')
    // Simulate API call
    setTimeout(() => {
      const bankName = isEditing ? method!.bankName : getBankName(routingNumber)
      const last4 = isEditing ? method!.last4 : accountNumber.slice(-4)
      
      onSave({
        id: method?.id || `payout-${Date.now()}`,
        bankName,
        last4,
        accountType: accountType.charAt(0).toUpperCase() + accountType.slice(1),
        isDefault,
      })
      setStatus('success')
      setTimeout(() => {
        onClose()
        setStatus('idle')
      }, 1000)
    }, 1500)
  }

  const handleDelete = () => {
    if (!method || !onDelete) return
    setStatus('deleting')
    setTimeout(() => {
      onDelete(method.id)
      setStatus('idle')
    }, 1000)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && status !== 'saving' && status !== 'deleting') {
      onClose()
    }
  }

  const isFormValid = isEditing 
    ? true // In edit mode, just changing default is valid
    : routingNumber.length === 9 && 
      accountNumber.length >= 4 && 
      accountNumber === confirmAccountNumber &&
      accountHolderName.length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {isEditing ? 'Edit Payout Method' : 'Add Payout Method'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your bank account details' : 'Add a new bank account for payouts'}
          </DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center px-4 pb-6 pt-4 sm:px-6 sm:pb-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {isEditing ? 'Account Updated' : 'Account Added'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Your payout method has been saved securely.
            </p>
          </div>
        ) : showDeleteConfirm ? (
          <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Remove this payout method?
                </p>
                <p className="text-xs text-red-700 mt-1">
                  {method?.bankName} •••• {method?.last4} will be removed. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={status === 'deleting'}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-11"
                onClick={handleDelete}
                disabled={status === 'deleting'}
              >
                {status === 'deleting' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Removing...
                  </span>
                ) : 'Remove'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
            {isEditing ? (
              // Edit mode - show current account info
              <div className="rounded-lg border bg-secondary/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{method?.bankName} •••• {method?.last4}</p>
                    <p className="text-sm text-muted-foreground">{method?.accountType} Account</p>
                  </div>
                </div>
              </div>
            ) : (
              // Add mode - show form in card container
              <div className="rounded-lg border bg-card p-4 space-y-4">
                {/* Routing Number */}
                <div>
                  <Label htmlFor="routing" className="text-sm font-medium">
                    Routing Number
                  </Label>
                  <Input
                    id="routing"
                    type="text"
                    placeholder="123456789"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(formatRoutingNumber(e.target.value))}
                    className="mt-1.5 h-11 font-mono"
                    disabled={status === 'saving'}
                  />
                  {routingNumber.length === 9 && (
                    <p className="text-xs text-green-600 mt-1">
                      {getBankName(routingNumber)}
                    </p>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <Label htmlFor="account" className="text-sm font-medium">
                    Account Number
                  </Label>
                  <Input
                    id="account"
                    type="text"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(formatAccountNumber(e.target.value))}
                    className="mt-1.5 h-11 font-mono"
                    disabled={status === 'saving'}
                  />
                </div>

                {/* Confirm Account Number */}
                <div>
                  <Label htmlFor="confirm-account" className="text-sm font-medium">
                    Confirm Account Number
                  </Label>
                  <Input
                    id="confirm-account"
                    type="text"
                    placeholder="Re-enter account number"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(formatAccountNumber(e.target.value))}
                    className="mt-1.5 h-11 font-mono"
                    disabled={status === 'saving'}
                  />
                  {confirmAccountNumber && accountNumber !== confirmAccountNumber && (
                    <p className="text-xs text-red-600 mt-1">
                      Account numbers do not match
                    </p>
                  )}
                </div>

                {/* Account Holder Name */}
                <div>
                  <Label htmlFor="holder-name" className="text-sm font-medium">
                    Account Holder Name
                  </Label>
                  <Input
                    id="holder-name"
                    type="text"
                    placeholder="John Smith"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className="mt-1.5 h-11"
                    disabled={status === 'saving'}
                  />
                </div>
              </div>
            )}

            {/* Account Type */}
            <div>
              <Label className="text-sm font-medium">Account Type</Label>
              <Select 
                value={accountType} 
                onValueChange={(v) => setAccountType(v as 'checking' | 'savings')}
                disabled={status === 'saving'}
              >
                <SelectTrigger className="mt-1.5 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Set as Default */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="default-payout"
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(checked === true)}
                disabled={status === 'saving' || (isEditing && method?.isDefault)}
              />
              <label
                htmlFor="default-payout"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set as default payout method
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {isEditing && !method?.isDefault && onDelete && (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-600/15 hover:text-red-700 hover:border-red-300"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={status === 'saving'}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                className="flex-1 h-11 bg-[#635BFF] hover:bg-[#5851DB] text-white"
                onClick={handleSave}
                disabled={!isFormValid || status === 'saving'}
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
                  isEditing ? 'Update Account' : 'Add Account'
                )}
              </Button>
            </div>

            {/* Security footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
              <Lock className="h-3 w-3" />
              <span>Bank details are encrypted and secured by</span>
              <span className="font-semibold text-[#635BFF]">stripe</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
