"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useApproval } from "@/lib/approval-context"
import {
  mockUsers,
  mockProviders,
  mockBackgroundChecks,
  mockSubscriptions,
  mockServiceContracts,
  getParentProfile,
  generateParentPayments,
  type Provider,
} from "@/lib/mock-data"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Star,
  ShieldCheck,
  Music,
  Wrench,
  User as UserIcon,
  GraduationCap,
  Users,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Download,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const user = mockUsers.find((u) => u.id === userId)
  const provider = mockProviders.find((p) => p.userId === userId || p.id === userId)
  const parentProfile = user?.role === "parent" ? getParentProfile(userId) : null

  const displayName = user?.name || provider?.name || "Unknown User"
  const displayEmail = user?.email || provider?.email || ""
  const displayAvatar = user?.avatar || provider?.avatar || ""
  const displayRole = user?.role || (provider?.providerType === "repair" ? "repair" : "provider")
  const displayLocation = user?.location || provider?.location || ""

  const bgCheck = provider ? mockBackgroundChecks.find((bg) => bg.providerId === provider.id) : null
  const subscription = provider ? mockSubscriptions.find((s) => s.providerId === provider.id) : null
  const contracts = mockServiceContracts.filter(
    (c) => c.parentId === userId || (provider && c.providerId === provider.id),
  )

  const [docStates, setDocStates] = useState<Record<string, boolean>>(() => {
    if (!bgCheck) return {}
    const states: Record<string, boolean> = {}
    for (const doc of bgCheck.documents) {
      states[doc.id] = bgCheck.status === "approved"
    }
    return states
  })

  const toggleDoc = (docId: string) => {
    setDocStates((prev) => ({ ...prev, [docId]: !prev[docId] }))
  }

  // Account approval state (shared via context)
  const { isApproved, approveProvider, revokeApproval } = useApproval()
  const accountApproved = provider ? isApproved(provider.id, provider.verified) : false

  // Lightbox state for document preview
  const [lightboxDoc, setLightboxDoc] = useState<{ name: string; fileUrl: string } | null>(null)
  const [lightboxZoom, setLightboxZoom] = useState(1)

  const closeLightbox = useCallback(() => {
    setLightboxDoc(null)
    setLightboxZoom(1)
  }, [])



  useEffect(() => {
    if (!lightboxDoc) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKey)
    }
  }, [lightboxDoc, closeLightbox])

  if (!user && !provider) {
    return (
      <div className="min-h-screen bg-background pb-20 sm:pb-12">
        <div className="page-container pt-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2 text-sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">User not found</p>
          </Card>
        </div>
      </div>
    )
  }

  const roleLabel = displayRole === "parent" ? "Parent" : displayRole === "provider" ? "Provider" : displayRole === "repair" ? "Repairer" : "Admin"
  const RoleIcon = displayRole === "parent" ? UserIcon : displayRole === "provider" ? Music : displayRole === "repair" ? Wrench : ShieldCheck

  // Payment data
  const parentPayments = parentProfile ? generateParentPayments(userId, parentProfile) : []
  const providerPayments = generateProviderPayments(provider, subscription)

  const payments = displayRole === "parent" ? parentPayments : providerPayments

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2 text-sm">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Users
        </Button>

        {/* User Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage src={displayAvatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xl">{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-medium">{displayName}</h1>
                <Badge variant="outline" className="text-xs">
                  {roleLabel}
                </Badge>
                {provider?.verified && (
                  <Badge className="text-xs bg-green-100 text-green-800 border-green-200">Verified</Badge>
                )}
                {parentProfile && (
                  <Badge
                    variant={parentProfile.accountStatus === "active" ? "default" : parentProfile.accountStatus === "inactive" ? "secondary" : "destructive"}
                    className="text-xs capitalize"
                  >
                    {parentProfile.accountStatus}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {displayEmail}
                </span>
                {(parentProfile?.phone || provider?.phone) && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {parentProfile?.phone || provider?.phone}
                  </span>
                )}
                {displayLocation && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {displayLocation}
                  </span>
                )}
                {user?.joinedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {user.joinedDate}
                  </span>
                )}
                {parentProfile?.lastActive && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Last active {parentProfile.lastActive}
                  </span>
                )}
              </div>
              {provider && (
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-xs text-muted-foreground">{provider.specialty.join(", ")}</span>
                  <span className="text-xs text-muted-foreground">-</span>
                  <span className="flex items-center gap-0.5 text-xs">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {provider.rating} ({provider.reviewCount} reviews)
                  </span>
                  <span className="text-xs text-muted-foreground">-</span>
                  <span className="text-xs text-muted-foreground">{provider.yearsExperience} years exp.</span>
                </div>
              )}
              {parentProfile?.notes && (
                <p className="text-xs text-muted-foreground mt-2 italic">{parentProfile.notes}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 shrink-0 sm:items-end">
              <Button asChild size="sm" className="gap-1.5">
                <Link href="/messages">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Send Message
                </Link>
              </Button>
              {provider && !accountApproved && (
                <Button
                  size="sm"
                  className="gap-1.5 bg-green-700 hover:bg-green-800 text-white"
                  onClick={() => provider && approveProvider(provider.id)}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Approve Account
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Stats Row - Parent */}
        {parentProfile && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Card className="p-4 text-center">
              <Users className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-display font-medium">{parentProfile.children.length}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </Card>
            <Card className="p-4 text-center">
              <Music className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-display font-medium">{parentProfile.activeLessons}</p>
              <p className="text-xs text-muted-foreground">Active Lessons/wk</p>
            </Card>
            <Card className="p-4 text-center">
              <GraduationCap className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-display font-medium">{parentProfile.completedLessons}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </Card>
            <Card className="p-4 text-center">
              <DollarSign className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-display font-medium">${parentProfile.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </Card>
          </div>
        )}

        {/* Quick Stats Row - Provider */}
        {provider && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Card className="p-4 text-center">
              <Star className="h-5 w-5 mx-auto text-amber-500 mb-1" />
              <p className="text-2xl font-display font-medium">{provider.rating}</p>
              <p className="text-xs text-muted-foreground">{provider.reviewCount} Reviews</p>
            </Card>
            <Card className="p-4 text-center">
              <GraduationCap className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-display font-medium">{provider.yearsExperience}</p>
              <p className="text-xs text-muted-foreground">Years Exp.</p>
            </Card>
            <Card className="p-4 text-center">
              <Music className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-display font-medium">{provider.services.length}</p>
              <p className="text-xs text-muted-foreground">Services</p>
            </Card>
            <Card className="p-4 text-center">
              <DollarSign className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-display font-medium capitalize">{provider.subscriptionTier}</p>
              <p className="text-xs text-muted-foreground">Plan</p>
            </Card>
          </div>
        )}

        {/* Two column layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">

            {/* Children / Students - Parent only */}
            {parentProfile && parentProfile.children.length > 0 && (
              <Card className="p-5">
                <h2 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Students / Children
                </h2>
                <div className="space-y-3">
                  {parentProfile.children.map((child, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium text-primary">{child.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{child.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {child.age} years old - {child.instrument}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-[11px] capitalize mb-1">{child.level}</Badge>
                        <p className="text-xs text-muted-foreground">{child.lessonsPerWeek}x/week</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Connected Providers - Parent only */}
            {parentProfile && parentProfile.connectedProviders.length > 0 && (
              <Card className="p-5">
                <h2 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Connected Providers
                </h2>
                <div className="space-y-3">
                  {parentProfile.connectedProviders.map((providerName, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Music className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm font-medium">{providerName}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Subscription Plan - Provider/Repairer */}
            {(provider || displayRole !== "parent") && (
              <Card className="p-5">
                <h2 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Subscription Plan
                </h2>
                {subscription ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Plan</span>
                      <Badge className="capitalize">{subscription.tier}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="text-sm font-medium">${subscription.price}/mo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={subscription.status === "active" ? "default" : "secondary"} className="capitalize">
                        {subscription.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Start Date</span>
                      <span className="text-sm">{subscription.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Next Billing</span>
                      <span className="text-sm">{subscription.nextBillingDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Payment</span>
                      <span className="text-sm">**** {subscription.paymentMethod.last4}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No active subscription</p>
                  </div>
                )}
              </Card>
            )}

            {/* Plan info for parents */}
            {displayRole === "parent" && (
              <Card className="p-5">
                <h2 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Account Plan
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <Badge>Free</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Type</span>
                    <span className="text-sm">Parent / Family</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Browsing</span>
                    <span className="text-sm text-green-700">Unlimited</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Messaging</span>
                    <span className="text-sm text-green-700">Enabled</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2 border-t">Parents browse and connect with providers for free. Payments are per-lesson directly to providers.</p>
                </div>
              </Card>
            )}

            {/* Documents - Provider/Repairer */}
            {(bgCheck || displayRole === "provider" || displayRole === "repair") && (
              <Card className="p-5">
                <h2 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Documents
                </h2>
                {bgCheck && bgCheck.documents.length > 0 ? (
                  <div className="space-y-3">
                    {bgCheck.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={() => {
                          if (doc.fileUrl) {
                            setLightboxDoc({ name: doc.name, fileUrl: doc.fileUrl })
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && doc.fileUrl) {
                            setLightboxDoc({ name: doc.name, fileUrl: doc.fileUrl })
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {doc.fileUrl ? (
                            <div className="h-10 w-10 rounded-md overflow-hidden border shrink-0">
                              <Image
                                src={doc.fileUrl || "/placeholder.svg"}
                                alt={doc.name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type} - Uploaded {formatDistanceToNow(doc.uploadedDate, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {docStates[doc.id] ? "Approved" : "Pending"}
                          </span>
                          <Switch
                            checked={docStates[doc.id] || false}
                            onCheckedChange={(checked) => {
                              // Prevent lightbox from opening when toggling switch
                              toggleDoc(doc.id)
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    ))}
                    {bgCheck.notes && (
                      <p className="text-xs text-muted-foreground italic mt-2 px-1">{bgCheck.notes}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      {bgCheck.status === "approved" ? (
                        <div className="flex items-center gap-1.5 text-sm text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Background check approved
                        </div>
                      ) : bgCheck.status === "pending" ? (
                        <div className="flex items-center gap-1.5 text-sm text-amber-600">
                          <Clock className="h-4 w-4" />
                          Pending review
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-sm text-red-600">
                          <XCircle className="h-4 w-4" />
                          Rejected
                        </div>
                      )}
                      {bgCheck.reviewedDate && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          Reviewed {formatDistanceToNow(bgCheck.reviewedDate, { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No documents submitted yet</p>
                  </div>
                )}
              </Card>
            )}

            {/* Admin Actions */}
            <Card className="p-5">
              <h2 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                Admin Actions
              </h2>
              <div className="space-y-3">
                {(displayRole === "provider" || displayRole === "repair") && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Account Approved</p>
                      <p className="text-xs text-muted-foreground">Approve this provider to appear in listings</p>
                    </div>
                    <Switch
                      checked={accountApproved}
                      onCheckedChange={(checked) => {
                        if (provider) {
                          if (checked) {
                            approveProvider(provider.id)
                          } else {
                            revokeApproval(provider.id)
                          }
                        }
                      }}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Account Active</p>
                    <p className="text-xs text-muted-foreground">Enable or disable this user account</p>
                  </div>
                  <Switch defaultChecked={parentProfile?.accountStatus !== "suspended"} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Email Verified</p>
                    <p className="text-xs text-muted-foreground">User email verification status</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                {displayRole === "parent" && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Can Book Lessons</p>
                      <p className="text-xs text-muted-foreground">Allow user to book new lessons</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                )}
                <div className="pt-3 border-t flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Reset Password
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs text-red-600 border-red-200 hover:bg-red-600/15 hover:text-red-700 hover:border-red-300 bg-transparent">
                    Suspend Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Provider Credentials */}
            {provider && (
              <Card className="p-5">
                <h2 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Credentials & Info
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Credentials</span>
                    <div className="flex flex-wrap gap-1.5">
                      {provider.credentials.map((cred) => (
                        <Badge key={cred} variant="secondary" className="text-xs">{cred}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Services Offered</span>
                    <div className="space-y-1.5">
                      {provider.services.map((svc) => (
                        <div key={svc.id} className="flex items-center justify-between text-sm">
                          <span>{svc.name}</span>
                          <span className="text-muted-foreground">{svc.pricing}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Service Area</span>
                    <p className="text-sm">{provider.serviceArea.join(", ")}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Availability</span>
                    <p className="text-sm">{provider.availability}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Bio</span>
                    <p className="text-sm text-muted-foreground">{provider.bio}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Payment History */}
            <Card className="p-5">
              <h2 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Payment History
              </h2>
              {payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-secondary/30"
                    >
                      <div>
                        <p className="text-sm font-medium">{payment.description}</p>
                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${payment.amount}</p>
                        <Badge
                          variant={payment.status === "paid" ? "default" : payment.status === "pending" ? "secondary" : "destructive"}
                          className="text-[11px]"
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No payment history</p>
                </div>
              )}
            </Card>

            {/* Service Contracts */}
            {contracts.length > 0 && (
              <Card className="p-5">
                <h2 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Service Contracts
                </h2>
                <div className="space-y-3">
                  {contracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-secondary/30"
                    >
                      <div>
                        <p className="text-sm font-medium">{contract.serviceName}</p>
                        <p className="text-xs text-muted-foreground">
                          with {contract.providerName}
                          {contract.sessionsCompleted != null && contract.sessionsTotal != null && (
                            <> - {contract.sessionsCompleted}/{contract.sessionsTotal} sessions</>
                          )}
                        </p>
                      </div>
                      <Badge variant={contract.status === "active" ? "default" : contract.status === "completed" ? "secondary" : "destructive"} className="text-[11px] capitalize">
                        {contract.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}


          </div>
        </div>
      </div>

      {/* Document Lightbox */}
      {lightboxDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Document preview: ${lightboxDoc.name}`}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-sm font-medium truncate max-w-[60%]">{lightboxDoc.name}</h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-9 w-9"
                onClick={() => setLightboxZoom((z) => Math.max(0.5, z - 0.25))}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-xs min-w-[3rem] text-center">{Math.round(lightboxZoom * 100)}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-9 w-9"
                onClick={() => setLightboxZoom((z) => Math.min(3, z + 0.25))}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <a
                href={lightboxDoc.fileUrl}
                download={lightboxDoc.name}
                className="inline-flex items-center justify-center h-9 w-9 text-white hover:bg-white/20 rounded-md transition-colors"
                aria-label="Download document"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="h-4 w-4" />
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-9 w-9"
                onClick={closeLightbox}
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxDoc.fileUrl || "/placeholder.svg"}
              alt={lightboxDoc.name}
              width={900}
              height={1200}
              className="rounded-lg shadow-2xl object-contain transition-transform duration-200"
              style={{ transform: `scale(${lightboxZoom})`, transformOrigin: "center center" }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Generate provider payment history
function generateProviderPayments(
  provider: Provider | undefined,
  subscription: { tier: string; price: number; status: string } | undefined | null,
) {
  const payments: { id: string; description: string; date: string; amount: number; status: "paid" | "pending" | "overdue" }[] = []

  if (provider && subscription) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    for (let i = 0; i < 6; i++) {
      const month = new Date()
      month.setMonth(month.getMonth() - i)
      payments.push({
        id: `pay-sub-${i}`,
        description: `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan - Monthly`,
        date: `${months[month.getMonth()]} ${month.getFullYear()}`,
        amount: subscription.price,
        status: i === 0 ? "pending" : "paid",
      })
    }
  }

  return payments
}
