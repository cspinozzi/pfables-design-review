"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

interface ApprovalContextType {
  approvedIds: Set<string>
  approveProvider: (id: string) => void
  revokeApproval: (id: string) => void
  isApproved: (id: string, defaultVerified: boolean) => boolean
}

const ApprovalContext = createContext<ApprovalContextType | null>(null)

export function ApprovalProvider({ children }: { children: ReactNode }) {
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set())
  const [revokedIds, setRevokedIds] = useState<Set<string>>(new Set())

  const approveProvider = useCallback((id: string) => {
    setApprovedIds((prev) => new Set(prev).add(id))
    setRevokedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const revokeApproval = useCallback((id: string) => {
    setRevokedIds((prev) => new Set(prev).add(id))
    setApprovedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const isApproved = useCallback(
    (id: string, defaultVerified: boolean) => {
      if (approvedIds.has(id)) return true
      if (revokedIds.has(id)) return false
      return defaultVerified
    },
    [approvedIds, revokedIds],
  )

  const contextValue = useMemo(() => ({
    approvedIds, approveProvider, revokeApproval, isApproved
  }), [approvedIds, approveProvider, revokeApproval, isApproved])

  return (
    <ApprovalContext.Provider value={contextValue}>
      {children}
    </ApprovalContext.Provider>
  )
}

export function useApproval() {
  const context = useContext(ApprovalContext)
  if (!context) {
    throw new Error("useApproval must be used within an ApprovalProvider")
  }
  return context
}
