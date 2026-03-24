"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, Briefcase, Wrench, ChevronLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/mock-data"

type SignupRole = "parent" | "provider" | "repair"

const roles: { id: SignupRole; label: string; description: string; icon: React.ElementType }[] = [
  {
    id: "parent",
    label: "Parent",
    description: "Find music teachers and services for your children",
    icon: User,
  },
  {
    id: "provider",
    label: "Music Teacher",
    description: "Offer lessons and music education services",
    icon: Briefcase,
  },
  {
    id: "repair",
    label: "Repair Service",
    description: "Provide instrument repair and maintenance",
    icon: Wrench,
  },
]

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()

  const [step, setStep] = useState<"role" | "details">("role")
  const [selectedRole, setSelectedRole] = useState<SignupRole | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleRoleSelect = (role: SignupRole) => {
    setSelectedRole(role)
    setStep("details")
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!selectedRole) return

    const success = signup(name, email, password, selectedRole as UserRole)

    if (success) {
      if (selectedRole === "parent") {
        router.push("/browse")
      } else if (selectedRole === "provider") {
        router.push("/provider/dashboard")
      } else if (selectedRole === "repair") {
        router.push("/repairer/dashboard")
      }
    } else {
      setError("An account with this email already exists")
    }
  }

  const selectedRoleInfo = roles.find((r) => r.id === selectedRole)

  return (
    <div className="min-h-screen bg-background flex justify-center py-12 sm:py-16 pb-24 sm:pb-16 items-start">
      <div className="w-full max-w-sm px-4 sm:px-6">
        {step === "role" ? (
          <Card>
            <CardHeader className="text-center p-5">
              <CardTitle className="text-xl font-medium">Create your account</CardTitle>
              <CardDescription className="text-sm">Choose how you want to use ProMusic</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="flex flex-col gap-3">
                {roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleSelect(role.id)}
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-secondary/50 transition-colors text-left group"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{role.label}</p>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                    </button>
                  )
                })}
              </div>

              <p className="text-center text-sm text-muted-foreground mt-5">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="p-5">
              <button
                type="button"
                onClick={() => {
                  setStep("role")
                  setError("")
                }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 -ml-0.5"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <CardTitle className="text-xl font-medium">Create your account</CardTitle>
              <CardDescription className="text-sm">
                Sign up as {selectedRoleInfo?.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 h-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 h-9"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 h-9"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full">
                  Create Account
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
