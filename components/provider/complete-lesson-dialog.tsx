"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CompleteLessonDialogProps {
  open: boolean
  onClose: () => void
  lessonTitle?: string
  studentName?: string
  onSubmit: (data: { topic: string; comment: string }) => void
}

export function CompleteLessonDialog({
  open,
  onClose,
  lessonTitle,
  studentName,
  onSubmit,
}: CompleteLessonDialogProps) {
  const [topic, setTopic] = useState("")
  const [comment, setComment] = useState("")
  const [touched, setTouched] = useState(false)

  // Reset fields whenever the dialog is freshly opened
  useEffect(() => {
    if (open) {
      setTopic("")
      setComment("")
      setTouched(false)
    }
  }, [open])

  const topicIsEmpty = topic.trim().length === 0
  const showTopicError = touched && topicIsEmpty

  const handleSubmit = () => {
    setTouched(true)
    if (topicIsEmpty) return
    onSubmit({ topic: topic.trim(), comment: comment.trim() })
    onClose()
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Complete lesson
          </DialogTitle>
          <DialogDescription>
            {lessonTitle && studentName
              ? `Mark the ${lessonTitle} with ${studentName} as complete. This will move the payment to Waiting Payment.`
              : "Mark this lesson as complete. This will move the payment to Waiting Payment."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-2">
            <Label htmlFor="complete-topic" className="text-sm">
              Topic covered <span className="text-destructive">*</span>
            </Label>
            <Input
              id="complete-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="e.g. Scales, rhythm fundamentals, Bach Minuet"
              aria-invalid={showTopicError}
              aria-describedby={showTopicError ? "complete-topic-error" : undefined}
              autoFocus
            />
            {showTopicError ? (
              <p id="complete-topic-error" className="text-xs text-destructive">
                Please enter the topic covered in this lesson.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                A short summary of what was taught. Required.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="complete-comment" className="text-sm">
              Comments <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="complete-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Notes for the parent, homework, observations..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={topicIsEmpty && touched}>
            Mark as complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
