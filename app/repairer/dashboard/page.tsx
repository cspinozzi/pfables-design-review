"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Wrench, MessageCircle, DollarSign, Clock, Timer, ChevronRight, ShieldCheck, CheckCircle2, AlertCircle, Phone, MapPin, Calendar, ClipboardList, Users, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VerificationBadge } from "@/components/verification-badge"
import { useAuth } from "@/lib/auth-context"
import { mockProviders, mockConversations } from "@/lib/mock-data"
import { useMockMessages } from "@/hooks/use-mock-messages"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { ServiceCard } from "@/components/service-card"
import dynamic from "next/dynamic"
const ServiceDetailModal = dynamic(() => import("@/components/service-detail-modal").then(m => ({ default: m.ServiceDetailModal })), { ssr: false })
import { toast } from "sonner"

interface ServiceRequest {
  id: string
  title: string
  client: string
  clientId: string
  clientAvatar: string
  date: string
  instrument: string
  estCompletion: string
  location: string
}

export default function RepairerDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { conversations } = useMockMessages()
  const provider = mockProviders.find((p) => p.userId === user?.id)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)

  const [requests, setRequests] = useState<ServiceRequest[]>([
    { id: "sr-1", title: "Violin Bridge Replacement", client: "Sarah Thompson", clientId: "user-1", clientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", date: "Thu, Feb 6", instrument: "1920 German Violin", estCompletion: "3-5 days", location: "In-Shop" },
    { id: "sr-2", title: "Bow Rehair", client: "James Park", clientId: "user-2", clientAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", date: "Thu, Feb 6", instrument: "Cello Bow", estCompletion: "1-2 days", location: "In-Shop" },
    { id: "sr-3", title: "Soundpost Adjustment", client: "Maria Santos", clientId: "user-3", clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", date: "Fri, Feb 7", instrument: "Viola", estCompletion: "Same day", location: "In-Shop" },
  ])

  const handleMessage = (clientName: string) => {
    const conv = conversations.find((c) =>
      c.participants.some((p) => p.name === clientName && p.id !== user?.id)
    )
    if (conv) {
      router.push(`/repairer/messages?conv=${conv.id}`)
    } else {
      router.push(`/repairer/messages`)
    }
  }

  const handleAccept = (request: ServiceRequest) => {
    setRequests((prev) => prev.filter((r) => r.id !== request.id))
    toast.success("Service Confirmed", {
      description: `${request.title} for ${request.client} has been confirmed.`,
    })
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold">Repair Profile Not Found</h1>
          <p className="text-muted-foreground">Please contact support to set up your repair service profile.</p>
        </div>
      </div>
    )
  }

  const repairerConversations = mockConversations.filter((conv) => conv.participants.some((p) => p.id === user?.id))

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        {/* Stats Grid */}
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="flex flex-col items-center justify-center p-4">
              <Wrench className="h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold">28</p>
              <p className="text-xs text-muted-foreground">Repairs</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <Users className="h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold">18</p>
              <p className="text-xs text-muted-foreground">Clients</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <Clock className="h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold">$350</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <DollarSign className="h-5 w-5 text-primary mb-1" />
              <p className="text-2xl font-bold">$8,420</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </Card>
          </div>
        </div>

        {provider.backgroundCheckStatus !== "approved" && (
          <div className="mb-10">
            <Card className="border-warning/50 bg-warning/5 p-5">
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <VerificationBadge status={provider.backgroundCheckStatus} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 text-sm">
                      {provider.backgroundCheckStatus === "pending"
                        ? "Verification In Progress"
                        : provider.backgroundCheckStatus === "rejected"
                          ? "Verification Issue"
                          : "Get Verified"}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {provider.backgroundCheckStatus === "pending"
                        ? "Usually takes 2-3 business days"
                        : provider.backgroundCheckStatus === "rejected"
                          ? "Contact support for details"
                          : "Gain client trust with verification"}
                    </p>
                    {provider.backgroundCheckStatus === "none" && (
                      <Button asChild size="sm" className="h-9 w-full">
                        <Link href="/repairer/verification">Start Verification</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Service Requests */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-medium">Service Requests</h2>
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link href="/repairer/orders?tab=requested">
                View All
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="space-y-10">
            {requests.length === 0 ? (
              <Card className="p-5">
                <div className="py-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 font-semibold text-sm">All caught up</h3>
                  <p className="text-xs text-muted-foreground">No pending service requests</p>
                </div>
              </Card>
            ) : null}
            {requests.map((request) => (
              <ServiceCard
                key={request.id}
                image={request.clientAvatar}
                imageAlt={request.client}
                title={request.title}
                subtitle={request.instrument}
                onClick={() => setSelectedRequest(request)}
                details={
                  <>
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{request.client}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{request.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Est. {request.estCompletion}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{request.location}</span>
                  </>
                }
                footer={
                  <div className="flex flex-wrap items-center justify-end gap-2 px-4 sm:px-6 py-3 bg-primary rounded-b-xl" onClick={(e) => e.stopPropagation()}>
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs rounded-full border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/20 gap-1.5">
                      <Link href={`/browse/${request.clientId}`}>
                        <User className="h-3 w-3" />
                        View Profile
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs rounded-full border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/20 gap-1.5" onClick={() => handleMessage(request.client)}>
                      <MessageCircle className="h-3 w-3" />
                      Message
                    </Button>
                    <Button size="sm" className="h-7 text-xs rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/80 gap-1.5" onClick={() => handleAccept(request)}>
                      <CheckCircle2 className="h-3 w-3" />
                      Accept
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        </div>

        {/* Leads / Inquiries */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-medium">Inquiries</h2>
            <Badge variant="secondary" className="text-xs">
              {repairerConversations.length} {repairerConversations.length === 1 ? "inquiry" : "inquiries"}
            </Badge>
          </div>

          {repairerConversations.length === 0 ? (
            <Card className="p-5">
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 font-semibold text-sm">No inquiries yet</h3>
                <p className="mb-4 text-xs text-muted-foreground">Complete your profile to attract clients</p>
                <Button asChild size="sm">
                  <Link href="/repairer/profile">Complete Profile</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-10">
              {repairerConversations.map((conv) => {
                const client = conv.participants.find((p) => p.role === "parent")
                return (
                  <Card key={conv.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Link href="/repairer/messages" className="block p-4 active:bg-accent transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={client?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-sm">{client?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {conv.unreadCount > 0 && (
                              <div className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-background">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <h4 className="font-semibold text-sm truncate">{client?.name}</h4>
                              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(conv.lastMessage.timestamp, { addSuffix: true }).replace("about ", "")}
                              </span>
                            </div>
                            <p className={`text-xs line-clamp-1 ${conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                              {conv.lastMessage.content}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                        <div className="flex gap-2 mt-3 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-3 text-xs rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
                            onClick={(e) => {
                              e.preventDefault()
                              window.location.href = `tel:555-0123`
                            }}
                          >
                            <Phone className="mr-1.5 h-3.5 w-3.5" />
                            Call
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-3 text-xs rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
                            onClick={(e) => {
                              e.preventDefault()
                              window.location.href = `/browse/${client?.id}`
                            }}
                          >
                            <User className="mr-1.5 h-3.5 w-3.5" />
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 px-3 text-xs rounded-full"
                          >
                            <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                            Reply
                          </Button>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Verification - only show when not fully verified */}
        {provider.backgroundCheckStatus !== "approved" && (
          <div className="mb-10">
            <h2 className="font-semibold mb-5">Verification</h2>
            <Card className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Background Check</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {provider.backgroundCheckStatus === "pending"
                      ? "Under review - usually 2-3 business days"
                      : provider.backgroundCheckStatus === "rejected"
                        ? "There was an issue with your verification"
                        : "Get verified to build trust with clients"}
                  </p>
                </div>
                <div className="shrink-0">
                  {provider.backgroundCheckStatus === "pending" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                      <Clock className="h-3.5 w-3.5" />
                      Pending
                    </span>
                  )}
                  {provider.backgroundCheckStatus === "rejected" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Rejected
                    </span>
                  )}
                  {provider.backgroundCheckStatus === "none" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      Not Started
                    </span>
                  )}
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/repairer/verification">
                  {provider.backgroundCheckStatus === "none" ? "Start Verification" : "View Details"}
                </Link>
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <ServiceDetailModal
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={selectedRequest.title}
          subtitle={selectedRequest.instrument}
          status="pending"
          people={[
            { name: selectedRequest.client, role: "Customer" },
          ]}
          fields={[
            { icon: <Wrench className="h-4 w-4" />, label: "Instrument", value: selectedRequest.instrument },
            { icon: <Calendar className="h-4 w-4" />, label: "Date", value: selectedRequest.date },
            { icon: <Clock className="h-4 w-4" />, label: "Est. Completion", value: selectedRequest.estCompletion },
            { icon: <MapPin className="h-4 w-4" />, label: "Location", value: selectedRequest.location },
          ]}
          onMessage={() => {
            handleMessage(selectedRequest.client)
            setSelectedRequest(null)
          }}
          messageLabel="Message Client"
          extraActions={
            <Button className="flex-1 rounded-full" onClick={() => {
              handleAccept(selectedRequest)
              setSelectedRequest(null)
            }}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Accept
            </Button>
          }
        />
      )}
    </div>
  )
}
