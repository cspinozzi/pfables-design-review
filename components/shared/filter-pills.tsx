"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FilterOption<T extends string> {
  value: T
  label: string
  count?: number
}

interface FilterPillsProps<T extends string> {
  options: FilterOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterPillsProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={isActive ? "default" : "outline"}
            onClick={() => onChange(option.value)}
            className="rounded-full h-8 text-xs px-3"
          >
            {option.label}
            {typeof option.count === "number" && (
              <span className={cn("ml-1.5", isActive ? "opacity-80" : "text-muted-foreground")}>
                {option.count}
              </span>
            )}
          </Button>
        )
      })}
    </div>
  )
}
