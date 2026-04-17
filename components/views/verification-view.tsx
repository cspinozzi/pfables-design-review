"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VerificationBadge } from "@/components/verification-badge"
import { useAuth } from "@/lib/auth-context"
import { mockBackgroundChecks, mockProviders } from "@/lib/mock-data"
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  type LucideIcon,
  Shield,
  Trash2,
  Upload,
  X,
} from "lucide-react"

export interface VerificationCategory {
  id: string
  title: string
  description: string
  required: boolean
  accepts: string
  icon: LucideIcon
  /** Whether the category should preload uploads tagged with these mock document types. */
  prefillTypes?: Array<"identification" | "credential">
  /** Whether the category is expanded on first render. */
  defaultExpanded?: boolean
}

interface UploadedFile {
  name: string
  size: string
  type: string
  category: string
  previewUrl?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export interface VerificationViewProps {
  title: string
  infoTitle: string
  infoDescription: string
  categories: VerificationCategory[]
}

export function VerificationView({ title, infoTitle, infoDescription, categories }: VerificationViewProps) {
  const { user } = useAuth()
  const provider = mockProviders.find((p) => p.userId === user?.id)
  const backgroundCheck = mockBackgroundChecks.find((bg) => bg.providerId === provider?.id)

  const [filesByCategory, setFilesByCategory] = useState<Record<string, UploadedFile[]>>(() => {
    const initial: Record<string, UploadedFile[]> = {}
    for (const category of categories) {
      if (category.prefillTypes && backgroundCheck) {
        initial[category.id] = backgroundCheck.documents
          .filter((d) => category.prefillTypes?.includes(d.type as "identification" | "credential"))
          .map((d) => ({
            name: d.name,
            size: d.type === "identification" ? "2.1 MB" : "1.8 MB",
            type: d.type === "identification" ? "image/jpeg" : "application/pdf",
            category: category.id,
            previewUrl: d.fileUrl,
          }))
      } else {
        initial[category.id] = []
      }
    }
    return initial
  })

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const category of categories) {
      initial[category.id] = category.defaultExpanded ?? false
    }
    return initial
  })

  const [dragOver, setDragOver] = useState<string | null>(null)
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const requiredCategories = categories.filter((c) => c.required)
  const completedRequired = requiredCategories.filter((c) => (filesByCategory[c.id]?.length || 0) > 0).length

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
    [handleFiles],
  )

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
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-medium">{title}</h1>
              <p className="text-sm text-muted-foreground">
                {completedRequired} of {requiredCategories.length} required categories completed
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
                <VerificationBadge status={provider?.backgroundCheckStatus || "none"} showLabel size="sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => {
            const files = filesByCategory[category.id] || []
            const isExpanded = expandedCategories[category.id]
            const hasFiles = files.length > 0
            const CategoryIcon = category.icon
            return (
              <Card key={category.id} className="overflow-hidden">
                <button onClick={() => toggleCategory(category.id)} className="w-full text-left">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                        hasFiles ? "bg-green-700 text-white" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {hasFiles ? <CheckCircle2 className="h-5 w-5" /> : <CategoryIcon className="h-5 w-5" />}
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

                {isExpanded && (
                  <div className="px-4 pb-4 pt-3">
                    {files.length > 0 && (
                      <div className="flex flex-col gap-2 mb-3">
                        {files.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
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

                    <div
                      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer ${
                        dragOver === category.id
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                      onDrop={(e) => handleDrop(e, category.id)}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOver(category.id)
                      }}
                      onDragLeave={() => setDragOver(null)}
                      onClick={() => fileInputRefs.current[category.id]?.click()}
                    >
                      <input
                        ref={(el) => {
                          fileInputRefs.current[category.id] = el
                        }}
                        type="file"
                        className="hidden"
                        accept={category.accepts}
                        multiple
                        onChange={(e) => handleInputChange(e, category.id)}
                      />
                      <Upload
                        className={`h-6 w-6 mb-2 ${
                          dragOver === category.id ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <p className="text-sm font-medium text-center">
                        {dragOver === category.id ? "Drop files here" : "Drag & drop files here"}
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

        <Card className="mt-6 border-0 bg-primary/5 shadow-none">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <h4 className="mb-1 text-sm font-semibold">{infoTitle}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{infoDescription}</p>
            </div>
          </CardContent>
        </Card>

        {completedRequired >= requiredCategories.length && backgroundCheck?.status !== "approved" && (
          <div className="mt-6">
            <Button className="w-full h-12 text-base">
              <Shield className="h-5 w-5 mr-2" />
              Submit for Review
            </Button>
          </div>
        )}
      </div>

      {previewFile && previewFile.previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewFile(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview: ${previewFile.name}`}
        >
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
            <h3 className="text-white text-sm font-medium truncate max-w-[70%]">{previewFile.name}</h3>
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
          <div className="relative max-w-[90vw] max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
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
