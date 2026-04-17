"use client"

import { Wrench } from "lucide-react"
import { ReviewsView, type ReviewItem } from "@/components/views/reviews-view"

function serviceContext(service: string, instrument: string) {
  return (
    <span className="flex items-center gap-1">
      <Wrench className="h-3 w-3" />
      {service} - {instrument}
    </span>
  )
}

const REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    reviewerName: "Sarah Thompson",
    reviewerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    contextNode: serviceContext("String Replacement", "Violin"),
    rating: 5,
    comment: "Excellent work! The violin sounds better than ever. Very professional service.",
    date: new Date("2026-01-28"),
  },
  {
    id: "rev-2",
    reviewerName: "Michael Rodriguez",
    reviewerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    contextNode: serviceContext("Full Setup", "Acoustic Guitar"),
    rating: 5,
    comment: "Amazing attention to detail. My guitar plays like new!",
    date: new Date("2026-01-25"),
  },
  {
    id: "rev-3",
    reviewerName: "Emily Carter",
    reviewerAvatar: "/music-teacher-woman-piano.jpg",
    contextNode: serviceContext("Piano Tuning", "Grand Piano"),
    rating: 4,
    comment: "Great tuning job. Will definitely use again.",
    date: new Date("2026-01-22"),
  },
  {
    id: "rev-4",
    reviewerName: "Robert Johnson",
    reviewerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    contextNode: serviceContext("Bow Rehair", "Cello Bow"),
    rating: 5,
    comment: "",
    date: new Date("2026-01-20"),
  },
  {
    id: "rev-5",
    reviewerName: "Lisa Wilson",
    reviewerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    contextNode: serviceContext("Crack Repair", "Violin"),
    rating: 5,
    comment: "Saved my daughter's violin! Can barely see where the crack was. Highly recommend!",
    date: new Date("2026-01-18"),
  },
]

export default function RepairerReviewsPage() {
  return (
    <ReviewsView
      subtitle="Feedback from your clients"
      emptyDescription="Reviews from clients will appear here after completed services"
      reviews={REVIEWS}
    />
  )
}
