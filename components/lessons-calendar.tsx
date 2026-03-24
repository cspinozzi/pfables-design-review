"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface CalendarLesson {
  id: string
  title: string
  date: Date
  time: string
  student: string
  type: "upcoming" | "request" | "past"
}

interface LessonsCalendarProps {
  lessons: CalendarLesson[]
  className?: string
  onLessonClick?: (lesson: CalendarLesson) => void
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function LessonsCalendar({ lessons, className, onLessonClick }: LessonsCalendarProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1)

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleString("en-US", { month: "long", year: "numeric" })

  // Build calendar grid
  const cells: { day: number; isCurrentMonth: boolean; date: Date }[] = []

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    cells.push({ day, isCurrentMonth: false, date: new Date(currentYear, currentMonth - 1, day) })
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true, date: new Date(currentYear, currentMonth, d) })
  }

  // Next month leading days
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, isCurrentMonth: false, date: new Date(currentYear, currentMonth + 1, d) })
  }

  const getLessonsForDate = (date: Date) => {
    return lessons.filter((l) => isSameDay(l.date, date))
  }

  const isToday = (date: Date) => isSameDay(date, today)

  return (
    <Card className={cn("p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-medium">{monthName}</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span>Pending Request</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span>Past</span>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const dayLessons = getLessonsForDate(cell.date)
          const todayClass = isToday(cell.date)

          return (
            <div
              key={idx}
              className={cn(
                "min-h-[72px] border-t border-border/50 p-1",
                !cell.isCurrentMonth && "opacity-30"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  todayClass && "bg-foreground text-background font-semibold"
                )}
              >
                {cell.day}
              </span>
              <div className="mt-0.5 flex flex-col gap-0.5">
                {dayLessons.slice(0, 2).map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => onLessonClick?.(lesson)}
                    className={cn(
                      "rounded px-1 py-0.5 text-[10px] leading-tight truncate text-left w-full transition-opacity hover:opacity-80",
                      onLessonClick && "cursor-pointer",
                      lesson.type === "upcoming" && "bg-background text-foreground font-medium border border-primary",
                      lesson.type === "request" && "bg-primary text-primary-foreground font-medium",
                      lesson.type === "past" && "bg-muted text-muted-foreground line-through"
                    )}
                    title={`${lesson.title} - ${lesson.student} at ${lesson.time}`}
                  >
                    {lesson.time.replace(":00", "")} {lesson.student.split(" ")[0]}
                  </button>
                ))}
                {dayLessons.length > 2 && (
                  <span className="text-[10px] text-muted-foreground px-1">+{dayLessons.length - 2} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
