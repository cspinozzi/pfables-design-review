"use client"

import { useState, type ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ActionSheetAction {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: "default" | "destructive"
}

interface MobileActionSheetProps {
  trigger: ReactNode
  title: string
  actions: ActionSheetAction[]
}

export function MobileActionSheet({ trigger, title, actions }: MobileActionSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-xl animate-in fade-in-0 duration-300">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant === "destructive" ? "destructive" : "outline"}
                    className={cn("w-full h-12 justify-start", action.variant !== "destructive" && "bg-transparent")}
                    onClick={() => {
                      action.onClick()
                      setIsOpen(false)
                    }}
                  >
                    {action.icon && <span className="mr-3">{action.icon}</span>}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
