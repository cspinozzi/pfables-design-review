"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

export interface ReviewData {
  id: string
  rating: number
  comment?: string
  reviewerName: string
  reviewerAvatar?: string
  date: Date
}

interface ReviewDisplayProps {
  review: ReviewData
  serviceName: string
}

export function ReviewDisplay({ review, serviceName }: ReviewDisplayProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        className="flex items-center justify-between px-6 sm:px-8 py-6 bg-muted rounded-b-xl cursor-pointer group transition-colors hover:bg-muted/90"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation()
            setIsOpen(true)
          }
        }}
      >
        {/* Stars + comment preview — left */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-0.5 shrink-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          {review.comment && (
            <p className="text-sm text-muted-foreground truncate ml-2">
              "{review.comment.substring(0, 35)}{review.comment.length > 35 ? "…" : ""}"
            </p>
          )}
        </div>

        {/* View Review link — right */}
        <span className="text-sm text-muted-foreground group-hover:text-foreground shrink-0 ml-4 transition-colors">
          View Review
        </span>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review for {serviceName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Reviewer Info */}
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 bg-muted">
                <Image
                  src={review.reviewerAvatar || "/placeholder-user.jpg"}
                  alt={review.reviewerName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{review.reviewerName}</p>
                <p className="text-xs text-muted-foreground">
                  {review.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {review.rating === 5 && "Excellent"}
                {review.rating === 4 && "Very Good"}
                {review.rating === 3 && "Good"}
                {review.rating === 2 && "Fair"}
                {review.rating === 1 && "Poor"}
              </span>
            </div>

            {/* Comment */}
            {review.comment ? (
              <div className="p-4 bg-muted/50 rounded-xl">
                <p className="text-sm leading-relaxed">{review.comment}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No written comment was provided.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
