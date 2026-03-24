"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Send } from "lucide-react"
import { toast } from "sonner"

interface ReviewModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (rating: number, comment: string) => void
  serviceName: string
  providerName: string
  providerAvatar?: string
  date: Date
  studentName?: string
}

export function ReviewModal({
  open,
  onClose,
  onSubmit,
  serviceName,
  providerName,
  providerAvatar,
  date,
  studentName,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      toast.success("Review submitted!", {
        description: `Thank you for reviewing ${providerName}`,
      })
      onSubmit?.(rating, comment)
      setIsSubmitting(false)
      setRating(0)
      setComment("")
      onClose()
    }, 500)
  }

  const handleClose = () => {
    setRating(0)
    setHoveredRating(0)
    setComment("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Class</DialogTitle>
          <DialogDescription>
            Share your experience with this lesson
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Service Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
            <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0">
              <Image 
                src={providerAvatar || "/placeholder.svg"} 
                alt={providerName} 
                fill 
                className="object-cover" 
              />
            </div>
            <div>
              <h3 className="font-semibold">{serviceName}</h3>
              <p className="text-sm text-muted-foreground">{providerName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                {studentName && ` · ${studentName}`}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="text-center">
            <p className="text-sm font-medium mb-3">How was your experience?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {rating === 0 && "Select a rating"}
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Comment <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              placeholder="Share your thoughts about this lesson..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2 mt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-full"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
