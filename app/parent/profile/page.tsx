"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getAllLocations, INSTRUMENTS } from "@/lib/locations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle, Clock, Star, Calendar, Briefcase, CheckSquare, MoreVertical, KeyRound, LogOut, Trash, FileText, Plus, X } from "lucide-react"
import { ProfileAvatarUpload } from "@/components/profile-avatar-upload"

export default function ParentProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const locations = getAllLocations()
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "(555) 123-4567",
    location: "naperville",
    customLocation: "",
  })
  
  const [students, setStudents] = useState<{ id: number; name: string; instruments: string[] }[]>([
    { id: 1, name: user?.childName || "", instruments: ["Piano", "Guitar"] },
  ])
  const [showCustomLocation, setShowCustomLocation] = useState(false)
  
  // Preferences state
  const [contactMethod, setContactMethod] = useState<"in-app" | "email" | "sms">("in-app")
  const [notificationFrequency, setNotificationFrequency] = useState<"important" | "all">("important")

  // Dirty tracking for Save button
  const isDirty = formData.name !== (user?.name || "") || formData.phone !== "(555) 123-4567" || formData.location !== "naperville" || JSON.stringify(students) !== JSON.stringify([{ id: 1, name: user?.childName || "", instruments: ["Piano", "Guitar"] }]) || contactMethod !== "in-app" || notificationFrequency !== "important"

  // Mock trust & history data
  const trustHistory = {
    verificationStatus: "verified" as "verified" | "pending" | "unverified",
    activeServices: 1,
    completedServices: 12,
    averageRating: 4.9,
    joinedDate: new Date("2023-06-15"),
  }

  const handleLocationChange = (value: string) => {
    if (value === "other") {
      setShowCustomLocation(true)
      setFormData({ ...formData, location: "other" })
    } else {
      setShowCustomLocation(false)
      setFormData({ ...formData, location: value, customLocation: "" })
    }
  }

  const updateStudentName = (id: number, name: string) => {
    setStudents(students.map((s) => (s.id === id ? { ...s, name } : s)))
  }

  const toggleStudentInstrument = (id: number, instrument: string) => {
    setStudents(
      students.map((s) =>
        s.id === id
          ? {
              ...s,
              instruments: s.instruments.includes(instrument)
                ? s.instruments.filter((i) => i !== instrument)
                : [...s.instruments, instrument],
            }
          : s
      )
    )
  }

  const addStudent = () => {
    const newId = Math.max(...students.map((s) => s.id), 0) + 1
    setStudents([...students, { id: newId, name: "", instruments: [] }])
  }

  const removeStudent = (id: number) => {
    if (students.length <= 1) return
    setStudents(students.filter((s) => s.id !== id))
  }

  const handleSave = () => {
    alert("Profile updated successfully!")
  }

  const getVerificationBadge = (status: "verified" | "pending" | "unverified") => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            <CheckCircle className="h-3.5 w-3.5" />
            Verified
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-sm text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            <Clock className="h-3.5 w-3.5" />
            Pending
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Unverified
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <ProfileAvatarUpload
              src={user?.avatar}
              name={user?.name || ""}
              size="lg"
              editable
              onAvatarChange={(dataUrl) => updateUser({ avatar: dataUrl })}
            />
            <div>
              <h1 className="mb-1 font-display text-2xl font-medium text-foreground">My Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your account information</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} className="shrink-0" disabled={!isDirty}>
              Save Changes
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">Account options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                  <Trash className="h-4 w-4" />
                  Delete Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Parent Info, Trust & History, Preferences */}
          <div className="space-y-6">
            {/* Parent Information */}
            <Card className="p-5">
              <h2 className="font-semibold mb-5">Parent Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Full Name</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    disabled
                    className="h-11 bg-muted text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Location</label>
                  <Select value={formData.location} onValueChange={handleLocationChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other (Enter manually)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomLocation && (
                    <Input
                      type="text"
                      placeholder="Enter your city, state"
                      value={formData.customLocation}
                      onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                      className="h-11 mt-2"
                    />
                  )}
                </div>
              </div>
            </Card>

            {/* Trust & History */}
            <Card className="p-5">
              <h2 className="font-semibold mb-5">Trust & History</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verification</span>
                  {getVerificationBadge(trustHistory.verificationStatus)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Terms & Conditions
                  </span>
                  <button type="button" className="text-sm font-medium text-primary hover:underline">
                    View
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Active services
                  </span>
                  <span className="text-sm font-medium">{trustHistory.activeServices}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Completed
                  </span>
                  <span className="text-sm font-medium">{trustHistory.completedServices}</span>
                </div>

                {trustHistory.averageRating && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Average rating
                    </span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {trustHistory.averageRating}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined
                  </span>
                  <span className="text-sm font-medium">
                    {trustHistory.joinedDate.toLocaleDateString("en-US", { 
                      month: "short", 
                      year: "numeric" 
                    })}
                  </span>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card className="p-5">
              <h2 className="font-semibold mb-5">Preferences</h2>
              
              <div className="space-y-3">
                {/* Contact Method */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-3">
                    Preferred contact method
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "in-app", label: "In-app" },
                      { value: "email", label: "Email" },
                      { value: "sms", label: "SMS" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setContactMethod(option.value as typeof contactMethod)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          contactMethod === option.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-secondary hover:border-primary/30"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notification Frequency */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-3">
                    Notification frequency
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "important", label: "Only important updates" },
                      { value: "all", label: "All updates" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setNotificationFrequency(option.value as typeof notificationFrequency)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          notificationFrequency === option.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-secondary hover:border-primary/30"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Student Information */}
          <div className="space-y-6">
            {/* Student Information Cards */}
            {students.map((student, index) => (
              <Card key={student.id} className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold">
                    {students.length > 1 ? `Student ${index + 1}` : "Student Information"}
                  </h2>
                  {students.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeStudent(student.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove student</span>
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Student Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your child's name"
                      value={student.name}
                      onChange={(e) => updateStudentName(student.id, e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Instrument Interests</label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Select the instruments this child is interested in learning
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {INSTRUMENTS.map((instrument) => (
                        <button
                          key={instrument}
                          type="button"
                          onClick={() => toggleStudentInstrument(student.id, instrument)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                            student.instruments.includes(instrument)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground hover:bg-secondary hover:border-primary/30"
                          }`}
                        >
                          {instrument}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Add Student Button */}
            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-primary/40"
              onClick={addStudent}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Student
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
