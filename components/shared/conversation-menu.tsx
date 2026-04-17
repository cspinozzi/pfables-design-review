"use client"

import { useState } from "react"
import { MoreVertical, User, Flag, Archive, ArchiveRestore } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const REPORT_REASONS = [
  { value: "spam", label: "Spam or misleading" },
  { value: "harassment", label: "Harassment or hateful speech" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "other", label: "Other" },
] as const

type ConversationMenuProps = {
  profileHref?: string
  participantName: string
  onArchive: () => void
  onReport?: () => void
  onUnarchive?: () => void
  isArchived?: boolean
  buttonClassName?: string
  iconClassName?: string
}

export function ConversationMenu({
  profileHref,
  participantName,
  onArchive,
  onReport,
  onUnarchive,
  isArchived = false,
  buttonClassName,
  iconClassName,
}: ConversationMenuProps) {
  const router = useRouter()
  const [reportOpen, setReportOpen] = useState(false)
  const [reason, setReason] = useState<string>("spam")
  const [details, setDetails] = useState("")

  const handleViewProfile = () => {
    if (profileHref) router.push(profileHref)
  }

  const handleSubmitReport = () => {
    setReportOpen(false)
    onReport?.()
    toast.success("Report submitted", {
      description: "Our team will review this conversation.",
    })
    setReason("spam")
    setDetails("")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={buttonClassName ?? "h-9 w-9"}
            aria-label="Conversation options"
          >
            <MoreVertical className={iconClassName ?? "h-5 w-5"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {profileHref && (
            <DropdownMenuItem onClick={handleViewProfile} className="gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              View Profile
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setReportOpen(true)} className="gap-2 cursor-pointer">
            <Flag className="h-4 w-4" />
            Report Conversation
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isArchived ? (
            <DropdownMenuItem onClick={onUnarchive} className="gap-2 cursor-pointer">
              <ArchiveRestore className="h-4 w-4" />
              Unarchive Chat
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={onArchive} className="gap-2 cursor-pointer">
              <Archive className="h-4 w-4" />
              Archive Chat
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report conversation</DialogTitle>
            <DialogDescription>
              {"Report your conversation with "}
              <span className="font-medium text-foreground">{participantName}</span>
              {". Our team will review and take action if needed."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Reason</Label>
              <RadioGroup value={reason} onValueChange={setReason} className="gap-2">
                {REPORT_REASONS.map((r) => (
                  <div key={r.value} className="flex items-center gap-3">
                    <RadioGroupItem value={r.value} id={`reason-${r.value}`} />
                    <Label htmlFor={`reason-${r.value}`} className="text-sm font-normal cursor-pointer">
                      {r.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-details" className="text-sm font-medium">
                Additional details <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="report-details"
                value={details}
                onChange={(e) => setDetails(e.target.value.slice(0, 500))}
                placeholder="Tell us more about what happened..."
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{details.length}/500</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReport}>Submit report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
