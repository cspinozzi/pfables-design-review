import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  showText?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  href?: string
  inverted?: boolean // For use on dark backgrounds (e.g., hero section)
}

const sizeMap = {
  sm: { height: 28 },
  md: { height: 40 },
  lg: { height: 52 },
}

export function Logo({ showText = true, size = "md", className, href = "/", inverted = false }: LogoProps) {
  const { height } = sizeMap[size]
  
  const content = (
    <span className={cn("flex items-center gap-2", className)}>
      {inverted ? (
        // Inverted (white) icon for dark backgrounds
        <Image
          src="/icon-dark.png"
          alt="ProMusic"
          width={height}
          height={height}
          className="h-auto object-contain"
          style={{ width: "auto", height }}
          priority
        />
      ) : (
        <>
          {/* Light mode icon - shown on light backgrounds */}
          <Image
            src="/icon-light.png"
            alt="ProMusic"
            width={height}
            height={height}
            className="h-auto object-contain dark:hidden"
            style={{ width: "auto", height }}
            priority
          />
          {/* Dark mode icon - shown on dark backgrounds */}
          <Image
            src="/icon-dark.png"
            alt="ProMusic"
            width={height}
            height={height}
            className="h-auto object-contain hidden dark:block"
            style={{ width: "auto", height }}
            priority
          />
        </>
      )}
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    )
  }

  return content
}

// Icon-only version for collapsed sidebars, mobile, and favicon use
export function LogoIcon({ size = "md", className, inverted = false }: { size?: "sm" | "md" | "lg"; className?: string; inverted?: boolean }) {
  const { height } = sizeMap[size]
  
  return (
    <span className={cn("flex items-center", className)}>
      {inverted ? (
        // Inverted (white) icon for dark backgrounds
        <Image
          src="/icon-dark.png"
          alt="ProMusic"
          width={height}
          height={height}
          className="h-auto object-contain"
          style={{ width: "auto", height }}
          priority
        />
      ) : (
        <>
          {/* Light mode icon - shown on light backgrounds */}
          <Image
            src="/icon-light.png"
            alt="ProMusic"
            width={height}
            height={height}
            className="h-auto object-contain dark:hidden"
            style={{ width: "auto", height }}
            priority
          />
          {/* Dark mode icon - shown on dark backgrounds */}
          <Image
            src="/icon-dark.png"
            alt="ProMusic"
            width={height}
            height={height}
            className="h-auto object-contain hidden dark:block"
            style={{ width: "auto", height }}
            priority
          />
        </>
      )}
    </span>
  )
}
