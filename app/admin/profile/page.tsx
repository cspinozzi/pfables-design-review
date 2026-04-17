"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, Clock, Calendar, Shield, Users, ShieldCheck, FileCheck } from "lucide-react"
import { ProfileHeader } from "@/components/shared/profile-header"
import { mockProviders, mockBackgroundChecks, mockUsers } from "@/lib/mock-data"

export default function AdminProfilePage() {
  const { user, logout } = useAuth()

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "(555) 000-0001",
  })

  // Platform stats for admin
  const totalUsers = mockUsers.length
  const totalProviders = mockProviders.length
  const pendingVerifications = mockBackgroundChecks.filter((bg) => bg.status === "pending").length
  const completedVerifications = mockBackgroundChecks.filter((bg) => bg.status === "completed").length

  const handleSave = () => {
    alert("Profile updated successfully!")
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        <ProfileHeader title="Admin Profile" subtitle="Manage your administrator account" />

        {/* Two Column Layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="p-5">
              <h2 className="font-semibold mb-5">Personal Information</h2>

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
              </div>

              <Button onClick={handleSave} className="w-full mt-6">
                Save Changes
              </Button>
            </Card>

            {/* Security */}
            <Card className="p-5">
              <h2 className="font-semibold mb-5">Security</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Two-Factor Authentication
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Platform Overview + Account */}
          <div className="space-y-6">
            {/* Platform Overview */}
            <Card className="p-5">
              <h2 className="font-semibold mb-5">Platform Overview</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Users
                  </span>
                  <span className="text-sm font-medium">{totalUsers}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Total Providers
                  </span>
                  <span className="text-sm font-medium">{totalProviders}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending Verifications
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    <Clock className="h-3.5 w-3.5" />
                    {pendingVerifications}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Completed Verifications
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {completedVerifications}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Admin Since
                  </span>
                  <span className="text-sm font-medium">Jan 2024</span>
                </div>
              </div>
            </Card>

            {/* Admin Role */}
            <Card className="p-5">
              <h2 className="font-semibold mb-5">Role & Permissions</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <span className="inline-flex items-center gap-1 text-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Administrator
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Access Level</span>
                  <span className="text-sm font-medium">Full Access</span>
                </div>
              </div>
            </Card>

            {/* Account */}
            <Card className="p-5">
              <h2 className="font-semibold mb-5">Account</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
