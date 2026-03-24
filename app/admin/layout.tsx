import React from "react"
import { ApprovalProvider } from "@/lib/approval-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ApprovalProvider>{children}</ApprovalProvider>
}
