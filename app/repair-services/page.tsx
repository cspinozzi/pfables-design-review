"use client"

import { CheckCircle, ArrowRight, Wrench, Sparkles, PenTool, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function RepairServicesPage() {
  const benefits = [
    "Showcase your craftsmanship with a dedicated profile",
    "Receive repair requests directly from local musicians",
    "Build long-term reputation through verified reviews",
    "Highlight your specialties and instrument expertise",
    "Set your own pricing and turnaround times",
    "Connect with music teachers and their students",
  ]

  const services = [
    {
      icon: Wrench,
      title: "Repairs & Maintenance",
      description: "String changes, setups, fret work, crack repairs, and general maintenance to keep instruments playing their best.",
    },
    {
      icon: Sparkles,
      title: "Restorations",
      description: "Bring vintage and damaged instruments back to life with careful restoration that preserves their character.",
    },
    {
      icon: PenTool,
      title: "Custom Work",
      description: "Custom builds, modifications, and upgrades tailored to each musician's unique playing style.",
    },
    {
      icon: MessageCircle,
      title: "Consultations",
      description: "Expert advice on instrument care, purchasing decisions, and identifying potential issues.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/footer-guitar.jpg"
            alt="Guitar craftsmanship"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm text-white/70 tracking-wide">
              For Repair Services
            </p>
            
            <h1 className="mb-6 font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]">
              Care for instruments that matter
            </h1>
            
            <p className="mb-10 text-lg text-white/80 leading-relaxed max-w-xl">
              Musicians trust their instruments to skilled craftspeople. Connect with local musicians who need expert repair and restoration services.
            </p>

            <Link 
              href="/login?role=repair"
              className="group inline-flex flex-col items-start"
            >
              <span className="text-white text-lg font-medium mb-2 group-hover:text-white/90 transition-colors">
                Join as repair service
              </span>
              <span className="h-0.5 w-full bg-white group-hover:bg-white/80 transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Strip */}
      <section className="bg-[#1a0f0a]">
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
              Build your reputation in the community while doing what you love.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section - Dark */}
      <section className="bg-[#2c1810]">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4 text-white">Why repair services choose ProMusic</h2>
              <p className="text-white/70 text-lg max-w-xl mx-auto">
                Everything you need to grow your craft business.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-white/80" />
                  <span className="text-white/80 text-sm leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Light */}
      <section id="made-for-everyone" className="border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4">Services you can offer</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Showcase your expertise in multiple areas.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <Card key={service.title} className="border-2 border-border/50 bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                          <Icon className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-medium mb-2">{service.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* Luthier Photo Carousel */}
        <div className="overflow-hidden py-12 sm:py-16">
          <div className="flex animate-scroll gap-6">
            {[
              { src: "/luthier-carousel-1.jpg", alt: "Luthier working on violin" },
              { src: "/luthier-carousel-2.jpg", alt: "Crafting guitar wood" },
              { src: "/luthier-carousel-3.jpg", alt: "Restoring a cello" },
              { src: "/luthier-carousel-4.jpg", alt: "Examining guitar neck" },
              { src: "/luthier-carousel-5.jpg", alt: "Stringing a violin" },
              { src: "/luthier-carousel-1.jpg", alt: "Luthier working on violin" },
              { src: "/luthier-carousel-2.jpg", alt: "Crafting guitar wood" },
              { src: "/luthier-carousel-3.jpg", alt: "Restoring a cello" },
              { src: "/luthier-carousel-4.jpg", alt: "Examining guitar neck" },
              { src: "/luthier-carousel-5.jpg", alt: "Stringing a violin" },
            ].map((image, index) => (
              <div 
                key={index} 
                className="relative h-64 w-80 flex-shrink-0 overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
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
              Ready to connect with musicians?
            </h2>
            <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Join ProMusic and offer your expertise to a community that values quality craftsmanship.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 shadow-lg"
            >
              <Link href="/login?role=repair">
                Join as repair service
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
