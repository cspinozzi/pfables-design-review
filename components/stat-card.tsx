import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: string
    positive: boolean
  }
  className?: string
}

export function StatCard({ title, value, icon, description, trend, className }: StatCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md active:scale-[0.98]", className)}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl sm:text-3xl font-bold truncate">{value}</p>
            {description && <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">{description}</p>}
            {trend && (
              <p
                className={cn(
                  "mt-2 text-xs sm:text-sm font-medium",
                  trend.positive ? "text-success" : "text-destructive",
                )}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-3 sm:p-3.5 text-primary flex-shrink-0">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
