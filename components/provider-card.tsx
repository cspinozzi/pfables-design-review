'use client';

import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Phone, MessageCircle, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VerificationBadge } from "./verification-badge"
import type { Provider } from "@/lib/mock-data"

interface ProviderCardProps {
  provider: Provider
  isFavorited?: boolean
  onToggleFavorite?: (providerId: string) => void
}

export function ProviderCard({ provider, isFavorited, onToggleFavorite }: ProviderCardProps) {
  return (
    <Card className="overflow-hidden transition-colors hover:border-foreground/20">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <Link href={`/browse/${provider.id}`} className="relative h-48 w-full sm:h-auto sm:w-40 flex-shrink-0 cursor-pointer">
            <Image
              src={provider.avatar || "/placeholder.svg?height=200&width=200&query=music teacher"}
              alt={provider.name}
              fill
              className="object-cover transition-opacity hover:opacity-90"
            />
            {provider.subscriptionTier === "featured" || provider.subscriptionTier === "premium" ? (
              <div className="absolute right-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                Featured
              </div>
            ) : null}
          </Link>

          <div className="flex flex-1 flex-col p-6 sm:p-8 sm:px-12 sm:py-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              {/* Left: Name and Location */}
              <div className="flex items-center gap-3">
                <Link href={`/browse/${provider.id}`} className="font-display text-lg sm:text-xl font-medium hover:text-primary transition-colors">
                  {provider.name}
                </Link>
                {provider.verified && <VerificationBadge status={provider.backgroundCheckStatus} size="sm" />}
                <span className="text-muted-foreground">·</span>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                </div>
              </div>

              {/* Right: Rating + Favorite */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-medium">{provider.rating}</span>
                  <span className="text-sm text-muted-foreground">({provider.reviewCount})</span>
                </div>
                {onToggleFavorite && (
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(provider.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-500/15"
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500" : ""}`} />
                  </button>
                )}
              </div>
            </div>

            <ul className="mb-6 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span>{provider.yearsExperience}+ years of teaching experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span>{provider.credentials[0] || "Professional musician"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span>Serves {provider.serviceArea.slice(0, 2).join(", ")}{provider.serviceArea.length > 2 ? ` +${provider.serviceArea.length - 2} more` : ""}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span>{provider.specialty.join(", ")}</span>
              </li>
            </ul>

            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <Button asChild size="default" className="w-full sm:w-auto">
                <Link href={`/browse/${provider.id}`}>View profile</Link>
              </Button>
              <div className="flex gap-3">
                <Button asChild variant="outline" size="default" className="flex-1 sm:flex-initial bg-transparent">
                  <Link href={`/browse/${provider.id}?action=message`}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Message</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default" className="flex-1 sm:flex-initial bg-transparent">
                  <a href={`tel:${provider.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
