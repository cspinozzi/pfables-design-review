"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Undo2 } from "lucide-react"
import { mockProviders } from "@/lib/mock-data"
import { ProviderCard } from "@/components/provider-card"

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(["provider-1", "provider-3"])
  const [pendingRemovals, setPendingRemovals] = useState<Map<string, { providerId: string; providerName: string }>>(new Map())
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const favoriteProviders = mockProviders.filter((p) => favoriteIds.includes(p.id))

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer)
      }
    }
  }, [])

  const startRemoval = useCallback((providerId: string) => {
    const provider = mockProviders.find((p) => p.id === providerId)
    const providerName = provider?.name || ""

    const timerId = setTimeout(() => {
      setFavoriteIds((prev) => prev.filter((id) => id !== providerId))
      setPendingRemovals((prev) => {
        const next = new Map(prev)
        next.delete(providerId)
        return next
      })
      timersRef.current.delete(providerId)
    }, 5000)

    timersRef.current.set(providerId, timerId)
    setPendingRemovals((prev) => {
      const next = new Map(prev)
      next.set(providerId, { providerId, providerName })
      return next
    })
  }, [])

  const undoRemoval = useCallback((providerId: string) => {
    const timer = timersRef.current.get(providerId)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(providerId)
    }
    setPendingRemovals((prev) => {
      const next = new Map(prev)
      next.delete(providerId)
      return next
    })
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground">My Favorites</h1>
          <p className="text-sm text-muted-foreground">Teachers you've saved for easy access</p>
        </div>

        {/* Empty State */}
        {favoriteProviders.length === 0 && pendingRemovals.size === 0 && (
          <Card className="p-12 text-center">
            <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No favorites yet</h3>
            <p className="mb-6 text-muted-foreground">
              Start adding teachers to your favorites to easily find them later
            </p>
            <Button asChild>
              <Link href="/browse">Browse Lessons</Link>
            </Button>
          </Card>
        )}

        {/* Favorites List */}
        <div className="space-y-6 sm:space-y-8">
          {favoriteProviders.map((provider) => {
            const isPending = pendingRemovals.has(provider.id)

            if (isPending) {
              return (
                <Card key={provider.id} className="overflow-hidden animate-in fade-in duration-300">
                  <div className="flex items-center justify-between gap-4 p-6">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{provider.name}</span> removed from favorites
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => undoRemoval(provider.id)}
                      className="gap-2 text-primary hover:text-primary"
                    >
                      <Undo2 className="h-4 w-4" />
                      Undo
                    </Button>
                  </div>
                </Card>
              )
            }

            return (
              <ProviderCard
                key={provider.id}
                provider={provider}
                isFavorited
                onToggleFavorite={startRemoval}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
