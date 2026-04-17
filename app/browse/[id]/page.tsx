"use client"
import { use, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Star, Phone, Mail, Clock, Award, CheckCircle2, MessageCircle, ArrowLeft, Heart, Calendar, CalendarDays, User, XCircle, AlertCircle, DollarSign, BookOpen, CreditCard, Send, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VerificationBadge } from "@/components/verification-badge"
import { CategoryIcon } from "@/components/category-icon"
import dynamic from "next/dynamic"
import { ServiceCard } from "@/components/service-card"
import { ProfileAvatarUpload } from "@/components/profile-avatar-upload"
import { Card } from "@/components/ui/card"
import { mockProviders, mockUsers, mockConversations } from "@/lib/mock-data"
const ServiceDetailModal = dynamic(() => import("@/components/service-detail-modal").then(m => ({ default: m.ServiceDetailModal })), { ssr: false })
const BookingModal = dynamic(() => import("@/components/booking-modal").then(m => ({ default: m.BookingModal })), { ssr: false })

export default function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const provider = mockProviders.find((p) => p.id === id) || mockProviders.find((p) => p.userId === id)
  const [activeTab, setActiveTab] = useState<"reviews" | "services" | "about" | "credentials">("reviews")
  const [isFavorited, setIsFavorited] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Map credential names to placeholder certificate images
  const credentialImageMap: Record<string, string> = {
    "Bachelor of Music Education": "/images/credentials/bachelor-music-education.jpg",
    "MTNA Certified": "/images/credentials/mtna-certified.jpg",
    "Berklee College of Music Graduate": "/images/credentials/berklee-graduate.jpg",
    "Suzuki Association Certified": "/images/credentials/suzuki-certified.jpg",
    "Masters in Music Performance": "/images/credentials/generic-certificate.jpg",
  }

  const getCredentialImage = (cred: string) =>
    credentialImageMap[cred] || "/images/credentials/generic-certificate.jpg"
  const [reviews, setReviews] = useState([
    { id: "r1", author: "Sarah Thompson", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", rating: 5, date: new Date("2026-01-28"), text: "Fantastic teacher! My daughter has improved so much in just a few months. Very patient and professional." },
    { id: "r2", author: "Mike Wilson", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", rating: 5, date: new Date("2026-01-20"), text: "Excellent experience. Great communication and really connects with kids. Highly recommend!" },
    { id: "r3", author: "Ana Martinez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", rating: 4, date: new Date("2026-01-12"), text: "Very knowledgeable and structured lessons. My son looks forward to every session." },
    { id: "r4", author: "David Lee", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", rating: 5, date: new Date("2025-12-15"), text: "We have been working together for over a year now. Consistent quality and genuine care for student progress." },
    { id: "r5", author: "Jessica Park", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", rating: 4, date: new Date("2025-11-30"), text: "Good lessons overall. Flexible with scheduling and accommodating with location." },
  ])
  const [newReviewRating, setNewReviewRating] = useState(0)
  const [newReviewHover, setNewReviewHover] = useState(0)
  const [newReviewText, setNewReviewText] = useState("")

  const handleSubmitReview = () => {
    if (newReviewRating === 0 || !newReviewText.trim()) return
    const newReview = {
      id: `r-${Date.now()}`,
      author: "You",
      avatar: "",
      rating: newReviewRating,
      date: new Date(),
      text: newReviewText.trim(),
    }
    setReviews((prev) => [newReview, ...prev])
    setNewReviewRating(0)
    setNewReviewText("")
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0"

  const handleMessage = () => {
    if (!provider) return
    const conv = mockConversations.find((c) =>
      c.participants.some((p) => p.id === provider.userId)
    )
    if (conv) {
      router.push(`/messages?conv=${conv.id}`)
    } else {
      router.push("/messages")
    }
  }

  // If no provider found, check if it's a parent user
  if (!provider) {
    const parentUser = mockUsers.find((u) => u.id === id)
    if (parentUser) {
      return <ParentProfileView parentUser={parentUser} router={router} />
    }

    return (
      <div className="min-h-screen bg-background px-6 py-20 text-center pt-28">
        <h1 className="mb-4 font-display text-2xl font-medium">User Not Found</h1>
        <Button onClick={() => router.push("/browse")}>Back to Browse</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container">
        {/* Horizontal Banner Header */}
        <div className="px-4 py-5 sm:px-6 md:px-8 md:pl-0 md:pr-0 pt-10 pb-10">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full glass-button flex-shrink-0 mt-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Profile Picture */}
            <ProfileAvatarUpload
              src={provider.avatar}
              name={provider.name}
              size="lg"
            />

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              {/* Name, Verification, and Tags Row */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{provider.name}</h1>
                {provider.verified && (
                  <VerificationBadge 
                    status={provider.backgroundCheckStatus} 
                    showLabel={false} 
                    size="md" 
                    filled={provider.subscriptionTier === "featured" || provider.subscriptionTier === "premium"}
                  />
                )}
                {provider.specialty.slice(0, 2).map((spec) => (
                  <Badge key={spec} variant="secondary" className="rounded-full hidden sm:inline-flex">
                    {spec}
                  </Badge>
                ))}
              </div>

              {/* Location and Experience */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>{provider.yearsExperience} years experience</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-2 mb-3">{provider.bio}</p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold">{provider.rating}</span>
                  <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                </div>
                <div className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{provider.serviceArea.length}</span> service areas
                </div>
                <div className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{provider.services.length}</span> services
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Below, Right Aligned */}
          <div className="flex gap-2 justify-end mt-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsFavorited(!isFavorited)}
              className={`rounded-full glass-button ${isFavorited ? "text-red-500 hover:text-red-600" : ""}`}
            >
              <Heart className={`h-4 w-4 sm:mr-2 ${isFavorited ? "fill-red-500" : ""}`} />
              <span className="hidden sm:inline">{isFavorited ? "Saved" : "Favorite"}</span>
            </Button>
            <Button size="sm" variant="ghost" className="rounded-full glass-button">
              <Phone className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Call</span>
            </Button>
            <Button size="sm" onClick={handleMessage} className="rounded-full glass-button !bg-primary/90 !border-primary/50 text-primary-foreground hover:!bg-primary">
              <MessageCircle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Message</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setBookingOpen(true)}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CalendarDays className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{provider.providerType === "teacher" ? "Reserve Lesson" : "Hire Service"}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Tags - Show all tags on mobile below header */}
        <div className="sm:hidden border-b bg-background px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {provider.specialty.map((spec) => (
              <Badge key={spec} variant="secondary" className="rounded-full">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm px-6 md:px-8">
          <div className="flex items-center gap-6">
            {[
              { key: "reviews", label: "Reviews" },
              { key: "services", label: "Services" },
              { key: "about", label: "About" },
              { key: "credentials", label: "Credentials" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "reviews" | "services" | "about" | "credentials")}
                className={`pb-3 pt-4 text-sm transition-all border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground font-medium"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-8 md:px-8">
          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-3">
              {provider.services.map((service) => (
                <div key={service.id} className="rounded-xl border p-4 transition-colors hover:bg-muted/50 md:p-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <CategoryIcon category={service.category} className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold">{service.name}</h3>
                      <p className="mb-3 text-muted-foreground">{service.description}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-lg font-semibold text-primary">{service.pricing}</span>
                        <Badge variant="outline" className="rounded-full">
                          {service.location === "in-home"
                            ? "In-Home"
                            : service.location === "in-studio"
                              ? "In-Studio"
                              : "In-Home & In-Studio"}
                        </Badge>
                        <Button
                          size="sm"
                          className="ml-auto rounded-full"
                          onClick={() => {
                            setBookingOpen(true)
                          }}
                        >
                          {provider.providerType === "teacher" ? "Reserve" : "Hire"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold">{averageRating}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              </div>

              {/* Write a Review */}
              <div className="rounded-xl border p-4 md:p-6 mb-6">
                <h3 className="font-semibold mb-3">Write a Review</h3>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      onMouseEnter={() => setNewReviewHover(star)}
                      onMouseLeave={() => setNewReviewHover(0)}
                      className="p-0.5 transition-transform hover:scale-110"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= (newReviewHover || newReviewRating)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground/30"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  {newReviewRating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {newReviewRating === 1 ? "Poor" : newReviewRating === 2 ? "Fair" : newReviewRating === 3 ? "Good" : newReviewRating === 4 ? "Very Good" : "Excellent"}
                    </span>
                  )}
                </div>
                <Textarea
                  placeholder="Share your experience..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="mb-3 resize-none"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmitReview}
                    disabled={newReviewRating === 0 || !newReviewText.trim()}
                    className="rounded-full gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Submit Review
                  </Button>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border p-4 md:p-6">
                    <div className="flex items-start gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                        {review.avatar ? (
                          <Image src={review.avatar} alt={review.author} fill sizes="40px" className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{review.author}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {review.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 mt-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= review.rating ? "fill-accent text-accent" : "text-muted-foreground/20"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold">Availability</h3>
                <div className="flex items-start gap-3 rounded-xl border p-4">
                  <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">{provider.availability}</span>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold">Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.serviceArea.map((area) => (
                    <Badge key={area} variant="outline" className="rounded-full px-4 py-1.5">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold">Contact</h3>
                <div className="space-y-3">
                  <a
                    href={`tel:${provider.phone}`}
                    className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-medium">{provider.phone}</span>
                  </a>
                  <a
                    href={`mailto:${provider.email}`}
                    className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50"
                  >
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-medium">{provider.email}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Credentials Tab */}
          {activeTab === "credentials" && (
            <div className="space-y-3">
              {provider.credentials.map((cred, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-primary/10 hover:border-primary/30 group cursor-pointer"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />
                  <span className="flex-1 text-muted-foreground group-hover:text-foreground transition-colors">{cred}</span>
                  <ZoomIn className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Credential Lightbox */}
          {lightboxIndex !== null && provider && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setLightboxIndex(null)}
              role="dialog"
              aria-modal="true"
              aria-label={`Credential: ${provider.credentials[lightboxIndex]}`}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Navigation arrows */}
              {provider.credentials.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxIndex(
                        lightboxIndex === 0
                          ? provider.credentials.length - 1
                          : lightboxIndex - 1
                      )
                    }}
                    className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                    aria-label="Previous credential"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxIndex(
                        lightboxIndex === provider.credentials.length - 1
                          ? 0
                          : lightboxIndex + 1
                      )
                    }}
                    className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                    aria-label="Next credential"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Credential image + label */}
              <div
                className="flex max-h-[85vh] max-w-[90vw] flex-col items-center gap-4 sm:max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="overflow-hidden rounded-xl shadow-2xl">
                  <Image
                    src={getCredentialImage(provider.credentials[lightboxIndex])}
                    alt={provider.credentials[lightboxIndex]}
                    width={800}
                    height={600}
                    className="h-auto max-h-[70vh] w-auto object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-base font-medium text-white">
                    {provider.credentials[lightboxIndex]}
                  </p>
                  {provider.credentials.length > 1 && (
                    <p className="mt-1 text-sm text-white/50">
                      {lightboxIndex + 1} of {provider.credentials.length}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        provider={provider}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  )
}

// ------------------------------------------------------------------
// Parent Profile View (extracted for readability)
// ------------------------------------------------------------------

interface ParentProfileViewProps {
  parentUser: import("@/lib/mock-data").User
  router: ReturnType<typeof useRouter>
}

function ParentProfileView({ parentUser, router }: ParentProfileViewProps) {
  const [activeSection, setActiveSection] = useState<"account" | "lessons" | "payments">("account")
  const [selectedItem, setSelectedItem] = useState<{ title: string; subtitle?: string; status: string; price?: string; student?: string; date: Date; time?: string; duration?: string; location?: string; provider?: string; providerAvatar?: string } | null>(null)

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

  // Mock lessons tied to this parent
  const [lessons, setLessons] = useState([
    { id: "l-1", title: "Piano Lesson", provider: "Emily Carter", providerAvatar: "/music-teacher-woman-piano.jpg", student: "Emma", date: new Date("2026-02-10"), time: "4:00 PM", duration: "45 min", location: "Naperville, IL", rate: 65, status: "active" as const },
    { id: "l-2", title: "Piano Lesson", provider: "Emily Carter", providerAvatar: "/music-teacher-woman-piano.jpg", student: "Emma", date: new Date("2026-02-17"), time: "4:00 PM", duration: "45 min", location: "Naperville, IL", rate: 65, status: "active" as const },
    { id: "l-3", title: "Drum Lesson", provider: "Marcus Rivera", providerAvatar: "/avatars/marcus-rivera.jpg", student: "Liam", date: new Date("2026-02-12"), time: "5:00 PM", duration: "30 min", location: "Naperville, IL", rate: 55, status: "active" as const },
    { id: "l-4", title: "Piano Lesson", provider: "Emily Carter", providerAvatar: "/music-teacher-woman-piano.jpg", student: "Emma", date: new Date("2026-01-30"), time: "4:00 PM", duration: "45 min", location: "Naperville, IL", rate: 65, status: "completed" as const, topic: "Legato technique and pedaling", review: 5 },
    { id: "l-5", title: "Piano Lesson", provider: "Emily Carter", providerAvatar: "/music-teacher-woman-piano.jpg", student: "Emma", date: new Date("2026-01-23"), time: "4:00 PM", duration: "45 min", location: "Naperville, IL", rate: 65, status: "completed" as const, topic: "Major scales and sight-reading basics", review: 4 },
    { id: "l-6", title: "Music Theory", provider: "Emily Carter", providerAvatar: "/music-teacher-woman-piano.jpg", student: "Emma", date: new Date("2026-01-16"), time: "3:00 PM", duration: "30 min", location: "Online", rate: 45, status: "completed" as const, topic: "Note values and time signatures", review: 5 },
    { id: "l-7", title: "Drum Lesson", provider: "Marcus Rivera", providerAvatar: "/avatars/marcus-rivera.jpg", student: "Liam", date: new Date("2026-01-20"), time: "5:00 PM", duration: "30 min", location: "Naperville, IL", rate: 55, status: "cancelled" as const },
  ])

  const handleLessonStatusChange = (id: string, newStatus: "active" | "completed" | "cancelled") => {
    setLessons((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l))
  }

  const activeLessons = lessons.filter((l) => l.status === "active")
  const completedLessons = lessons.filter((l) => l.status === "completed" || l.status === "cancelled")

  // Mock payments tied to this parent
  const payments = [
    { id: "p-1", provider: "Emily Carter", providerAvatar: "/music-teacher-woman-piano.jpg", service: "Piano Lesson", amount: 65, date: new Date("2026-01-30"), status: "paid" as const, student: "Emma" },
    { id: "p-2", provider: "Emily Carter", providerAvatar: "/music-teacher-woman-piano.jpg", service: "Piano Lesson", amount: 65, date: new Date("2026-01-23"), status: "paid" as const, student: "Emma" },
    { id: "p-3", provider: "Emily Carter", providerAvatar: "/music-teacher-woman-piano.jpg", service: "Music Theory", amount: 45, date: new Date("2026-01-16"), status: "paid" as const, student: "Emma" },
    { id: "p-4", provider: "Marcus Rivera", providerAvatar: "/avatars/marcus-rivera.jpg", service: "Drum Lesson", amount: 55, date: new Date("2026-02-10"), status: "pending" as const, student: "Liam" },
    { id: "p-5", provider: "Emily Carter", providerAvatar: "/music-teacher-woman-piano.jpg", service: "Piano Lesson", amount: 65, date: new Date("2026-02-10"), status: "pending" as const, student: "Emma" },
    { id: "p-6", provider: "Jake Patterson", providerAvatar: "/avatars/jake-patterson.jpg", service: "Guitar Repair", amount: 95, date: new Date("2026-01-15"), status: "paid" as const, student: "" },
  ]

  const paidPayments = payments.filter((p) => p.status === "paid")
  const pendingPayments = payments.filter((p) => p.status === "pending")
  const totalPaid = paidPayments.reduce((s, p) => s + p.amount, 0)
  const totalPending = pendingPayments.reduce((s, p) => s + p.amount, 0)

  const sections = [
    { key: "account" as const, label: "Account", icon: <User className="h-4 w-4" /> },
    { key: "lessons" as const, label: "Lessons", icon: <BookOpen className="h-4 w-4" /> },
    { key: "payments" as const, label: "Payments", icon: <CreditCard className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 md:px-8 md:pl-0 md:pr-0 pt-10 pb-10">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full glass-button flex-shrink-0 mt-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Profile Picture */}
            <ProfileAvatarUpload
              src={parentUser.avatar}
              name={parentUser.name}
              size="lg"
            />

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{parentUser.name}</h1>
              {parentUser.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{parentUser.location}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">Member since {parentUser.joinedDate}</p>
            </div>
          </div>

          {/* Action Buttons - Below, Right Aligned */}
          <div className="flex gap-2 justify-end mt-4">
            <Button
              size="sm"
              onClick={() => {
                const conv = mockConversations.find((c) =>
                  c.participants.some((p) => p.id === parentUser.id)
                )
                router.push(conv ? `/messages?conv=${conv.id}` : "/messages")
              }}
              className="rounded-full glass-button !bg-primary/90 !border-primary/50 text-primary-foreground hover:!bg-primary"
            >
              <MessageCircle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Message</span>
            </Button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 md:px-8 md:pl-0 pb-6">
          {sections.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeSection === s.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        <Separator />

        {/* ---- ACCOUNT ---- */}
        {activeSection === "account" && (
          <div className="px-4 py-8 sm:px-6 md:px-8 md:pl-0 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border p-4">
              <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{parentUser.email}</p>
              </div>
            </div>
            {parentUser.location && (
              <div className="flex items-start gap-3 rounded-xl border p-4">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{parentUser.location}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 rounded-xl border p-4">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{parentUser.joinedDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* ---- LESSONS ---- */}
        {activeSection === "lessons" && (
          <div className="px-4 py-8 sm:px-6 md:px-8 md:pl-0">
            {/* Summary Stats */}
            <div className="grid gap-3 sm:grid-cols-2 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{activeLessons.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedLessons.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Lesson sections */}
            {activeLessons.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Active</h3>
                <div className="space-y-3">
                  {activeLessons.map((lesson) => (
                    <ServiceCard
                      key={lesson.id}
                      image={lesson.providerAvatar}
                      imageAlt={lesson.provider}
                      title={lesson.title}
                      subtitle={lesson.provider}
                      price={`$${lesson.rate}`}
                      status={lesson.status}
                      hideStatusFor={["active"]}
                      onClick={() => setSelectedItem({ title: lesson.title, subtitle: lesson.provider, status: lesson.status, price: `$${lesson.rate}`, student: lesson.student, date: lesson.date, time: lesson.time, duration: lesson.duration, location: lesson.location, provider: lesson.provider, providerAvatar: lesson.providerAvatar })}
                      details={
                        <>
                          <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{lesson.student}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(lesson.date)}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{lesson.time} ({lesson.duration})</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lesson.location}</span>
                        </>
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {completedLessons.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Completed & Cancelled</h3>
                <div className="space-y-3">
                  {completedLessons.map((lesson) => {
                    // For completed lessons that already have a review, replace the big
                    // "Completed" status chip with a tiny, discreet star + rating in the corner.
                    const showRatingBadge = lesson.status === "completed" && typeof lesson.review === "number"
                    return (
                      <ServiceCard
                        key={lesson.id}
                        image={lesson.providerAvatar}
                        imageAlt={lesson.provider}
                        title={lesson.title}
                        subtitle={lesson.provider}
                        price={`$${lesson.rate}`}
                        status={showRatingBadge ? undefined : lesson.status}
                        badge={
                          showRatingBadge
                            ? {
                                label: String(lesson.review),
                                icon: <Star className="h-3 w-3 fill-accent text-accent" />,
                                variant: "muted",
                              }
                            : undefined
                        }
                        onClick={() => setSelectedItem({ title: lesson.title, subtitle: lesson.provider, status: lesson.status, price: `$${lesson.rate}`, student: lesson.student, date: lesson.date, time: lesson.time, duration: lesson.duration, location: lesson.location, provider: lesson.provider, providerAvatar: lesson.providerAvatar })}
                        details={
                          <>
                            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{lesson.student}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(lesson.date)}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{lesson.time} ({lesson.duration})</span>
                            {lesson.topic && (
                              <span className="flex items-center gap-1 basis-full sm:basis-auto">
                                <BookOpen className="h-3.5 w-3.5" />
                                <span className="text-foreground">{lesson.topic}</span>
                              </span>
                            )}
                          </>
                        }
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- PAYMENTS ---- */}
        {activeSection === "payments" && (
          <div className="px-4 py-8 sm:px-6 md:px-8 md:pl-0">
            {/* Summary Stats */}
            <div className="grid gap-3 sm:grid-cols-3 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-2xl font-bold">${totalPaid}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">${totalPending}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold">{payments.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Paid section */}
            {paidPayments.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Completed</h3>
                <div className="space-y-3">
                  {paidPayments.map((tx) => (
                    <ServiceCard
                      key={tx.id}
                      image={tx.providerAvatar}
                      imageAlt={tx.provider}
                      title={tx.service}
                      subtitle={tx.provider}
                      badge={{ label: "Paid", variant: "success" as const, icon: <CheckCircle2 className="h-3 w-3" /> }}
                      onClick={() => setSelectedItem({ title: tx.service, subtitle: tx.provider, status: "paid", price: `$${tx.amount}`, student: tx.student, date: tx.date, provider: tx.provider, providerAvatar: tx.providerAvatar })}
                      details={
                        <>
                          <span>{formatDate(tx.date)}</span>
                          {tx.student && <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{tx.student}</span>}
                          <span className="font-semibold">${tx.amount}</span>
                        </>
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pending section */}
            {pendingPayments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pending</h3>
                <div className="space-y-3">
                  {pendingPayments.map((tx) => (
                    <ServiceCard
                      key={tx.id}
                      image={tx.providerAvatar}
                      imageAlt={tx.provider}
                      title={tx.service}
                      subtitle={tx.provider}
                      badge={{ label: "Pending", variant: "warning" as const, icon: <AlertCircle className="h-3 w-3" /> }}
                      onClick={() => setSelectedItem({ title: tx.service, subtitle: tx.provider, status: "pending", price: `$${tx.amount}`, student: tx.student, date: tx.date, provider: tx.provider, providerAvatar: tx.providerAvatar })}
                      details={
                        <>
                          <span>{formatDate(tx.date)}</span>
                          {tx.student && <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{tx.student}</span>}
                          <span className="font-semibold">${tx.amount}</span>
                        </>
                      }
                    />
                  ))}
                </div>
                <Card className="mt-4 p-4 border-amber-200 bg-amber-50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        {pendingPayments.length} pending payment{pendingPayments.length > 1 ? "s" : ""} (${totalPending})
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Payments are typically processed within 3-5 business days after service completion.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        {selectedItem && (
          <ServiceDetailModal
            open={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            title={selectedItem.title}
            subtitle={selectedItem.subtitle}
            status={selectedItem.status as "active" | "completed" | "cancelled" | "pending" | "paid" | "received"}
            people={[
              ...(selectedItem.provider ? [{ name: selectedItem.provider, role: "Provider", avatar: selectedItem.providerAvatar }] : []),
              ...(selectedItem.student ? [{ name: selectedItem.student, role: "Student" }] : []),
            ]}
            fields={[
              { icon: <Calendar className="h-4 w-4" />, label: "Date", value: formatDate(selectedItem.date) },
              ...(selectedItem.time ? [{ icon: <Clock className="h-4 w-4" />, label: "Time", value: `${selectedItem.time}${selectedItem.duration ? ` (${selectedItem.duration})` : ""}` }] : []),
              ...(selectedItem.location ? [{ icon: <MapPin className="h-4 w-4" />, label: "Location", value: selectedItem.location }] : []),
            ]}
            price={selectedItem.price}
          />
        )}
      </div>
    </div>
  )
}
