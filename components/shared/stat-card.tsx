import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  iconBgClass?: string
  iconColorClass?: string
  className?: string
}

export function StatCard({
  icon: Icon,
  label,
  value,
  iconBgClass = "bg-primary/10",
  iconColorClass = "text-primary",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", iconBgClass)}>
          <Icon className={cn("h-5 w-5", iconColorClass)} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className="text-lg font-semibold leading-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatCardRowProps {
  stats: Array<Omit<StatCardProps, "className">>
  className?: string
}

export function StatCardRow({ stats, className }: StatCardRowProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-3", className)}>
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
