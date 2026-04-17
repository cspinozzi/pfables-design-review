"use client"

import { ReactNode } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Calendar, MessageSquare, Star, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"

export interface ReviewItem {
  id: string
  reviewerName: string
  reviewerAvatar: string
  /** Context rendered under the name (e.g. "Piano Lesson with Emma" or "String Replacement - Violin"). */
  contextNode: ReactNode
  rating: number
  comment: string
  date: Date
}

export interface ReviewsViewProps {
  subtitle: string
  emptyDescription: string
  reviews: ReviewItem[]
}

export function ReviewsView({ subtitle, emptyDescription, reviews }: ReviewsViewProps) {
  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0"

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { rating, count, percentage }
  })

  const positiveCount = reviews.filter((r) => r.rating >= 4).length

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-12">
      <div className="page-container pt-6">
        <PageHeader title="Reviews" subtitle={subtitle} className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
              <span className="font-display text-3xl font-semibold">{averageRating}</span>
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </Card>
          <Card className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="font-display text-3xl font-semibold">{reviews.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Reviews</p>
          </Card>
          <Card className="p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-display text-3xl font-semibold">{positiveCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Positive Reviews</p>
          </Card>
        </div>

        <Card className="p-5 mb-8">
          <h2 className="font-medium mb-4">Rating Distribution</h2>
          <div className="space-y-2">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <h2 className="font-display text-xl font-medium mb-4">All Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={review.reviewerAvatar || "/placeholder.svg"}
                      alt={review.reviewerName}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">{review.reviewerName}</h3>
                        <div className="text-xs text-muted-foreground">{review.contextNode}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-foreground mt-2">{review.comment}</p>}
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {review.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState icon={Star} title="No reviews yet" description={emptyDescription} />
        )}
      </div>
    </div>
  )
}
