import { Music, Wrench, Gauge, Package } from "lucide-react"

interface CategoryIconProps {
  category: "lessons" | "repair" | "tuning" | "rental"
  className?: string
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const icons = {
    lessons: Music,
    repair: Wrench,
    tuning: Gauge,
    rental: Package,
  }

  const Icon = icons[category]
  return <Icon className={className} />
}
