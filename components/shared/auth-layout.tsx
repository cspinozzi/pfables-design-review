import type { ReactNode } from "react"

/**
 * Shared shell for auth screens (login, signup).
 * - Centers content in the viewport with a slight upward bias.
 * - Renders the ProMusic logo as a subtle full-bleed background.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden -mt-28">
      <div className="pointer-events-none select-none absolute inset-0 opacity-[0.01]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-logo.svg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
