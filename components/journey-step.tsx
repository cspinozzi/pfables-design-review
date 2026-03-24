import type React from "react"
import { cn } from "@/lib/utils"

interface JourneyStepProps {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  highlight?: boolean
}

export function JourneyStep({ number, icon, title, description, highlight }: JourneyStepProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs mx-auto">
      <div className="relative mb-4 sm:mb-6">
        <div
          className={cn(
            "flex h-20 w-20 sm:h-16 sm:w-16 items-center justify-center rounded-full transition-colors",
            highlight ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary",
          )}
        >
          {icon}
        </div>
        <div
          className={cn(
            "absolute -right-1 -top-1 flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full text-sm sm:text-xs font-bold",
            highlight ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          {number}
        </div>
      </div>
      <h3 className="mb-2 text-lg sm:text-xl font-semibold px-2">{title}</h3>
      <p className="text-base sm:text-sm text-muted-foreground leading-relaxed px-2">{description}</p>
    </div>
  )
}
