"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { mockProviders } from "@/lib/mock-data"
import { getAllLocations, addCustomLocation, isValidCityName } from "@/lib/locations"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, ChevronRight, AlertCircle, Briefcase, Star, CheckCircle, Calendar, FileText, Upload, Eye, Trash2, X, GraduationCap, MoreVertical, KeyRound, LogOut, Trash } from "lucide-react"
import { ProfileHeader } from "@/components/shared/profile-header"

export default function ProviderProfilePage() {
  const { user, logout } = useAuth()
  const provider = mockProviders.find((p) => p.userId === user?.id)
  const locations = getAllLocations()

  const [name, setName] = useState(provider?.name || "")
  const [bio, setBio] = useState(provider?.bio || "")
  const [phone, setPhone] = useState(provider?.phone || "")
  const [location, setLocation] = useState("naperville")
  const [customLocation, setCustomLocation] = useState("")
  const [showCustomLocation, setShowCustomLocation] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [specialty, setSpecialty] = useState<string[]>(provider?.specialty || [])
  const [newSpecialty, setNewSpecialty] = useState("")
  const [yearsTeaching, setYearsTeaching] = useState(provider?.yearsExperience?.toString() || "8")
  const [availability, setAvailability] = useState(provider?.availability || "")

  // Dirty tracking for Save button
  const initialValues = {
    name: provider?.name || "",
    bio: provider?.bio || "",
    phone: provider?.phone || "",
    availability: provider?.availability || "",
  }
  const isDirty = name !== initialValues.name || bio !== initialValues.bio || phone !== initialValues.phone || availability !== initialValues.availability || location !== "naperville" || specialty.join(",") !== (provider?.specialty || []).join(",")

  // Add service modal state
  const [addServiceOpen, setAddServiceOpen] = useState(false)
  const [newServiceName, setNewServiceName] = useState("")
  const [newServiceCategory, setNewServiceCategory] = useState("")
  const [newServiceDescription, setNewServiceDescription] = useState("")
  const [newServicePricing, setNewServicePricing] = useState("")
  const [newServiceLocation, setNewServiceLocation] = useState("")
  const [services, setServices] = useState(provider?.services || [])

  const handleAddService = () => {
    if (!newServiceName.trim() || !newServicePricing.trim()) return
    const newService = {
      id: `service-${Date.now()}`,
      name: newServiceName.trim(),
      category: newServiceCategory || "lesson",
      description: newServiceDescription.trim(),
      pricing: newServicePricing.trim(),
      location: newServiceLocation || "In-Home & In-Studio",
    }
    setServices((prev) => [...prev, newService])
    setNewServiceName("")
    setNewServiceCategory("")
    setNewServiceDescription("")
    setNewServicePricing("")
    setNewServiceLocation("")
    setAddServiceOpen(false)
  }

  // Credentials state
  type CredentialDoc = { id: string; name: string; imageUrl: string; uploadedAt: string }
  const [credentialDocs, setCredentialDocs] = useState<CredentialDoc[]>(
    (provider?.credentials || []).map((cred, i) => ({
      id: `cred-${i}`,
      name: cred,
      imageUrl: i === 0 ? "/documents/music-education-cert.jpg" : "/documents/mtna-certification.jpg",
      uploadedAt: "Dec 2024",
    }))
  )
  const [previewDoc, setPreviewDoc] = useState<CredentialDoc | null>(null)
  const credentialInputRef = useRef<HTMLInputElement>(null)

  const handleCredentialUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const newDoc: CredentialDoc = {
          id: `cred-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name.replace(/\.[^.]+$/, ""),
          imageUrl: reader.result as string,
          uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        }
        setCredentialDocs((prev) => [...prev, newDoc])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ""
  }

  const handleRemoveCredential = (id: string) => {
    setCredentialDocs((prev) => prev.filter((d) => d.id !== id))
  }

  const handleLocationChange = (value: string) => {
    setLocationError("")
    if (value === "other") {
      setShowCustomLocation(true)
      setLocation("other")
    } else {
      setShowCustomLocation(false)
      setLocation(value)
      setCustomLocation("")
    }
  }

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialty.includes(newSpecialty.trim())) {
      setSpecialty([...specialty, newSpecialty.trim()])
      setNewSpecialty("")
    }
  }

  const handleRemoveSpecialty = (spec: string) => {
    setSpecialty(specialty.filter((s) => s !== spec))
  }

  const handleSave = () => {
    if (showCustomLocation && customLocation.trim()) {
      const validation = isValidCityName(customLocation)
      if (!validation.valid) {
        setLocationError(validation.reason || "Invalid location")
        return
      }
      const result = addCustomLocation(customLocation)
      if (!result.success) {
        setLocationError(result.reason || "Failed to add location")
        return
      }
    }
    alert("Profile updated successfully!")
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        {/* Header */}
        <ProfileHeader
          className="mb-8"
          title="Provider Profile"
          subtitle="Manage your provider information"
          actions={
            <>
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
            </>
          }
        />

        {/* Two Column Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="p-5">
              <h2 className="font-semibold mb-5">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Display Name</label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">About You</label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Tell parents about your experience and teaching style..."
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{bio.length}/500 characters</p>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Years Teaching</label>
                  <Select value={yearsTeaching} onValueChange={setYearsTeaching}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1">Less than 1 year</SelectItem>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} {year === 1 ? "year" : "years"}
                        </SelectItem>
                      ))}
                      <SelectItem value="30+">30+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Phone</label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Service Area</label>
                  <Select value={location} onValueChange={handleLocationChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other (Add new location)</SelectItem>
                    </SelectContent>
                  </Select>
                  {showCustomLocation && (
                    <div className="space-y-2 mt-2">
                      <Input
                        type="text"
                        placeholder="Enter city, state (e.g., Springfield, IL)"
                        value={customLocation}
                        onChange={(e) => {
                          setCustomLocation(e.target.value)
                          setLocationError("")
                        }}
                        className="h-11"
                      />
                      {locationError && (
                        <div className="flex items-center gap-2 text-destructive text-sm">
                          <AlertCircle className="h-4 w-4" />
                          {locationError}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        New valid locations will be added to the system for all users to find you.
                      </p>
                    </div>
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
                  <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified
                  </span>
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
                    Services offered
                  </span>
                  <span className="text-sm font-medium">{provider?.services.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Average rating
                  </span>
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {provider?.rating || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined
                  </span>
                  <span className="text-sm font-medium">Jun 2023</span>
                </div>
              </div>
            </Card>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Availability */}
            <Card className="p-5">
              <h2 className="font-semibold mb-5">Availability</h2>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Available Hours</label>
                <Input
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g., Mon-Fri 3-8pm, Weekends flexible"
                  className="h-11"
                />
              </div>
            </Card>

            {/* Services Offered */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Services Offered</h2>
                <Badge variant="secondary">{services.length}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    className="w-full flex items-center gap-3 p-3 rounded-xl border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-medium text-sm mb-1">{service.name}</h4>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">{service.category}</span>
                        <span className="text-xs text-muted-foreground">{"·"}</span>
                        <span className="text-xs font-medium text-primary">{service.pricing}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>

              <Button variant="outline" className="w-full border-dashed bg-transparent" onClick={() => setAddServiceOpen(true)}>
                <Plus className="mr-2 h-5 w-5" />
                Add New Service
              </Button>
            </Card>

            {/* Your Specialties */}
            <Card className="p-5">
              <h2 className="font-semibold mb-2">Your Specialties</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Add the instruments and skills you teach
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {specialty.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => handleRemoveSpecialty(spec)}
                    className="rounded-full border border-primary bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium transition-all duration-200"
                  >
                    {spec}
                  </button>
                ))}
                {specialty.length === 0 && <p className="text-sm text-muted-foreground">No specialties added yet</p>}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Piano, Guitar, Voice"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSpecialty()
                    }
                  }}
                  className="h-11"
                />
                <Button
                  type="button"
                  onClick={handleAddSpecialty}
                  className="h-11 px-5 shrink-0"
                  disabled={!newSpecialty.trim()}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </Card>

            {/* Credentials */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Credentials
                </h2>
                <Badge variant="secondary">{credentialDocs.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Upload your certificates, diplomas, and professional certifications
              </p>

              {credentialDocs.length > 0 && (
                <div className="space-y-2 mb-4">
                  {credentialDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex items-center gap-3 p-3 rounded-xl border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="relative h-12 w-12 rounded-lg overflow-hidden border bg-background shrink-0"
                      >
                        <Image
                          src={doc.imageUrl}
                          alt={doc.name}
                          fill
                          className="object-cover"
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="text-sm font-medium truncate block w-full text-left hover:text-primary transition-colors"
                        >
                          {doc.name}
                        </button>
                        <p className="text-xs text-muted-foreground">Uploaded {doc.uploadedAt}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => setPreviewDoc(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveCredential(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {credentialDocs.length === 0 && (
                <div className="text-center py-6 mb-4 rounded-xl border border-dashed bg-secondary/20">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No credentials uploaded yet</p>
                </div>
              )}

              <input
                ref={credentialInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
                className="hidden"
                onChange={handleCredentialUpload}
              />
              <Button
                variant="outline"
                className="w-full border-dashed bg-transparent"
                onClick={() => credentialInputRef.current?.click()}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Credential
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <Dialog open={addServiceOpen} onOpenChange={setAddServiceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service listing for parents to book.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Service Name</label>
              <Input
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="e.g., Piano Lessons, Guitar Lessons"
                className="h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <Select value={newServiceCategory} onValueChange={setNewServiceCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lesson">Lesson</SelectItem>
                  <SelectItem value="tutoring">Tutoring</SelectItem>
                  <SelectItem value="coaching">Coaching</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <Textarea
                value={newServiceDescription}
                onChange={(e) => setNewServiceDescription(e.target.value)}
                placeholder="Describe what this service includes..."
                rows={3}
                className="resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Pricing</label>
              <Input
                value={newServicePricing}
                onChange={(e) => setNewServicePricing(e.target.value)}
                placeholder="e.g., $50-75 per lesson"
                className="h-11"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Location</label>
              <Select value={newServiceLocation} onValueChange={setNewServiceLocation}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In-Home">In-Home</SelectItem>
                  <SelectItem value="In-Studio">In-Studio</SelectItem>
                  <SelectItem value="In-Home & In-Studio">In-Home & In-Studio</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setAddServiceOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button
              onClick={handleAddService}
              disabled={!newServiceName.trim() || !newServicePricing.trim()}
              className="rounded-full"
            >
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credential Lightbox */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewDoc(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview: ${previewDoc.name}`}
        >
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
            <h3 className="text-white text-sm font-medium truncate max-w-[70%]">
              {previewDoc.name}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-9 w-9"
              onClick={() => setPreviewDoc(null)}
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div
            className="relative max-w-[90vw] max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={previewDoc.imageUrl}
              alt={previewDoc.name}
              width={900}
              height={1200}
              className="rounded-lg shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
