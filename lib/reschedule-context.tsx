"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

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
  rescheduledIds: Set<string>
  rescheduledLessons: RescheduledLesson[]
  addReschedule: (lesson: RescheduledLesson) => void
  removeReschedule: (id: string) => void
  isRescheduled: (id: string) => boolean
}

const defaultContext: RescheduleContextType = {
  rescheduledIds: new Set(),
  rescheduledLessons: [],
  addReschedule: () => {},
  removeReschedule: () => {},
  isRescheduled: () => false,
}

const RescheduleContext = createContext<RescheduleContextType>(defaultContext)

export function RescheduleProvider({ children }: { children: ReactNode }) {
  const [rescheduledLessons, setRescheduledLessons] = useState<RescheduledLesson[]>([])

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

  const rescheduledIds = new Set(rescheduledLessons.map((l) => l.id))

  return (
    <RescheduleContext.Provider value={{ rescheduledIds, rescheduledLessons, addReschedule, removeReschedule, isRescheduled }}>
      {children}
    </RescheduleContext.Provider>
  )
}

export function useReschedule() {
  return useContext(RescheduleContext)
}
