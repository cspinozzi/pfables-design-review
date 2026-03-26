"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { type User, mockUsers, UserRole } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string, role: UserRole) => boolean
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("promusic-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("promusic-user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const signup = (name: string, email: string, password: string, role: UserRole): boolean => {
    // Check if email already exists
    if (mockUsers.find((u) => u.email === email)) {
      return false
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      role,
      name,
      location: "",
      joinedDate: new Date().toISOString().slice(0, 7),
    }
    // Add to mock users array so login works afterwards
    mockUsers.push(newUser)
    setUser(newUser)
    localStorage.setItem("promusic-user", JSON.stringify(newUser))
    return true
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      localStorage.setItem("promusic-user", JSON.stringify(updated))
      return updated
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("promusic-user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
