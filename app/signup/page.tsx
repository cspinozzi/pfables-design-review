"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, ChevronLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/mock-data"
import { ROLE_CONFIG, SIGNUP_ROLES, getRoleRedirectPath } from "@/lib/auth-roles"
import { AuthLayout } from "@/components/shared/auth-layout"
import { IconInput } from "@/components/shared/icon-input"

type SignupRole = Extract<UserRole, "parent" | "provider" | "repair">

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

    const success = signup(name, email, password, selectedRole)
    if (success) {
      router.push(getRoleRedirectPath(selectedRole))
    } else {
      setError("An account with this email already exists")
    }
  }

  const selectedRoleInfo = selectedRole ? ROLE_CONFIG[selectedRole] : null

  return (
    <AuthLayout>
      {step === "role" ? (
        <Card>
          <CardHeader className="text-center px-8 pt-8 pb-4">
            <CardTitle className="text-xl font-medium">Create your account</CardTitle>
            <CardDescription className="text-sm">Choose how you want to use ProMusic</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-0">
            <div className="flex flex-col gap-3">
              {SIGNUP_ROLES.map((role) => {
                const config = ROLE_CONFIG[role]
                const Icon = config.icon
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role as SignupRole)}
                    className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-secondary/50 transition-colors text-left group"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{config.label}</p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </button>
                )
              })}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="px-8 pt-8 pb-4">
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
          <CardContent className="px-8 pb-8 pt-0">
            <form onSubmit={handleSignup} className="space-y-6">
              <IconInput
                id="name"
                label="Full Name"
                icon={User}
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <IconInput
                id="email"
                label="Email"
                icon={Mail}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <IconInput
                id="password"
                label="Password"
                icon={Lock}
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <IconInput
                id="confirmPassword"
                label="Confirm Password"
                icon={Lock}
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />

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
    </AuthLayout>
  )
}
