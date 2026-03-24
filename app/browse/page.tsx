"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProviderCard } from "@/components/provider-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockProviders } from "@/lib/mock-data"
import { getAllLocations } from "@/lib/locations"

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [profileTypeFilter, setProfileTypeFilter] = useState<string>("teacher")
  const locations = getAllLocations()

  // Base filter without profile type (for counting)
  const baseFilteredProviders = mockProviders.filter((provider) => {
    const matchesSearch =
      searchQuery === "" ||
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      provider.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      categoryFilter === "all" ||
      provider.services.some((s) => s.category === categoryFilter) ||
      provider.specialty.some((s) => s.toLowerCase().includes(categoryFilter))

    const matchesLocation =
      locationFilter === "all" ||
      provider.serviceArea.some((area) => area.toLowerCase().includes(locationFilter.toLowerCase()))

    return matchesSearch && matchesCategory && matchesLocation
  })

  // Count by profile type
  const teacherCount = baseFilteredProviders.filter((p) => p.providerType === "teacher").length
  const repairCount = baseFilteredProviders.filter((p) => p.providerType === "repair").length
  const luthierCount = baseFilteredProviders.filter((p) => p.providerType === "luthier").length

  // Final filtered list including profile type
  const filteredProviders = baseFilteredProviders.filter((provider) => {
    return profileTypeFilter === "all" || provider.providerType === profileTypeFilter
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="page-container pt-6 pb-4">
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground">Browse</h1>
          <p className="text-sm text-muted-foreground">
            Find music lessons and services in your area
          </p>
        </div>

        {/* Instrument Filters + Location */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">
            {["All", "Piano", "Guitar", "Violin", "Voice", "Drums", "Woodwinds", "Brass", "Theory"].map((instrument) => (
              <button
                key={instrument}
                type="button"
                onClick={() => setCategoryFilter(instrument.toLowerCase())}
                className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs sm:text-sm font-medium transition-all duration-200 ${
                  categoryFilter === instrument.toLowerCase()
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-secondary hover:border-primary/30"
                }`}
              >
                {instrument}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div id="made-for-everyone" className="page-container pb-12">

        {/* Results Header - Location + Profile Type Pills + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 mb-5">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-fit min-w-[130px] text-sm h-9">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            {[
              { key: "teacher", label: `Lessons (${teacherCount})` },
              { key: "repair", label: `Repair Services (${repairCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setProfileTypeFilter(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  profileTypeFilter === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="relative ml-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48"
              />
            </div>
          </div>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No results found matching your criteria.</p>
            <Button variant="link" onClick={() => setCategoryFilter("all")} className="mt-6">
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>

      {/* Big Footer CTA with Background Image */}
      <footer className="relative min-h-[70vh] flex flex-col overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/footer-guitar.jpg"
            alt="Guitar leaning on chair in cozy room"
            fill
            className="object-cover object-center"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/70 to-foreground/50" />
        </div>

        {/* CTA Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 text-white max-w-2xl mx-auto leading-tight">
              Ready to begin your musical journey?
            </h2>
            <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Take your time. We are here whenever you are ready to find the right teacher for you or your family.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 shadow-lg"
            >
              <Link href="/login">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="relative z-10 mt-auto">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-6">
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Image
                  src="/icon-dark.png"
                  alt="ProMusic"
                  width={24}
                  height={24}
                  className="h-5 w-5 shrink-0 object-contain"
                />
                <span>Your music companion</span>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 text-sm">
                <Link href="/login" className="text-white/60 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/login?role=provider" className="text-white/60 hover:text-white transition-colors">
                  Join as provider
                </Link>
                <Link href="/login?role=repair" className="text-white/60 hover:text-white transition-colors">
                  Join as repair service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
