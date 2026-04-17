"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

export interface CompletedLessonRecord {
  id: string
  title: string
  student: string
  studentAvatar: string
  parent: string
  parentAvatar?: string
  rate: number
  duration: string
  location: string
  originalDate: string
  topic: string
  comment?: string
  completedAt: Date
}

interface LessonCompletionContextType {
  completedLessons: CompletedLessonRecord[]
  completeLesson: (lesson: CompletedLessonRecord) => void
  isCompleted: (id: string) => boolean
  getCompletion: (id: string) => CompletedLessonRecord | undefined
}

const defaultContext: LessonCompletionContextType = {
  completedLessons: [],
  completeLesson: () => {},
  isCompleted: () => false,
  getCompletion: () => undefined,
}

const LessonCompletionContext = createContext<LessonCompletionContextType>(defaultContext)

export function LessonCompletionProvider({ children }: { children: ReactNode }) {
  const [completedLessons, setCompletedLessons] = useState<CompletedLessonRecord[]>([])

  const completeLesson = useCallback((lesson: CompletedLessonRecord) => {
    setCompletedLessons((prev) => {
      const filtered = prev.filter((l) => l.id !== lesson.id)
      return [...filtered, lesson]
    })
  }, [])

  const isCompleted = useCallback(
    (id: string) => completedLessons.some((l) => l.id === id),
    [completedLessons]
  )

  const getCompletion = useCallback(
    (id: string) => completedLessons.find((l) => l.id === id),
    [completedLessons]
  )

  const value = useMemo(
    () => ({ completedLessons, completeLesson, isCompleted, getCompletion }),
    [completedLessons, completeLesson, isCompleted, getCompletion]
  )

  return <LessonCompletionContext.Provider value={value}>{children}</LessonCompletionContext.Provider>
}

export function useLessonCompletion() {
  return useContext(LessonCompletionContext)
}
