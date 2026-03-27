"use client"
// v2
import { type ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { MessageProvider } from "@/lib/message-context"
import { RescheduleProvider } from "@/lib/reschedule-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MessageProvider>
        <RescheduleProvider>
          {children}
        </RescheduleProvider>
      </MessageProvider>
    </AuthProvider>
  )
}
