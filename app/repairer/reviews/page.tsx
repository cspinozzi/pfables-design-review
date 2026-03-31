"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Star, TrendingUp, MessageSquare, Calendar, Wrench } from "lucide-react"

interface Review {
  id: string
  clientName: string
  clientAvatar: string
  service: string
  instrument: string
  rating: number
  comment: string
  date: Date
}

const mockReviews: Review[] = [
  {
    id: "rev-1",
    clientName: "Sarah Thompson",
    clientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    service: "String Replacement",
    instrument: "Violin",
    rating: 5,
    comment: "Excellent work! The violin sounds better than ever. Very professional service.",
    date: new Date("2026-01-28"),
  },
  {
    id: "rev-2",
    clientName: "Michael Rodriguez",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    service: "Full Setup",
    instrument: "Acoustic Guitar",
    rating: 5,
    comment: "Amazing attention to detail. My guitar plays like new!",
    date: new Date("2026-01-25"),
  },
  {
    id: "rev-3",
    clientName: "Emily Carter",
    clientAvatar: "/music-teacher-woman-piano.jpg",
    service: "Piano Tuning",
    instrument: "Grand Piano",
    rating: 4,
    comment: "Great tuning job. Will definitely use again.",
    date: new Date("2026-01-22"),
  },
  {
    id: "rev-4",
    clientName: "Robert Johnson",
    clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    service: "Bow Rehair",
    instrument: "Cello Bow",
    rating: 5,
    comment: "",
    date: new Date("2026-01-20"),
  },
  {
    id: "rev-5",
    clientName: "Lisa Wilson",
    clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    service: "Crack Repair",
    instrument: "Violin",
    rating: 5,
    comment: "Saved my daughter's violin! Can barely see where the crack was. Highly recommend!",
    date: new Date("2026-01-18"),
  },
]

export default function RepairerReviewsPage() {
  const [reviews] = useState(mockReviews)

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0
  }))

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-12">
      <div className="page-container pt-6">
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground">Reviews</h1>
          <p className="text-sm text-muted-foreground">Feedback from your clients</p>
        </div>

        {/* Stats Overview */}
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
              <span className="font-display text-3xl font-semibold">
                {reviews.filter(r => r.rating >= 4).length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Positive Reviews</p>
          </Card>
        </div>

        {/* Rating Distribution */}
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

        {/* Reviews List */}
        <h2 className="font-display text-xl font-medium mb-4">All Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0">
                    <Image src={review.clientAvatar} alt={review.clientName} fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">{review.clientName}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Wrench className="h-3 w-3" />
                          {review.service} - {review.instrument}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
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
                    </div>
                    {review.comment && (
                      <p className="text-sm text-foreground mt-2">{review.comment}</p>
                    )}
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
          <Card className="p-8 text-center">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-1">No reviews yet</h3>
            <p className="text-sm text-muted-foreground">
              Reviews from clients will appear here after completed services
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
