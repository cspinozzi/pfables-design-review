import type { LucideIcon } from "lucide-react"
import type { InputHTMLAttributes } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  icon: LucideIcon
}

/**
 * Labeled input with a leading icon, used in auth forms.
 */
export function IconInput({ id, label, icon: Icon, className, ...props }: IconInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input id={id} className={cn("pl-9 h-9", className)} {...props} />
      </div>
    </div>
  )
}
