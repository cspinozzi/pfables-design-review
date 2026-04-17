"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProfileAvatarUpload } from "@/components/profile-avatar-upload"

export interface ProfileHeaderProps {
  title: string
  subtitle: string
  /** Optional right-side actions (save button, dropdown, etc.). */
  actions?: ReactNode
  /** Override the avatar size. Defaults to "lg". */
  avatarSize?: "sm" | "md" | "lg"
  className?: string
}

export function ProfileHeader({ title, subtitle, actions, avatarSize = "lg", className }: ProfileHeaderProps) {
  const { user, updateUser } = useAuth()

  return (
    <div className={`mb-6 flex items-center justify-between gap-4 ${className ?? ""}`}>
      <div className="flex items-center gap-5 min-w-0">
        <ProfileAvatarUpload
          src={user?.avatar}
          name={user?.name || ""}
          size={avatarSize}
          editable
          onAvatarChange={(dataUrl) => updateUser({ avatar: dataUrl })}
        />
        <div className="min-w-0">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground truncate">{title}</h1>
          <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
