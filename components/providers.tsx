"use client"
// v2
import { type ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { MessageProvider } from "@/lib/message-context"
import { RescheduleProvider } from "@/lib/reschedule-context"
import { LessonCompletionProvider } from "@/lib/lesson-completion-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MessageProvider>
        <RescheduleProvider>
          <LessonCompletionProvider>
            {children}
          </LessonCompletionProvider>
        </RescheduleProvider>
      </MessageProvider>
    </AuthProvider>
  )
}
