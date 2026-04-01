"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

export interface RescheduledLesson {
  id: string
  title: string
  parentName: string
  parentAvatar: string
  childName: string
  newDate: Date
  newTime: string
  duration: string
  location: string
  rescheduledAt: Date
}

interface RescheduleContextType {
  // Parent-initiated reschedules (shown as badge on provider side)
  rescheduledIds: Set<string>
  rescheduledLessons: RescheduledLesson[]
  addReschedule: (lesson: RescheduledLesson) => void
  removeReschedule: (id: string) => void
  isRescheduled: (id: string) => boolean
  // Provider-initiated reschedules (shown as pending action on parent side)
  providerReschedules: RescheduledLesson[]
  addProviderReschedule: (lesson: RescheduledLesson) => void
  removeProviderReschedule: (id: string) => void
  getProviderReschedule: (id: string) => RescheduledLesson | undefined
}

const defaultContext: RescheduleContextType = {
  rescheduledIds: new Set(),
  rescheduledLessons: [],
  addReschedule: () => {},
  removeReschedule: () => {},
  isRescheduled: () => false,
  providerReschedules: [],
  addProviderReschedule: () => {},
  removeProviderReschedule: () => {},
  getProviderReschedule: () => undefined,
}

const RescheduleContext = createContext<RescheduleContextType>(defaultContext)

export function RescheduleProvider({ children }: { children: ReactNode }) {
  const [rescheduledLessons, setRescheduledLessons] = useState<RescheduledLesson[]>([])
  const [providerReschedules, setProviderReschedules] = useState<RescheduledLesson[]>([
    {
      id: "class-2",
      title: "Guitar Lesson",
      parentName: "Michael Rodriguez",
      parentAvatar: "/guitar-teacher-man.jpg",
      childName: "Jake",
      newDate: new Date(2026, 3, 3), // Apr 3, 2026
      newTime: "5:00 PM",
      duration: "60 min",
      location: "Online",
      rescheduledAt: new Date(2026, 2, 30),
    },
  ])

  const addReschedule = useCallback((lesson: RescheduledLesson) => {
    setRescheduledLessons((prev) => {
      const filtered = prev.filter((l) => l.id !== lesson.id)
      return [...filtered, lesson]
    })
  }, [])

  const removeReschedule = useCallback((id: string) => {
    setRescheduledLessons((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const isRescheduled = useCallback(
    (id: string) => rescheduledLessons.some((l) => l.id === id),
    [rescheduledLessons]
  )

  const addProviderReschedule = useCallback((lesson: RescheduledLesson) => {
    setProviderReschedules((prev) => {
      const filtered = prev.filter((l) => l.id !== lesson.id)
      return [...filtered, lesson]
    })
  }, [])

  const removeProviderReschedule = useCallback((id: string) => {
    setProviderReschedules((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const getProviderReschedule = useCallback(
    (id: string) => providerReschedules.find((l) => l.id === id),
    [providerReschedules]
  )

  const rescheduledIds = useMemo(() => new Set(rescheduledLessons.map((l) => l.id)), [rescheduledLessons])

  const contextValue = useMemo(() => ({
    rescheduledIds, rescheduledLessons, addReschedule, removeReschedule, isRescheduled,
    providerReschedules, addProviderReschedule, removeProviderReschedule, getProviderReschedule,
  }), [rescheduledIds, rescheduledLessons, addReschedule, removeReschedule, isRescheduled,
       providerReschedules, addProviderReschedule, removeProviderReschedule, getProviderReschedule])

  return (
    <RescheduleContext.Provider value={contextValue}>
      {children}
    </RescheduleContext.Provider>
  )
}

// No throw — context has a safe non-null default value
export function useReschedule() {
  return useContext(RescheduleContext)
}
