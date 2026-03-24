import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-man-guitar.jpg"
          alt="Music room background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#1a0f0a]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="font-display text-7xl sm:text-9xl font-medium text-white mb-4">404</h1>
        <p className="text-xl sm:text-2xl text-white/80 mb-2">Page not found</p>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Looks like this page hit a wrong note. Let's get you back on track.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
