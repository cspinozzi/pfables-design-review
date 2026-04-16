"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, Briefcase, Shield, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { mockUsers } from "@/lib/mock-data"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const roleParam = searchParams.get("role") as "parent" | "provider" | "repair" | null

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (roleParam) {
      const user = mockUsers.find((u) => u.role === roleParam)
      if (user) {
        setEmail(user.email)
        setPassword(user.password)
      }
    }
  }, [roleParam])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = login(email, password)

    if (success) {
      const user = mockUsers.find((u) => u.email === email)
      if (user?.role === "parent") {
        router.push("/browse")
      } else if (user?.role === "provider") {
        router.push("/provider/dashboard")
      } else if (user?.role === "repair") {
        router.push("/repairer/dashboard")
      } else if (user?.role === "admin") {
        router.push("/admin/dashboard")
      }
    } else {
      setError("Invalid email or password")
    }
  }

  const handleQuickLogin = (role: "parent" | "provider" | "repair" | "admin") => {
    const user = mockUsers.find((u) => u.role === role)
    if (user) {
      const success = login(user.email, user.password)
      if (success) {
        if (role === "parent") {
          router.push("/browse")
        } else if (role === "provider") {
          router.push("/provider/dashboard")
        } else if (role === "repair") {
          router.push("/repairer/dashboard")
        } else if (role === "admin") {
          router.push("/admin/dashboard")
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-[12vh] px-4 sm:px-6 pb-12 sm:pt-20">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6 opacity-10">
          <Image
            src="/icon-light.png"
            alt="ProMusic"
            width={120}
            height={120}
            className="h-auto object-contain"
            priority
          />
        </div>
        <Card>
          <CardHeader className="text-center p-5">
            <CardTitle className="text-xl font-medium">Sign in</CardTitle>
            <CardDescription className="text-sm">Access your ProMusic account</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <form onSubmit={handleLogin} className="space-y-4">
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 h-9"
                    required
                  />
                </div>
              </div>

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

        <div className="mt-10">
          <p className="text-center text-xs text-muted-foreground mb-3">Demo access</p>
          <div className="flex flex-row justify-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
              onClick={() => handleQuickLogin("parent")}
            >
              <User className="h-4 w-4" />
              <span className="text-xs">Parent</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
              onClick={() => handleQuickLogin("provider")}
            >
              <Briefcase className="h-4 w-4" />
              <span className="text-xs">Provider</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
              onClick={() => handleQuickLogin("repair")}
            >
              <Shield className="h-4 w-4" />
              <span className="text-xs">Repair</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
              onClick={() => handleQuickLogin("admin")}
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs">Admin</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
