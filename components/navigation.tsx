"use client"
// Navigation component with scroll-aware styling
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import {
  LogOut,
  User,
  Home,
  Search,
  MessageSquare,
  LayoutDashboard,
  UserCircle,
  ClipboardList,
  CreditCard,
  ShieldCheck,
  Users,
  QrCode,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Heart,
  ChevronDown,
  BookOpen,
  Wrench,
  Star,
} from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Logo, LogoIcon } from "@/components/logo"

export function Navigation() {
  const { user, logout, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number | null>(null)
  
  // Consolidated scroll state to reduce re-renders
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    isPastDarkSections: false,
    useWhiteText: false,
    isFullBleedPage: false,
  })
  
  const fullBleedPages = useMemo(() => ["/", "/providers", "/repair-services", "/luthiers"], [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keep isFullBleedPage in sync when pathname changes via client-side navigation
  useEffect(() => {
    const isFullBleed = fullBleedPages.includes(pathname)
    setScrollState(prev => ({ ...prev, isFullBleedPage: isFullBleed }))
  }, [pathname, fullBleedPages])

  // Track scroll position for transparent navbar effect with throttling
  useEffect(() => {
    const computeScrollState = () => {
      const scrollY = window.scrollY
      const isScrolled = scrollY > 50
      
      // Check if we've scrolled past the dark sections (hero)
      let isPastDarkSections = false
      const lightSection = document.getElementById('made-for-everyone') || 
                          document.getElementById('light-section-start')
      if (lightSection) {
        const sectionTop = lightSection.getBoundingClientRect().top
        isPastDarkSections = sectionTop < 100
      } else {
        const heroHeight = window.innerHeight * 0.7
        isPastDarkSections = scrollY > heroHeight
      }

      const isFullBleed = fullBleedPages.includes(pathname)
      const useWhiteText = isFullBleed && !isPastDarkSections
      
      return { isScrolled, isPastDarkSections, useWhiteText, isFullBleedPage: isFullBleed }
    }
    
    const handleScroll = () => {
      // Throttle scroll updates to every 100ms
      if (scrollThrottleRef.current) return
      
      scrollThrottleRef.current = window.setTimeout(() => {
        scrollThrottleRef.current = null
        
        const newState = computeScrollState()
        
        // Batch all state updates into single setState call
        setScrollState(prev => {
          // Only update if values changed
          if (prev.isScrolled === newState.isScrolled && 
              prev.isPastDarkSections === newState.isPastDarkSections &&
              prev.useWhiteText === newState.useWhiteText &&
              prev.isFullBleedPage === newState.isFullBleedPage) {
            return prev
          }
          return newState
        })
      }, 100)
    }

    // Set initial state immediately (no throttle delay)
    setScrollState(computeScrollState())
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollThrottleRef.current) clearTimeout(scrollThrottleRef.current)
    }
  }, [pathname, fullBleedPages])

  const navLinks = useMemo(() => {
    if (!user) {
      return [
        { href: "/providers", label: "Providers", icon: Users },
        { href: "/repair-services", label: "Repairs", icon: User },
        { href: "/browse", label: "Explore", icon: Search },
        { href: "/login", label: "Login", icon: LogOut },
      ]
    }

    if (user.role === "parent") {
      return [
        { href: "/browse", label: "Browse", icon: Search },
        { href: "/parent/coming", label: "Lessons", icon: ClipboardList },
        { href: "/parent/payments", label: "Payments", icon: CreditCard },
      ]
    }

    if (user.role === "provider") {
      return [
        { href: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/provider/lessons", label: "Lessons", icon: BookOpen },
        { href: "/provider/payments", label: "Payments", icon: DollarSign },
        { href: "/provider/reviews", label: "Reviews", icon: Star },
      ]
    }

    if (user.role === "repair") {
      return [
        { href: "/repairer/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/repairer/orders", label: "Orders", icon: Wrench },
        { href: "/repairer/payments", label: "Payments", icon: DollarSign },
        { href: "/repairer/reviews", label: "Reviews", icon: Star },
      ]
    }

    if (user.role === "admin") {
      return [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/verification", label: "Verify", icon: ShieldCheck },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/payments", label: "Payments", icon: DollarSign },
        { href: "/admin/refunds", label: "Refunds", icon: CreditCard },
      ]
    }

    return []
  }, [user])

  const secondaryLinks = useMemo(() => {
    if (!user) return []

    if (user.role === "parent") {
      return []
    }

    if (user.role === "provider") {
      return []
    }

    if (user.role === "admin") {
      return [{ href: "/admin/qr-codes", label: "QR Codes", icon: QrCode }]
    }

    return []
  }, [user])
  
  const bottomNavLinks = navLinks

  // Wait for localStorage hydration before rendering — show basic nav with logo
  if (isLoading) {
    const isFullBleed = fullBleedPages.includes(pathname)
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
          <nav className={cn(
            "flex items-center justify-between w-full max-w-[900px] px-8 sm:px-10 py-3 sm:py-4 rounded-full transition-all duration-500",
            isFullBleed ? "glass-dark" : "glass"
          )}>
            <Logo size="sm" inverted={isFullBleed} />
            <div className="flex items-center gap-6 sm:gap-8">
              <Link href="/providers" className={cn("text-sm font-medium transition-colors", isFullBleed ? "text-white/70" : "text-muted-foreground")}>Providers</Link>
              <Link href="/repair-services" className={cn("text-sm font-medium transition-colors", isFullBleed ? "text-white/70" : "text-muted-foreground")}>Repairs</Link>
              <Link href="/browse" className={cn("text-sm font-medium transition-colors", isFullBleed ? "text-white/70" : "text-muted-foreground")}>Explore</Link>
              <Link href="/login" className={cn("text-sm font-medium transition-colors", isFullBleed ? "text-white/70" : "text-muted-foreground")}>Login</Link>
            </div>
          </nav>
        </div>
        {!isFullBleed && <div className="h-[120px]" />}
      </>
    )
  }

  if (!user) {
    // Pages with full-bleed hero images (no spacer needed, navbar floats over hero)
    const isHomePage = pathname === "/"
    
    return (
      <>
        {/* Pill Navbar Container */}
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
          <nav 
            className={cn(
              "flex items-center justify-between w-full max-w-[900px] px-8 sm:px-10 py-3 sm:py-4 rounded-full transition-all duration-500",
              scrollState.useWhiteText
                ? "glass-dark"
                : "glass"
            )}
          >
            <Logo size="sm" inverted={scrollState.useWhiteText} />

            <div className="flex items-center gap-6 sm:gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm transition-colors duration-300",
                      scrollState.useWhiteText
                        ? isActive
                          ? "text-white font-bold"
                          : "text-white/70 hover:text-white font-medium"
                        : isActive
                          ? "text-foreground font-bold"
                          : "text-muted-foreground hover:text-foreground font-medium",
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
        {/* Spacer to prevent content from going under fixed navbar - only on pages without full-bleed heroes */}
        {!scrollState.isFullBleedPage && <div className="h-[120px]" />}
      </>
    )
  }

  const homeHref = user?.role === "provider" ? "/provider/dashboard" : user?.role === "repair" ? "/repairer/dashboard" : user?.role === "admin" ? "/admin/dashboard" : "/browse"

  const handleLogout = () => {
    logout()
    // Fallback redirect in case auth context doesn't handle it
    setTimeout(() => {
      router.push("/login")
    }, 100)
  }

  return (
    <>
      {/* Horizontal Pill Navbar for logged-in users - always light */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
        <nav 
          className="flex items-center justify-between w-full max-w-[1100px] px-6 sm:px-8 py-3 rounded-full glass sm:py-2"
        >
          {/* Logo */}
          <Logo size="sm" href={homeHref} />

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={`nav-${idx}`}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors duration-300",
                    isActive
                      ? "text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground font-medium",
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            {secondaryLinks.map((link, idx) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={`secondary-${idx}`}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors duration-300",
                    isActive
                      ? "text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground font-medium",
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right side: Messages + User Dropdown */}
          <div className="hidden sm:flex items-center gap-5">
            {/* Messages Icon with Notification */}
            <Link 
              href={user?.role === "admin" ? "/admin/messages" : "/messages"} 
              className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted/50 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              {/* Red notification dot - shown when there are unread messages */}
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Link>

            {/* User Dropdown Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="relative h-7 w-7 rounded-full overflow-hidden bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} fill sizes="28px" className="object-cover" />
                  ) : (
                    <span className="text-sm font-medium leading-none">{user.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isUserMenuOpen && "rotate-180")} />
              </button>

              {/* Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-background shadow-lg py-1 z-50">
                  {user.role === "parent" && (
                    <>
                      <Link
                        href="/parent/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        Profile
                      </Link>
                      <Link
                        href="/parent/lessons/history"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        History
                      </Link>
                      <Link
                        href="/parent/favorites"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        Favorites
                      </Link>
                    </>
                  )}
                  {user.role === "provider" && (
                    <>
                      <Link
                        href="/provider/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        Profile
                      </Link>
                      <Link
                        href="/provider/lessons/history"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        History
                      </Link>
                      <Link
                        href="/provider/verification"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        Verification
                      </Link>
                      <Link
                        href="/provider/subscription"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        Subscription
                      </Link>
                    </>
                  )}
                  {user.role === "repair" && (
                    <>
                      <Link
                        href="/repairer/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        Profile
                      </Link>
                      <Link
                        href="/repairer/verification"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        Verification
                      </Link>
                      <Link
                        href="/repairer/subscription"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        Subscription
                      </Link>
                    </>
                  )}
                  {user.role === "admin" && (
                    <Link
                      href="/admin/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      Profile
                    </Link>
                  )}
                  <div className="border-t border-border my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      handleLogout()
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-sm sm:hidden">
        <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {bottomNavLinks.map((link, idx) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={`bottom-${idx}`}
                href={link.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            )
          })}

          {/* Messages */}
          <Link
            href={user?.role === "admin" ? "/admin/messages" : "/messages"}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-all duration-200",
              pathname.includes("/messages") ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            <div className="relative">
              <MessageSquare className={cn("h-5 w-5", pathname.includes("/messages") && "fill-primary/20")} />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
            </div>
            <span className="text-[10px] font-medium">Messages</span>
          </Link>

          {/* Favorites - parent only */}
          {user?.role === "parent" && (
            <Link
              href="/parent/favorites"
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-all duration-200",
                pathname === "/parent/favorites" ? "text-primary" : "text-muted-foreground hover:text-primary",
              )}
            >
              <Heart className={cn("h-5 w-5", pathname === "/parent/favorites" && "fill-primary/20")} />
              <span className="text-[10px] font-medium">Favorites</span>
            </Link>
          )}

          {/* Profile */}
          <Link
            href={user?.role === "provider" ? "/provider/profile" : user?.role === "repair" ? "/repairer/profile" : user?.role === "admin" ? "/admin/profile" : "/parent/profile"}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-all duration-200",
              (pathname === "/parent/profile" || pathname === "/provider/profile" || pathname === "/repairer/profile" || pathname === "/admin/profile") ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            {user?.avatar ? (
              <div className="relative h-5 w-5 rounded-full overflow-hidden">
                <Image src={user.avatar} alt={user.name} fill sizes="20px" className="object-cover" />
              </div>
            ) : (
              <UserCircle className={cn("h-5 w-5", (pathname === "/parent/profile" || pathname === "/provider/profile" || pathname === "/repairer/profile" || pathname === "/admin/profile") && "fill-primary/20")} />
            )}
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Spacer for content - skip on full-bleed pages that sit under the navbar */}
      {!scrollState.isFullBleedPage && <div className="h-[120px]" />}
      
      {/* Mobile Bottom Spacer */}
      <div className="h-[120px] sm:hidden" />
    </>
  )
}
