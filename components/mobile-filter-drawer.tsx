"use client"

import { useState } from "react"
import { X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MobileFilterDrawerProps {
  categoryFilter: string
  locationFilter: string
  onCategoryChange: (value: string) => void
  onLocationChange: (value: string) => void
}

export function MobileFilterDrawer({
  categoryFilter,
  locationFilter,
  onCategoryChange,
  onLocationChange,
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="lg"
        className="md:hidden w-full h-12 bg-transparent"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="mr-2 h-5 w-5" />
        Filters
      </Button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

          {/* Drawer Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-xl animate-in fade-in-0 duration-300">
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Category</label>
                  <Select value={categoryFilter} onValueChange={onCategoryChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="lessons">Music Lessons</SelectItem>
                      <SelectItem value="piano">Piano</SelectItem>
                      <SelectItem value="guitar">Guitar</SelectItem>
                      <SelectItem value="violin">Violin</SelectItem>
                      <SelectItem value="repair">Instrument Repair</SelectItem>
                      <SelectItem value="tuning">Piano Tuning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Location</label>
                  <Select value={locationFilter} onValueChange={onLocationChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="naperville">Naperville</SelectItem>
                      <SelectItem value="aurora">Aurora</SelectItem>
                      <SelectItem value="wheaton">Wheaton</SelectItem>
                      <SelectItem value="downers grove">Downers Grove</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12 bg-transparent"
                  onClick={() => {
                    onCategoryChange("all")
                    onLocationChange("all")
                  }}
                >
                  Clear All
                </Button>
                <Button className="flex-1 h-12" onClick={() => setIsOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
