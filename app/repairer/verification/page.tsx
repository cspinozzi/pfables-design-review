"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VerificationBadge } from "@/components/verification-badge"
import { useAuth } from "@/lib/auth-context"
import { mockProviders, mockBackgroundChecks } from "@/lib/mock-data"
import Image from "next/image"
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  Wrench,
} from "lucide-react"

interface UploadedFile {
  name: string
  size: string
  type: string
  category: string
  previewUrl?: string
}

const VERIFICATION_CATEGORIES = [
  {
    id: "identity",
    title: "Government-Issued ID",
    description: "Upload a valid driver's license, passport, or state ID",
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    icon: Shield,
  },
  {
    id: "certifications",
    title: "Repair Certifications",
    description: "Luthier certification, repair training certificate, or trade credentials",
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    icon: Wrench,
  },
  {
    id: "business",
    title: "Business License",
    description: "Business registration, trade license, or LLC documentation",
    required: true,
    accepts: ".pdf,.jpg,.jpeg,.png",
    icon: FileText,
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function RepairerVerificationPage() {
  const { user } = useAuth()
  const provider = mockProviders.find((p) => p.userId === user?.id)
  const backgroundCheck = mockBackgroundChecks.find((bg) => bg.providerId === provider?.id)

  const [filesByCategory, setFilesByCategory] = useState<Record<string, UploadedFile[]>>({
    identity: backgroundCheck?.documents
      .filter((d) => d.type === "identification")
      .map((d) => ({ name: d.name, size: "2.1 MB", type: "image/jpeg", category: "identity", previewUrl: d.fileUrl })) || [],
    certifications: backgroundCheck?.documents
      .filter((d) => d.type === "credential")
      .map((d) => ({ name: d.name, size: "1.8 MB", type: "application/pdf", category: "certifications", previewUrl: d.fileUrl })) || [],
    business: [],
    insurance: [],
    additional: [],
  })

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    identity: true,
    certifications: true,
    business: true,
    insurance: false,
    additional: false,
  })

  const [dragOver, setDragOver] = useState<string | null>(null)
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const getCompletedCount = () => {
    return VERIFICATION_CATEGORIES.filter(
      (cat) => cat.required && filesByCategory[cat.id]?.length > 0
    ).length
  }

  const getRequiredCount = () => VERIFICATION_CATEGORIES.filter((c) => c.required).length

  const getProgressPercentage = () => {
    if (backgroundCheck?.status === "approved") return 100
    const required = getRequiredCount()
    const completed = getCompletedCount()
    return Math.round((completed / required) * 80)
  }

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleFiles = useCallback((files: FileList, categoryId: string) => {
    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      category: categoryId,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))
    setFilesByCategory((prev) => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), ...newFiles],
    }))
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, categoryId: string) => {
      e.preventDefault()
      setDragOver(null)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files, categoryId)
      }
    },
    [handleFiles]
  )

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault()
    setDragOver(categoryId)
  }

  const handleDragLeave = () => {
    setDragOver(null)
  }

  const removeFile = (categoryId: string, index: number) => {
    setFilesByCategory((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].filter((_, i) => i !== index),
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files, categoryId)
      e.target.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-medium">
                Business Verification
              </h1>
              <p className="text-sm text-muted-foreground">
                {getCompletedCount()} of {getRequiredCount()} required categories completed
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {provider?.backgroundCheckStatus === "verified" ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <Shield className="h-8 w-8 text-primary" />
              )}
              <div>
                <p className="text-sm font-semibold">Current Status</p>
                <VerificationBadge
                  status={provider?.backgroundCheckStatus || "none"}
                  showLabel
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Verification Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VERIFICATION_CATEGORIES.map((category) => {
            const files = filesByCategory[category.id] || []
            const isExpanded = expandedCategories[category.id]
            const hasFiles = files.length > 0
            const CategoryIcon = category.icon

            return (
              <Card key={category.id} className="overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full text-left"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                        hasFiles
                          ? "bg-green-700 text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {hasFiles ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <CategoryIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{category.title}</h4>
                        {category.required && (
                          <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {hasFiles
                          ? `${files.length} file${files.length > 1 ? "s" : ""} uploaded`
                          : category.description}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                  </CardContent>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3">
                    {/* Uploaded Files */}
                    {files.length > 0 && (
                      <div className="flex flex-col gap-2 mb-3">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg border bg-secondary/30 p-3"
                          >
                            {file.previewUrl ? (
                              <div className="h-10 w-10 rounded-md overflow-hidden border shrink-0">
                                <Image
                                  src={file.previewUrl || "/placeholder.svg"}
                                  alt={file.name}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.size}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {file.previewUrl && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setPreviewFile(file)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Preview</span>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                onClick={() => removeFile(category.id, index)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Drag and Drop Zone */}
                    <div
                      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer ${
                        dragOver === category.id
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                      onDrop={(e) => handleDrop(e, category.id)}
                      onDragOver={(e) => handleDragOver(e, category.id)}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRefs.current[category.id]?.click()}
                    >
                      <input
                        ref={(el) => { fileInputRefs.current[category.id] = el }}
                        type="file"
                        className="hidden"
                        accept={category.accepts}
                        multiple
                        onChange={(e) => handleInputChange(e, category.id)}
                      />
                      <Upload
                        className={`h-6 w-6 mb-2 ${
                          dragOver === category.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <p className="text-sm font-medium text-center">
                        {dragOver === category.id
                          ? "Drop files here"
                          : "Drag & drop files here"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or click to browse - {category.accepts.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Info card */}
        <Card className="mt-6 border-0 bg-primary/5 shadow-none">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <h4 className="mb-1 text-sm font-semibold">Why Get Verified?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Build trust with clients, earn a verified badge, and rank higher in search
                results for repair services. All documents are reviewed within 2-3 business days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        {getCompletedCount() >= getRequiredCount() && backgroundCheck?.status !== "approved" && (
          <div className="mt-6">
            <Button className="w-full h-12 text-base">
              <Shield className="h-5 w-5 mr-2" />
              Submit for Review
            </Button>
          </div>
        )}
      </div>

      {/* File Preview Lightbox */}
      {previewFile && previewFile.previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewFile(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview: ${previewFile.name}`}
        >
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
            <h3 className="text-white text-sm font-medium truncate max-w-[70%]">
              {previewFile.name}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-9 w-9"
              onClick={() => setPreviewFile(null)}
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div
            className="relative max-w-[90vw] max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={previewFile.previewUrl || "/placeholder.svg"}
              alt={previewFile.name}
              width={900}
              height={1200}
              className="rounded-lg shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
