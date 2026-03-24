"use client"

import React from "react"

import { useRef } from "react"
import Image from "next/image"
import { Pencil, User } from "lucide-react"

interface ProfileAvatarUploadProps {
  src?: string | null
  name: string
  size?: "md" | "lg"
  editable?: boolean
  onAvatarChange?: (dataUrl: string) => void
}

export function ProfileAvatarUpload({
  src,
  name,
  size = "lg",
  editable = false,
  onAvatarChange,
}: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = size === "lg"
    ? "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28"
    : "h-16 w-16 sm:h-20 sm:w-20"

  const iconSize = size === "lg" ? "h-10 w-10" : "h-8 w-8"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      onAvatarChange?.(dataUrl)
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  return (
    <div className="relative flex-shrink-0 group">
      <div
        className={`relative ${sizeClasses} overflow-hidden rounded-full border-4 border-background bg-muted`}
      >
        {src ? (
          <Image
            src={src || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <User className={`${iconSize} text-muted-foreground`} />
          </div>
        )}
      </div>

      {editable && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-110"
            aria-label="Change profile photo"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Upload profile photo"
          />
        </>
      )}
    </div>
  )
}
