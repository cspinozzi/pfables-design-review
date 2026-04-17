"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, Calendar, MessageSquare } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface LessonHistoryEntry {
  id: string
  title: string
  date: Date
  topic: string
  providerNote?: string
  /** Counterpart label shown under the title (e.g. student "Emma (Sarah)" for providers,
   *  provider name like "Emily Carter" for parents). */
  counterpart: string
  counterpartAvatar?: string
  /** Dimension used for the header filter — student name for providers, instrument for parents. */
  filterKey: string
}

export interface LessonsHistoryViewProps {
  /** Page title shown at the top of the view. */
  heading: string
  /** Short description rendered under the heading. */
  description: string
  /** Label shown inside the filter select trigger when "all" is active. */
  filterAllLabel: string
  /** Placeholder used when no lessons exist at all. */
  emptyTitle: string
  emptyDescription: string
  /** Where the "Back" link should go (usually the base lessons route). */
  backHref: string
  backLabel: string
  /** All completed lessons with a registered topic. */
  entries: LessonHistoryEntry[]
}

function formatDate(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export function LessonsHistoryView({
  heading,
  description,
  filterAllLabel,
  emptyTitle,
  emptyDescription,
  backHref,
  backLabel,
  entries,
}: LessonsHistoryViewProps) {
  const [filter, setFilter] = useState<string>("all")

  // Distinct filter options, sorted for consistency.
  const filterOptions = useMemo(() => {
    const set = new Set<string>()
    entries.forEach((e) => set.add(e.filterKey))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [entries])

  // Most recent first, filtered by the chosen dimension.
  const visibleEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime())
    return filter === "all" ? sorted : sorted.filter((e) => e.filterKey === filter)
  }, [entries, filter])

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-12">
      <div className="page-container pt-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground">{heading}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Filter row */}
        {entries.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-muted-foreground shrink-0">Filter:</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-56 rounded-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{filterAllLabel}</SelectItem>
                {filterOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">
              {visibleEntries.length} {visibleEntries.length === 1 ? "lesson" : "lessons"}
            </span>
          </div>
        )}

        {visibleEntries.length > 0 ? (
          <div className="space-y-3">
            {visibleEntries.map((entry) => (
              <Card
                key={entry.id}
                className="p-4 sm:p-5 rounded-xl hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
                  {/* Date column */}
                  <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:min-w-[140px] shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span suppressHydrationWarning>{formatDate(entry.date)}</span>
                    </div>
                  </div>

                  {/* Divider on desktop */}
                  <div className="hidden sm:block w-px bg-border self-stretch" />

                  {/* Content column */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{entry.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                          {entry.counterpartAvatar && (
                            <span className="relative h-4 w-4 rounded-full overflow-hidden bg-muted shrink-0">
                              <Image
                                src={entry.counterpartAvatar}
                                alt={entry.counterpart}
                                fill
                                sizes="16px"
                                className="object-cover"
                              />
                            </span>
                          )}
                          <span className="truncate">{entry.counterpart}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-xs text-muted-foreground">Topic covered</span>
                        <p className="text-foreground leading-relaxed">{entry.topic}</p>
                      </div>
                    </div>

                    {entry.providerNote && (
                      <div className="flex items-start gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="text-xs text-muted-foreground">Provider notes</span>
                          <p className="text-muted-foreground leading-relaxed">{entry.providerNote}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : entries.length > 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">No lessons match this filter</h3>
            <p className="text-sm text-muted-foreground">Try a different option above.</p>
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-1">{emptyTitle}</h3>
            <p className="text-sm text-muted-foreground">{emptyDescription}</p>
          </Card>
        )}
      </div>
    </div>
  )
}
