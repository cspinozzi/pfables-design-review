import { User, Briefcase, Wrench, ShieldCheck, type LucideIcon } from "lucide-react"
import type { UserRole } from "./mock-data"

export type RoleConfig = {
  /** Canonical role id, matches UserRole in mock-data */
  id: UserRole
  /** Short label for UI chips, demo buttons */
  shortLabel: string
  /** Descriptive label for signup cards and headers */
  label: string
  /** One-line description used in signup role picker */
  description: string
  /** Icon used consistently across auth, navigation, dashboards */
  icon: LucideIcon
  /** Path to redirect to after a successful login/signup */
  dashboardPath: string
}

/**
 * Single source of truth for role metadata.
 * Order matters: used for demo buttons and signup role picker.
 */
export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  parent: {
    id: "parent",
    shortLabel: "Parent",
    label: "Parent",
    description: "Find music teachers and services for your children",
    icon: User,
    dashboardPath: "/browse",
  },
  provider: {
    id: "provider",
    shortLabel: "Provider",
    label: "Music Teacher",
    description: "Offer lessons and music education services",
    icon: Briefcase,
    dashboardPath: "/provider/dashboard",
  },
  repair: {
    id: "repair",
    shortLabel: "Repair",
    label: "Repair Service",
    description: "Provide instrument repair and maintenance",
    icon: Wrench,
    dashboardPath: "/repairer/dashboard",
  },
  admin: {
    id: "admin",
    shortLabel: "Admin",
    label: "Admin",
    description: "Manage the ProMusic platform",
    icon: ShieldCheck,
    dashboardPath: "/admin/dashboard",
  },
}

/** Ordered list used by the auth screens (excludes admin from signup) */
export const AUTH_ROLES: UserRole[] = ["parent", "provider", "repair", "admin"]
export const SIGNUP_ROLES: UserRole[] = ["parent", "provider", "repair"]

/** Resolve the right post-auth redirect for a role */
export function getRoleRedirectPath(role: UserRole): string {
  return ROLE_CONFIG[role].dashboardPath
}
