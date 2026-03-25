"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Clock, MapPin, MessageSquare, Send, CheckCircle2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getParentProfile } from "@/lib/mock-data"
import type { Provider } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

interface BookingModalProps {
  provider: Provider
  open: boolean
  onOpenChange: (open: boolean) => void
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
  "7:00 PM", "7:30 PM", "8:00 PM",
]

export function BookingModal({ provider, open, onOpenChange }: BookingModalProps) {
  const isTeacher = provider.providerType === "teacher"
  const { user } = useAuth()
  const parentProfile = user ? getParentProfile(user.id) : undefined
  const childrenList = parentProfile?.children || []

  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  // Auto-select student if there's only one child
  useEffect(() => {
    if (childrenList.length === 1 && !selectedStudent) {
      setSelectedStudent(childrenList[0].name)
    }
  }, [childrenList, selectedStudent])

  const selectedServiceObj = provider.services.find((s) => s.id === selectedService)

  // Auto-fill location for single-location services so form validation passes
  useEffect(() => {
    if (selectedServiceObj && selectedServiceObj.location !== "both") {
      setSelectedLocation(selectedServiceObj.location === "in-home" ? "in-home" : "in-studio")
    } else if (!selectedServiceObj) {
      setSelectedLocation("")
    }
  }, [selectedServiceObj])

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setSelectedService("")
      setSelectedDate("")
      setSelectedTime("")
      setSelectedLocation("")
      setSelectedStudent(childrenList.length === 1 ? childrenList[0].name : "")
      setMessage("")
      setSubmitted(false)
    }, 300)
  }

  const isFormValid = selectedService && selectedDate && selectedTime && (isTeacher || selectedLocation) && (childrenList.length === 0 || selectedStudent)

  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return {
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    }
  })

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Sent</DialogTitle>
            <DialogDescription>
              Your {isTeacher ? "lesson" : "service"} request has been sent to {provider.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center text-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Success!</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              They will get back to you shortly.
            </p>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isTeacher ? "Reserve a Lesson" : "Request a Service"}
          </DialogTitle>
          <DialogDescription>
            with {provider.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              {isTeacher ? "Select Lesson" : "Select Service"}
            </label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={isTeacher ? "Choose a lesson type..." : "Choose a service..."} />
              </SelectTrigger>
              <SelectContent>
                {provider.services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center justify-between w-full gap-3">
                      <span>{service.name}</span>
                      <span className="text-xs text-muted-foreground">{service.pricing}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedServiceObj && (
              <div className="mt-2 rounded-lg border bg-secondary/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{selectedServiceObj.name}</span>
                  <Badge variant="secondary" className="text-xs">{selectedServiceObj.pricing}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{selectedServiceObj.description}</p>
              </div>
            )}
          </div>

          {/* Student Selection (only for parents with children) */}
          {isTeacher && childrenList.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1.5">
                <User className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                Student
              </label>
              {childrenList.length === 1 ? (
                <Input
                  readOnly
                  value={childrenList[0].name}
                  className="h-11 bg-secondary/30"
                />
              ) : (
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {childrenList.map((child) => (
                      <SelectItem key={child.name} value={child.name}>
                        <div className="flex items-center justify-between w-full gap-3">
                          <span>{child.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Age {child.age} - {child.instrument} ({child.level})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              <CalendarDays className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
              Preferred Date
            </label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a date..." />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              <Clock className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
              Preferred Time
            </label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a time..." />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location (for repair services or multi-location services) */}
          {selectedServiceObj && (
            <div>
              <label className="block text-sm font-medium mb-1.5">
                <MapPin className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                Location
              </label>
              {selectedServiceObj.location === "both" ? (
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select location..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-home">In-Home</SelectItem>
                    <SelectItem value="in-studio">{isTeacher ? "In-Studio" : "In-Shop"}</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  readOnly
                  value={
                    selectedServiceObj.location === "in-home"
                      ? "In-Home"
                      : isTeacher
                        ? "In-Studio"
                        : "In-Shop"
                  }
                  className="h-11 bg-secondary/30"
                />
              )}
            </div>
          )}



          {/* Optional Message */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              <MessageSquare className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
              Message
              <span className="text-muted-foreground font-normal ml-1">(optional)</span>
            </label>
            <Textarea
              placeholder={
                isTeacher
                  ? "e.g., My daughter is 8 years old and has been playing for 2 years..."
                  : "e.g., The strings are worn and the bridge needs replacing..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full h-11"
          >
            <Send className="mr-2 h-4 w-4" />
            {isTeacher ? "Send Lesson Request" : "Send Service Request"}
          </Button>

          <p className="text-[11px] text-center text-muted-foreground">
            No payment is required now. {provider.name} will confirm availability and details.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
