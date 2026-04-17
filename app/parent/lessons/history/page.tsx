"use client"

import {
  LessonsHistoryView,
  type LessonHistoryEntry,
} from "@/components/views/lessons-history-view"

// Completed lessons the parent's children have taken, enriched with the topic the
// teacher logged and any provider notes. The filter at the top groups these entries
// by instrument so a parent can quickly see what their child has been learning.
const PARENT_HISTORY: LessonHistoryEntry[] = [
  {
    id: "ph-piano-1",
    title: "Piano Lesson",
    date: new Date(2026, 0, 30),
    topic: "Major scales and sight-reading basics",
    providerNote:
      "Emma picked up the C and G major scales quickly. Homework: practice both hands together at 60 BPM.",
    counterpart: "Emma · with Emily Carter",
    counterpartAvatar: "/music-teacher-woman-piano.jpg",
    filterKey: "Piano",
  },
  {
    id: "ph-piano-2",
    title: "Piano Lesson",
    date: new Date(2026, 0, 23),
    topic: "Hand independence drills — Hanon exercises 1-3",
    providerNote: "Good progress on right-hand articulation. Left hand still rushes.",
    counterpart: "Emma · with Emily Carter",
    counterpartAvatar: "/music-teacher-woman-piano.jpg",
    filterKey: "Piano",
  },
  {
    id: "ph-piano-3",
    title: "Piano Lesson",
    date: new Date(2026, 0, 16),
    topic: "Introduction to pedaling and legato phrasing",
    counterpart: "Emma · with Emily Carter",
    counterpartAvatar: "/music-teacher-woman-piano.jpg",
    filterKey: "Piano",
  },
  {
    id: "ph-piano-4",
    title: "Piano Lesson",
    date: new Date(2026, 0, 9),
    topic: "Finger numbering and basic 5-finger positions",
    providerNote: "Emma can now identify middle C confidently.",
    counterpart: "Emma · with Emily Carter",
    counterpartAvatar: "/music-teacher-woman-piano.jpg",
    filterKey: "Piano",
  },
  {
    id: "ph-theory-1",
    title: "Music Theory Session",
    date: new Date(2026, 0, 28),
    topic: "Chord progressions and circle of fifths",
    providerNote: "Jake memorized the circle clockwise. Next session we tackle minor keys.",
    counterpart: "Jake · with Michael Rodriguez",
    counterpartAvatar: "/guitar-teacher-man.jpg",
    filterKey: "Music Theory",
  },
  {
    id: "ph-theory-2",
    title: "Music Theory Session",
    date: new Date(2026, 0, 21),
    topic: "Interval recognition drills",
    providerNote: "Perfect fourths vs fifths is still tricky — try the ear-training app daily.",
    counterpart: "Jake · with Michael Rodriguez",
    counterpartAvatar: "/guitar-teacher-man.jpg",
    filterKey: "Music Theory",
  },
  {
    id: "ph-guitar-1",
    title: "Guitar Lesson",
    date: new Date(2026, 0, 25),
    topic: "Open chord shapes — G, C, D, Em",
    providerNote: "Jake can transition G → C cleanly. D chord needs fingertip adjustment.",
    counterpart: "Jake · with Michael Rodriguez",
    counterpartAvatar: "/guitar-teacher-man.jpg",
    filterKey: "Guitar",
  },
  {
    id: "ph-guitar-2",
    title: "Guitar Lesson",
    date: new Date(2026, 0, 18),
    topic: "Strumming patterns in 4/4 time",
    counterpart: "Jake · with Michael Rodriguez",
    counterpartAvatar: "/guitar-teacher-man.jpg",
    filterKey: "Guitar",
  },
  {
    id: "ph-violin-1",
    title: "Violin Lesson",
    date: new Date(2026, 0, 27),
    topic: "Bow grip and open-string tone production",
    providerNote: "Bow hold is looking natural. Keep practicing open strings for 10 min a day.",
    counterpart: "Emma · with Sarah Kim",
    counterpartAvatar: "/avatars/sarah-kim.jpg",
    filterKey: "Violin",
  },
]

export default function ParentLessonsHistoryPage() {
  return (
    <LessonsHistoryView
      heading="Lessons History"
      description="Follow along with what your kids have been learning — every completed lesson with the topic covered and any notes from their teachers."
      filterAllLabel="All instruments"
      emptyTitle="No completed lessons yet"
      emptyDescription="Once teachers complete a lesson and log its topic, it will show up here."
      backHref="/parent/coming"
      backLabel="Back to Lessons"
      entries={PARENT_HISTORY}
    />
  )
}
