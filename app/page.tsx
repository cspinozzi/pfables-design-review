"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Users,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Search,
  Zap,
  MapPin,
  BadgeCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  const [selectedUserType, setSelectedUserType] = useState<"parents" | "providers" | "repair">("parents")
  const [activeUserType, setActiveUserType] = useState<number | null>(null)

  // Redirect logged-in users to their respective landing page
  useEffect(() => {
    if (user) {
      if (user.role === "parent") {
        router.push("/browse")
      } else if (user.role === "provider") {
        router.push("/provider/dashboard")
      } else if (user.role === "repair") {
        router.push("/repairer/dashboard")
      } else if (user.role === "admin") {
        router.push("/admin/dashboard")
      }
    }
  }, [user, router])

  const features = [
    {
      icon: ShieldCheck,
      title: "Trusted connections",
      description: "Every provider is carefully verified, so you can choose with confidence.",
    },
    {
      icon: Zap,
      title: "Quick and easy",
      description: "Find the right music teacher for your family in just a few moments.",
    },
    {
      icon: MapPin,
      title: "Right in your neighborhood",
      description: "Connect with local professionals who understand your community.",
    },
  ]

  const metrics = [
    { value: "100%", label: "verified teachers" },
    { value: "< 60s", label: "average search time" },
    { label: "Free for families" },
  ]

  const userTypes = [
    {
      id: "parents",
      title: "Music teachers you can trust, close to home",
      description: "Browse verified music teachers, repair services, and instrument rentals, all in one place.",
      features: ["No account required to explore", "Direct contact with teachers", "Clear verification badges"],
      cta: "Start browsing",
      href: "/browse",
      primary: true,
    },
    {
      id: "providers",
      title: "Grow your practice with families who value music",
      description: "Reach local families looking for music services and build your client base at your own pace.",
      features: ["Simple lead requests", "Customizable profile", "Trusted verification system"],
      cta: "Join as a provider",
      href: "/login?role=provider",
      primary: false,
    },
    {
      id: "repair",
      title: "Care for instruments that matter",
      description: "Offer repair and restoration services to musicians who want expert, local care.",
      features: ["Showcase your craftsmanship", "Receive repair requests directly", "Build long-term reputation"],
      cta: "Join as repair service",
      href: "/login?role=repair",
      primary: false,
    },
  ]

  const isParents = selectedUserType === "parents";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-man-guitar.jpg"
            alt="Man playing guitar"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/50 to-transparent" />
        </div>

        {/* Content - Left aligned */}
        <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 pt-[200px] pb-24">
          <div className="max-w-2xl">
            <p className="mb-6 text-sm text-white/70 tracking-wide">
              Your trusted music companion
            </p>
            
            <h1 className="mb-6 font-display text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-[1.1]">
              Find the perfect music teacher for your family
            </h1>
            
            <p className="mb-12 text-lg text-white/80 leading-relaxed max-w-xl">
              Music matters. But finding the right teacher should not be stressful or uncertain.
            </p>

            {/* CTA Buttons with underlines */}
            <div className="flex flex-col sm:flex-row gap-8 mb-16">
              <Link 
                href="/browse"
                className="group inline-flex flex-col items-start"
              >
                <span className="text-white text-lg font-medium mb-2 group-hover:text-white/90 transition-colors">
                  Start exploring
                </span>
                <span className="h-0.5 w-full bg-white group-hover:bg-white/80 transition-colors" />
              </Link>
              <Link 
                href="/login?role=provider"
                className="group inline-flex flex-col items-start"
              >
                <span className="text-white text-lg font-medium mb-2 group-hover:text-white/90 transition-colors">
                  Join as a provider
                </span>
                <span className="h-0.5 w-full bg-white group-hover:bg-white/80 transition-colors" />
              </Link>
            </div>

            {/* Metrics in single line */}
            <div className="flex items-center gap-2 text-white/60 text-sm flex-wrap">
              <span className="text-white font-medium">{metrics[2].label}</span>
              <span className="mx-2">·</span>
              <span className="text-white font-medium">{metrics[1].value}</span>
              <span>average search time</span>
              <span className="mx-2">·</span>
              <span className="text-white font-medium">{metrics[0].value}</span>
              <span>{metrics[0].label}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <section className="bg-[#2c1810]">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
            <Image
              src="/icon-dark.png"
              alt="ProMusic"
              width={32}
              height={32}
              className="h-6 w-6 shrink-0 object-contain"
            />
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              We help families connect with caring, verified music professionals in their own community.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Interactive Two Column - Clay Background */}
      <section className="bg-[#d4c4b8]">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 sm:pb-28">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4 text-[#1a0f0a]">Here to help you every step</h2>
              <p className="text-[#1a0f0a]/80 text-lg max-w-xl mx-auto">
                Finding the right music teacher should feel calm, simple, and reassuring.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
              {/* Left: Feature Buttons */}
              <div className="lg:w-2/5 flex flex-col gap-2">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  const isActive = activeFeature === index || (activeFeature === null && index === 0)
                  return (
                    <button
                      key={index}
                      type="button"
                      className={cn(
                        "group flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ease-out",
                        isActive 
                          ? "bg-[#2c1810]/15 shadow-sm" 
                          : "hover:bg-[#2c1810]/10"
                      )}
                      onMouseEnter={() => setActiveFeature(index)}
                    >
                      <div className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
                        isActive 
                          ? "bg-[#2c1810]/20" 
                          : "bg-[#2c1810]/10 group-hover:bg-[#2c1810]/15"
                      )}>
                        <Icon className={cn(
                          "h-4 w-4 transition-all duration-300",
                          isActive ? "text-[#1a0f0a]" : "text-[#1a0f0a]/70"
                        )} />
                      </div>
                      <h3 className={cn(
                        "font-display text-sm font-medium transition-colors duration-300",
                        isActive ? "text-[#1a0f0a]" : "text-[#1a0f0a]/60"
                      )}>{feature.title}</h3>
                    </button>
                  )
                })}
              </div>

              {/* Right: Feature Content */}
              <div className="lg:w-3/5 relative">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  const isActive = activeFeature === index || (activeFeature === null && index === 0)
                  return (
                    <div
                      key={index}
                      className={cn(
                        "transition-all duration-400 ease-out",
                        isActive 
                          ? "opacity-100 translate-y-0" 
                          : "opacity-0 absolute inset-0 translate-y-4 pointer-events-none"
                      )}
                    >
                      <Card className="border border-[#2c1810]/15 bg-[#2c1810]/10 backdrop-blur-sm">
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-start gap-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2c1810]/15">
                              <Icon className="h-6 w-6 text-[#1a0f0a]" />
                            </div>
                            <div>
                              <h3 className="font-display text-xl font-medium mb-2 text-[#1a0f0a]">{feature.title}</h3>
                              <p className="text-[#1a0f0a]/80 leading-relaxed mb-4">
                                {feature.description}
                              </p>
                              <Link 
                                href="/browse"
                                className="inline-flex items-center text-[#1a0f0a] text-sm font-medium hover:text-[#1a0f0a]/70"
                              >
                                Learn more
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section - Tabs with Offset Image */}
      <section id="made-for-everyone" className="border-b border-border/50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-24 my-0 sm:pb-52 sm:pt-32">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4 pr-0 pb-1">Made for everyone</h2>
            <p className="text-muted-foreground text-lg pb-0">
              Whether you are looking for music lessons or sharing your talents.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row max-w-6xl mx-auto items-end lg:gap-2 py-0">
            {/* Left: Tabs Content */}
            <div className="w-full lg:w-1/2 max-w-xl">
              {/* Tab Buttons */}
              <div className="flex justify-center lg:justify-start mb-2.5">
                <div className="inline-flex rounded-full bg-secondary/50 p-1.5 py-0">
                  <button
                    type="button"
                    onClick={() => setSelectedUserType("parents")}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                      selectedUserType === "parents"
                        ? "bg-card text-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    For Parents
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUserType("providers")}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                      selectedUserType === "providers"
                        ? "bg-card text-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    For Teachers
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUserType("repair")}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                      selectedUserType === "repair"
                        ? "bg-card text-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    For Repair Services
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="relative overflow-hidden">
                {userTypes.map((type, index) => {
                  const isVisible = type.id === selectedUserType
                  
                  return (
                    <div
                      key={type.id}
                      className={cn(
                        "transition-all duration-400 ease-out",
                        isVisible 
                          ? "opacity-100 translate-x-0" 
                          : "opacity-0 absolute inset-0 pointer-events-none translate-x-8"
                      )}
                    >
                      <Card className="border-2 border-border/50">
                        <CardContent className="p-8 sm:p-10">
                          <h3 className="mb-3 font-display text-2xl font-medium text-primary">
                            {type.title}
                          </h3>
                          <p className="mb-8 text-muted-foreground leading-relaxed text-lg">
                            {type.description}
                          </p>
                          
                          <ul className="mb-10 space-y-4">
                            {type.features.map((feature, featureIndex) => (
                              <li 
                                key={featureIndex} 
                                className="flex items-start gap-3 text-base"
                                style={{ 
                                  animation: isVisible ? `fadeInUp 0.4s ease-out ${featureIndex * 100}ms both` : "none"
                                }}
                              >
                                <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-accent" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <Button 
                            asChild 
                            variant={type.primary ? "default" : "outline"} 
                            size="lg"
                            className="w-full"
                          >
                            <Link href={type.href}>
                              {type.cta}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Offset Image */}
            <div className="w-full lg:w-1/2 relative text-left py-0">
              <div className="relative lg:translate-x-12 xl:translate-x-20">
                {/* Image container with offset effect */}
                <div className={cn(
                  "relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-out",
                  selectedUserType === "parents" ? "rotate-1" : selectedUserType === "providers" ? "-rotate-1" : "rotate-0"
                )}>
                  <Image
                    src={
                      selectedUserType === "parents" 
                        ? "/parent-woman.jpg" 
                        : selectedUserType === "providers"
                          ? "/music-teacher-woman.jpg"
                          : "/footer-guitar.jpg"
                    }
                    alt={
                      selectedUserType === "parents" 
                        ? "Parent with child learning music" 
                        : selectedUserType === "providers"
                          ? "Music teacher with student"
                          : "Instrument repair and craftsmanship"
                    }
                    width={600}
                    height={500}
                    className="w-full h-[350px] sm:h-[400px] lg:h-[450px] object-cover transition-all duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                </div>
                
                {/* Decorative offset shape */}
                <div className={cn(
                  "absolute -z-10 rounded-3xl bg-primary/10 transition-all duration-500",
                  selectedUserType === "parents" 
                    ? "inset-0 translate-x-4 translate-y-4" 
                    : selectedUserType === "providers"
                      ? "inset-0 -translate-x-4 translate-y-4"
                      : "inset-0 translate-y-4"
                )} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Big Footer CTA with Background Image */}
      <footer className="relative min-h-[70vh] flex flex-col overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/footer-guitar.jpg"
            alt="Guitar leaning on chair in cozy room"
            fill
            className="object-cover object-center"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/70 to-foreground/50" />
        </div>

        {/* CTA Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 text-white max-w-2xl mx-auto leading-tight">
              Ready to begin your musical journey?
            </h2>
            <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Take your time. We are here whenever you are ready to find the right teacher for you or your family.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 shadow-lg"
            >
              <Link href="/browse">
                Start exploring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="relative z-10 mt-auto">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-6">
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Image
                  src="/icon-dark.png"
                  alt="ProMusic"
                  width={24}
                  height={24}
                  className="h-5 w-5 shrink-0 object-contain"
                />
                <span>Your music companion</span>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 text-sm">
                <Link href="/login" className="text-white/60 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/login?role=provider" className="text-white/60 hover:text-white transition-colors">
                  Join as provider
                </Link>
                <Link href="/login?role=repair" className="text-white/60 hover:text-white transition-colors">
                  Join as repair service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
