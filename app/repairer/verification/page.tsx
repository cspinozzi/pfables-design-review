"use client"

import { FileText, Shield, Wrench } from "lucide-react"
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
    id: "certifications",
    title: "Repair Certifications",
    description: "Luthier certification, repair training certificate, or trade credentials",
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    icon: Wrench,
    prefillTypes: ["credential"],
    defaultExpanded: true,
  },
  {
    id: "business",
    title: "Business License",
    description: "Business registration, trade license, or LLC documentation",
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    icon: FileText,
    defaultExpanded: true,
  },
  {
    id: "insurance",
    title: "Insurance & Liability",
    description: "Proof of liability insurance covering instrument repairs",
    required: false,
    accepts: ".pdf,.jpg,.jpeg,.png",
    icon: Shield,
  },
  {
    id: "additional",
    title: "Additional Documents",
    description: "Portfolio, references, or other supporting documents",
    required: false,
    accepts: ".pdf,.jpg,.jpeg,.png",
    icon: FileText,
  },
]

export default function RepairerVerificationPage() {
  return (
    <VerificationView
      title="Business Verification"
      infoTitle="Why Get Verified?"
      infoDescription="Build trust with clients, earn a verified badge, and rank higher in search results for repair services. All documents are reviewed within 2-3 business days."
      categories={CATEGORIES}
    />
  )
}
