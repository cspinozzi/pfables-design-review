"use client"

import { CheckCircle, ArrowRight, Users, BadgeCheck, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ProvidersPage() {
  const benefits = [
    "Simple lead generation from verified families",
    "Customizable profile to showcase your expertise",
    "Trusted verification badge to build credibility",
    "Direct communication with potential students",
    "Set your own rates and availability",
    "No platform fees on lessons you deliver",
  ]

  const steps = [
    {
      number: "1",
      title: "Create your profile",
      description: "Sign up and build your professional profile with your experience, specialties, and rates.",
    },
    {
      number: "2",
      title: "Get verified",
      description: "Complete our verification process to earn a trusted badge and increase visibility.",
    },
    {
      number: "3",
      title: "Connect with students",
      description: "Receive lead requests from families and start building lasting teaching relationships.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/music-teacher-woman.jpg"
            alt="Music teacher"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm text-white/70 tracking-wide">
              For Music Providers
            </p>
            
            <h1 className="mb-6 font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]">
              Grow your practice with families who value music
            </h1>
            
            <p className="mb-10 text-lg text-white/80 leading-relaxed max-w-xl">
              Connect directly with local families actively seeking music lessons. No bidding wars, no complicated algorithms. Just genuine connections.
            </p>

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
              Build your client base at your own pace, with students who are ready to learn.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section - Dark */}
      <section className="bg-[#2c1810]">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4 text-white">Why providers choose ProMusic</h2>
              <p className="text-white/70 text-lg max-w-xl mx-auto">
                Everything you need to grow your teaching practice.
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

      {/* How It Works - Light */}
      <section id="made-for-everyone" className="border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4">How it works</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Get started in three simple steps.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.number} className="border-2 border-border/50 bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {step.number}
                    </div>
                    <h3 className="font-display text-lg font-medium mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Teacher Photo Carousel */}
        <div className="overflow-hidden py-12 sm:py-16">
          <div className="flex animate-scroll gap-6">
            {[
              { src: "/teacher-carousel-1.jpg", alt: "Piano teacher in studio" },
              { src: "/teacher-carousel-2.jpg", alt: "Guitar teacher" },
              { src: "/teacher-carousel-3.jpg", alt: "Drums teacher" },
              { src: "/teacher-carousel-4.jpg", alt: "Saxophone teacher" },
              { src: "/teacher-carousel-5.jpg", alt: "Voice teacher" },
              { src: "/teacher-carousel-1.jpg", alt: "Piano teacher in studio" },
              { src: "/teacher-carousel-2.jpg", alt: "Guitar teacher" },
              { src: "/teacher-carousel-3.jpg", alt: "Drums teacher" },
              { src: "/teacher-carousel-4.jpg", alt: "Saxophone teacher" },
              { src: "/teacher-carousel-5.jpg", alt: "Voice teacher" },
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
              Ready to grow your teaching practice?
            </h2>
            <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Join ProMusic today and connect with families who value quality music education.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 shadow-lg"
            >
              <Link href="/login?role=provider">
                Join as a provider
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
