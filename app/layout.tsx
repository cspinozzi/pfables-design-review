import type React from "react"
import type { Metadata, Viewport } from "next"
import { Fraunces, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { Navigation } from "@/components/navigation"
import { Toaster } from "sonner"
import { ScrollToTop } from "@/components/scroll-to-top"
import "./globals.css"

const fraunces = Fraunces({ 
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})
const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ProMusic - Your Trusted Music Companion",
  description:
    "A supportive companion connecting music families with verified local music teachers and repair services. Find trusted music lessons, repairs, tuning, and rentals with care.",
  generator: "v0.app",
  keywords: ["music lessons", "piano teacher", "guitar lessons", "music tutors", "instrument repair", "piano tuning"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/icon-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/icon-light.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#c9785c" },
    { media: "(prefers-color-scheme: dark)", color: "#a86048" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <AuthProvider>
          <ScrollToTop />
          <Navigation />
          <main>{children}</main>
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
