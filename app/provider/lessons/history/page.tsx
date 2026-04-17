"use client"

import { useMemo } from "react"
import {
  LessonsHistoryView,
  type LessonHistoryEntry,
} from "@/components/views/lessons-history-view"
import { useLessonCompletion } from "@/lib/lesson-completion-context"

// Seed data mirrors the completed-with-topic lessons from the provider lessons page,
// plus extra past sessions so the "by student" filter has something meaningful to show.
const SEEDED_HISTORY: LessonHistoryEntry[] = [
  {
    id: "lesson-c1",
    title: "Piano Lesson",
    date: new Date(2026, 0, 30),
    topic: "Major scales and sight-reading basics",
    providerNote:
      "Emma picked up the C and G major scales quickly. Homework: practice both hands together at 60 BPM.",
    counterpart: "Emma Thompson (Sarah Thompson)",
    counterpartAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    filterKey: "Emma Thompson",
  },
  {
    id: "lesson-past-emma-1",
    title: "Piano Lesson",
    date: new Date(2026, 0, 23),
    topic: "Hand independence drills — Hanon exercises 1-3",
    providerNote: "Good progress on right-hand articulation. Left hand still rushes.",
    counterpart: "Emma Thompson (Sarah Thompson)",
    counterpartAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    filterKey: "Emma Thompson",
  },
  {
    id: "lesson-past-emma-2",
    title: "Piano Lesson",
    date: new Date(2026, 0, 16),
    topic: "Introduction to pedaling and legato phrasing",
    counterpart: "Emma Thompson (Sarah Thompson)",
    counterpartAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    filterKey: "Emma Thompson",
  },
  {
    id: "lesson-c2",
    title: "Music Theory Session",
    date: new Date(2026, 0, 29),
    topic: "Chord progressions and circle of fifths",
    providerNote: "Jake memorized the circle clockwise. Next session we tackle minor keys.",
    counterpart: "Jake Wilson (Lisa Wilson)",
    counterpartAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    filterKey: "Jake Wilson",
  },
  {
    id: "lesson-past-jake-1",
    title: "Music Theory Session",
    date: new Date(2026, 0, 22),
    topic: "Interval recognition drills",
    providerNote: "Perfect fourths vs fifths is still tricky — assigned ear-training app daily.",
    counterpart: "Jake Wilson (Lisa Wilson)",
    counterpartAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    filterKey: "Jake Wilson",
  },
  {
    id: "lesson-c3",
    title: "Piano Lesson",
    date: new Date(2026, 0, 28),
    topic: "Introduction to arpeggios and hand coordination",
    providerNote: "Sophia is ready to move to two-octave arpeggios next week.",
    counterpart: "Sophia Martinez (Ana Martinez)",
    counterpartAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    filterKey: "Sophia Martinez",
  },
  {
    id: "lesson-past-sophia-1",
    title: "Piano Lesson",
    date: new Date(2026, 0, 21),
    topic: "Reading treble and bass clef together",
    counterpart: "Sophia Martinez (Ana Martinez)",
    counterpartAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    filterKey: "Sophia Martinez",
  },
  {
    id: "lesson-past-oliver-1",
    title: "Violin Lesson",
    date: new Date(2026, 0, 27),
    topic: "Bow grip and open-string tone production",
    providerNote: "Oliver's tone is already clean on open D and A. Working on A-string 4th finger.",
    counterpart: "Oliver Chen (Mei Chen)",
    counterpartAvatar:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100&h=100&fit=crop",
    filterKey: "Oliver Chen",
  },
  {
    id: "lesson-past-oliver-2",
    title: "Violin Lesson",
    date: new Date(2026, 0, 20),
    topic: "Posture and left-hand position",
    counterpart: "Oliver Chen (Mei Chen)",
    counterpartAvatar:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100&h=100&fit=crop",
    filterKey: "Oliver Chen",
  },
  {
    id: "lesson-past-noah-1",
    title: "Drum Lesson",
    date: new Date(2026, 0, 26),
    topic: "Single-stroke roll warm-ups and rudiment practice",
    providerNote: "Great stick control for a first-year student. Try practicing to a metronome.",
    counterpart: "Noah Brooks (Rachel Brooks)",
    counterpartAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    filterKey: "Noah Brooks",
  },
]

export default function ProviderLessonsHistoryPage() {
  const { completedLessons } = useLessonCompletion()

  // Merge the persisted completions (lessons the provider just marked complete via the
  // dialog) with the seeded mock data, de-duping by id so a freshly completed lesson
  // doesn't appear twice.
  const entries = useMemo<LessonHistoryEntry[]>(() => {
    const contextEntries: LessonHistoryEntry[] = completedLessons
      .filter((l) => l.topic)
      .map((l) => ({
        id: l.id,
        title: l.title,
        date: l.completedAt,
        topic: l.topic,
        providerNote: l.comment,
        counterpart: `${l.student} (${l.parent})`,
        counterpartAvatar: l.studentAvatar,
        filterKey: l.student,
      }))

    const seen = new Set(contextEntries.map((e) => e.id))
    const seeded = SEEDED_HISTORY.filter((e) => !seen.has(e.id))
    return [...contextEntries, ...seeded]
  }, [completedLessons])

  return (
    <LessonsHistoryView
      heading="Lessons History"
      description="Every completed lesson with the topic covered and any notes you left — grouped so you can track progress per student."
      filterAllLabel="All students"
      emptyTitle="No completed lessons yet"
      emptyDescription="Once you complete a lesson and log its topic, it will show up here."
      backHref="/provider/lessons"
      backLabel="Back to Lessons"
      entries={entries}
    />
  )
}
