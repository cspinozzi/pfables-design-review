"use client"

import { ReviewsView, type ReviewItem } from "@/components/views/reviews-view"

const REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    reviewerName: "Sarah Thompson",
    reviewerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    contextNode: "Piano Lesson with Emma",
    rating: 5,
    comment: "Amazing teacher! Emma has improved so much since starting lessons. Very patient and encouraging.",
    date: new Date("2026-01-28"),
  },
  {
    id: "rev-2",
    reviewerName: "Lisa Wilson",
    reviewerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    contextNode: "Music Theory Session with Jake",
    rating: 4,
    comment: "Great session. Jake learned a lot about reading sheet music.",
    date: new Date("2026-01-25"),
  },
  {
    id: "rev-3",
    reviewerName: "Ana Martinez",
    reviewerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    contextNode: "Piano Lesson with Sofia",
    rating: 5,
    comment: "Wonderful experience! Sofia looks forward to every lesson.",
    date: new Date("2026-01-22"),
  },
  {
    id: "rev-4",
    reviewerName: "Robert Johnson",
    reviewerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    contextNode: "Piano Lesson with Mia",
    rating: 5,
    comment: "",
    date: new Date("2026-01-20"),
  },
  {
    id: "rev-5",
    reviewerName: "Jennifer Davis",
    reviewerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    contextNode: "Music Theory Session with Oliver",
    rating: 4,
    comment: "Very knowledgeable teacher. Would recommend!",
    date: new Date("2026-01-18"),
  },
]

export default function ProviderReviewsPage() {
  return (
    <ReviewsView
      subtitle="Feedback from your students' parents"
      emptyDescription="Reviews from parents will appear here after lessons"
      reviews={REVIEWS}
    />
  )
}
