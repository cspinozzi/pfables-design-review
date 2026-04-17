"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { mockUsers, type UserRole } from "@/lib/mock-data"
import { AUTH_ROLES, ROLE_CONFIG, getRoleRedirectPath } from "@/lib/auth-roles"
import { AuthLayout } from "@/components/shared/auth-layout"
import { IconInput } from "@/components/shared/icon-input"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const roleParam = searchParams.get("role") as UserRole | null

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!roleParam) return
    const user = mockUsers.find((u) => u.role === roleParam)
    if (user) {
      setEmail(user.email)
      setPassword(user.password)
    }
  }, [roleParam])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = login(email, password)
    if (!success) {
      setError("Invalid email or password")
      return
    }
    const user = mockUsers.find((u) => u.email === email)
    if (user) router.push(getRoleRedirectPath(user.role))
  }

  const handleQuickLogin = (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role)
    if (!user) return
    const success = login(user.email, user.password)
    if (success) router.push(getRoleRedirectPath(role))
  }

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="text-center px-8 pt-8 pb-4">
          <CardTitle className="text-xl font-medium">Sign in</CardTitle>
          <CardDescription className="text-sm">Access your ProMusic account</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-0">
          <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full">
              Sign in
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      <div className="mt-14">
        <p className="text-center text-xs text-muted-foreground mb-4">Demo access</p>
        <div className="flex flex-row justify-center gap-6">
          {AUTH_ROLES.map((role) => {
            const config = ROLE_CONFIG[role]
            const Icon = config.icon
            return (
              <Button
                key={role}
                type="button"
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
                onClick={() => handleQuickLogin(role)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{config.shortLabel}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </AuthLayout>
  )
}

function LoginFallback() {
  return (
    <AuthLayout>
      <Card>
        <CardHeader className="text-center px-8 pt-8 pb-4">
          <div className="h-6 w-24 bg-muted rounded mx-auto animate-pulse" />
          <div className="h-4 w-40 bg-muted/60 rounded mx-auto mt-2 animate-pulse" />
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-0">
          <div className="space-y-6">
            <div className="h-9 bg-muted/60 rounded animate-pulse" />
            <div className="h-9 bg-muted/60 rounded animate-pulse" />
            <div className="h-9 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  )
}
