"use client"

import { FileText, Shield } from "lucide-react"
import { VerificationView, type VerificationCategory } from "@/components/views/verification-view"

const CATEGORIES: VerificationCategory[] = [
  {
    id: "identity",
    title: "Government-Issued ID",
    description: "Upload a valid driver's license, passport, or state ID",
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    icon: Shield,
    prefillTypes: ["identification"],
    defaultExpanded: true,
  },
  {
    id: "credentials",
    title: "Teaching Credentials",
    description: "Music education certificate, degree, or professional certification",
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    icon: FileText,
    prefillTypes: ["credential"],
    defaultExpanded: true,
  },
  {
    id: "background",
    title: "Background Check Authorization",
    description: "Signed consent form for background screening",
    required: true,
    accepts: ".pdf",
    icon: FileText,
    defaultExpanded: true,
  },
  {
    id: "additional",
    title: "Additional Documents",
    description: "References, insurance, or other supporting documents",
    required: false,
    accepts: ".pdf,.jpg,.jpeg,.png",
    icon: FileText,
  },
]

export default function ProviderVerificationPage() {
  return (
    <VerificationView
      title="Background Verification"
      infoTitle="Why Get Verified?"
      infoDescription="Build trust with families, earn a verified badge, and rank higher in search results. All documents are reviewed within 2-3 business days."
      categories={CATEGORIES}
    />
  )
}
