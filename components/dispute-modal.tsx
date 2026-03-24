"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface DisputeModalProps {
  open: boolean
  onClose: () => void
  serviceName: string
  providerName: string
  amount: number
  transactionId: string
  date: Date
}

const disputeReasons = [
  { value: "service_not_provided", label: "Service was not provided" },
  { value: "quality_issue", label: "Quality did not meet expectations" },
  { value: "wrong_amount", label: "Incorrect amount charged" },
  { value: "duplicate_charge", label: "Duplicate charge" },
  { value: "other", label: "Other" },
]

export function DisputeModal({
  open,
  onClose,
  serviceName,
  providerName,
  amount,
  transactionId,
  date,
}: DisputeModalProps) {
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason for the dispute")
      return
    }
    if (!description.trim()) {
      toast.error("Please provide additional details")
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call to Stripe
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    toast.success("Dispute submitted successfully", {
      description: "We'll review your case and get back to you within 5-7 business days.",
    })
    
    setIsSubmitting(false)
    setReason("")
    setDescription("")
    onClose()
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("")
      setDescription("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            File a Dispute
          </DialogTitle>
          <DialogDescription>
            Submit a dispute for this transaction. We&apos;ll review your case and respond within 5-7 business days.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Transaction Summary */}
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{serviceName}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Provider</span>
              <span>{providerName}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Date</span>
              <span>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-primary">${amount}</span>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <Label>Reason for dispute</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {disputeReasons.map((r) => (
                <div key={r.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label htmlFor={r.value} className="font-normal cursor-pointer">
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional details</Label>
            <Textarea
              id="description"
              placeholder="Please describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !reason || !description.trim()}
            className="bg-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Dispute"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
