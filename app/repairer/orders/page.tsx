"use client"

import { useState, Suspense } from "react"
import { ServiceCard } from "@/components/service-card"
import { ServiceDetailModal } from "@/components/service-detail-modal"
import { ReviewDisplay, type ReviewData } from "@/components/review-display"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, Clock, MapPin, User, Wrench, DollarSign, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMockMessages } from "@/hooks/use-mock-messages"
import { useAuth } from "@/lib/auth-context"


type OrderStatus = "active" | "completed" | "cancelled"
type FilterKey = "active" | "received"

interface Order {
  id: string
  title: string
  client: string
  clientAvatar: string
  instrument: string
  date: Date
  dropOff: string
  estCompletion: string
  location: string
  quote: number
  status: OrderStatus
  paid?: boolean
  pendingApproval?: boolean
  review?: ReviewData
}



export default function RepairerOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <RepairerOrdersContent />
    </Suspense>
  )
}

function RepairerOrdersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { conversations } = useMockMessages()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const initialTab = searchParams.get("tab")
  const [filter, setFilter] = useState<FilterKey>(initialTab === "received" ? "received" : "active")

  const handleMessageClient = (clientName: string) => {
    const conv = conversations.find((c) =>
      c.participants.some((p) => p.name === clientName && p.id !== user?.id)
    )
    router.push(conv ? `/repairer/messages?conv=${conv.id}` : `/repairer/messages`)
  }

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "order-1", title: "Violin Bridge Replacement", client: "Sarah Thompson",
      clientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      instrument: "1920 German Violin", date: new Date("2026-02-06"), dropOff: "10:00 AM",
      estCompletion: "3-5 days", location: "In-Shop", quote: 180, status: "active",
    },
    {
      id: "order-2", title: "Bow Rehair", client: "James Park",
      clientAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      instrument: "Cello Bow - Pernambuco", date: new Date("2026-02-06"), dropOff: "2:00 PM",
      estCompletion: "1-2 days", location: "In-Shop", quote: 85, status: "active",
    },
    {
      id: "order-3", title: "Soundpost Adjustment", client: "Maria Santos",
      clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      instrument: "Viola - 15.5 inch", date: new Date("2026-02-07"), dropOff: "11:00 AM",
      estCompletion: "Same day", location: "In-Shop", quote: 60, status: "active",
    },
    {
      id: "order-ip1", title: "Full Setup & Adjustment", client: "David Lee",
      clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      instrument: "Student Violin 4/4", date: new Date("2026-02-03"), dropOff: "9:00 AM",
      estCompletion: "Feb 8", location: "In-Shop", quote: 120, status: "active",
    },
    {
      id: "order-ip2", title: "Crack Repair & Varnish Touch-up", client: "Anna Chen",
      clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      instrument: "French Cello - 1890", date: new Date("2026-02-01"), dropOff: "10:30 AM",
      estCompletion: "Feb 10", location: "In-Shop", quote: 450, status: "active",
    },
    {
      id: "order-p1", title: "String Replacement", client: "Robert Johnson",
      clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      instrument: "Classical Guitar", date: new Date("2026-02-08"), dropOff: "3:00 PM",
      estCompletion: "1 day", location: "In-Shop", quote: 45, status: "active", pendingApproval: true,
    },
    {
      id: "order-c1", title: "Bow Rehair", client: "Sarah Thompson",
      clientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      instrument: "Violin Bow - Carbon Fiber", date: new Date("2026-01-28"), dropOff: "Completed Jan 30",
      estCompletion: "Picked up", location: "In-Shop", quote: 75, status: "completed", paid: true,
      review: {
        id: "review-r1",
        rating: 5,
        comment: "Excellent work! The bow feels like new. Very professional service and quick turnaround. Highly recommend!",
        reviewerName: "Sarah Thompson",
        reviewerAvatar: "/parent-woman.jpg",
        date: new Date("2026-01-31"),
      },
    },
    {
      id: "order-c2", title: "Fingerboard Planing", client: "James Park",
      clientAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      instrument: "Cello", date: new Date("2026-01-25"), dropOff: "Completed Jan 27",
      estCompletion: "Picked up", location: "In-Shop", quote: 200, status: "completed", paid: true,
      review: {
        id: "review-r2",
        rating: 5,
        comment: "Perfect fingerboard work. The action is smooth and playing feels much better now. Great craftsmanship.",
        reviewerName: "James Park",
        reviewerAvatar: "/avatars/jake-patterson.jpg",
        date: new Date("2026-01-28"),
      },
    },
    {
      id: "order-c3", title: "Peg Fitting", client: "Maria Santos",
      clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      instrument: "Viola", date: new Date("2026-01-20"), dropOff: "Completed Jan 22",
      estCompletion: "Picked up", location: "In-Shop", quote: 90, status: "completed", paid: false,
    },
    {
      id: "order-x1", title: "Neck Reset", client: "David Lee",
      clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      instrument: "Acoustic Guitar", date: new Date("2026-01-18"), dropOff: "Cancelled Jan 19",
      estCompletion: "N/A", location: "In-Shop", quote: 350, status: "cancelled",
    },
  ])

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o))
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const activeOrders = orders.filter((o) => o.status === "active")
  const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "cancelled")

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

  const filters: { key: FilterKey; label: string }[] = [
    { key: "active", label: `Active (${activeOrders.length})` },
    { key: "received", label: `Received (${completedOrders.length})` },
  ]

  const currentOrders = filter === "active" ? activeOrders : filter === "received" ? completedOrders : completedOrders

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-12">
      <div className="page-container pt-6">
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium text-foreground">Repair Orders</h1>
          <p className="text-sm text-muted-foreground">View and manage your repair jobs</p>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {currentOrders.length > 0 ? (
          <div className="space-y-10">
            {currentOrders.map((order) => (
              <ServiceCard
                key={order.id}
                image={order.clientAvatar}
                imageAlt={order.client}
                title={order.title}
                subtitle={order.instrument}
                price={`$${order.quote}`}
                priceClassName={
                  order.status === "cancelled" || order.paid === true ? "text-muted-foreground" : "text-primary"
                }
                status={order.status === "completed" && order.paid === true ? "paid" : order.status === "completed" && order.paid === false ? "completed" : order.status === "cancelled" ? "cancelled" : order.pendingApproval ? "pending" : "active"}
                onClick={() => setSelectedOrder(order)}
                details={
                  <>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {order.client}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(order.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Est. {order.estCompletion}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {order.location}
                    </span>
                  </>
                }
                footer={order.pendingApproval ? (
                  <div className="flex items-center justify-end gap-2 px-4 sm:px-6 py-3 bg-primary rounded-b-xl">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full px-5 font-semibold"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, pendingApproval: false } : o))
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full px-5 font-semibold text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: "cancelled", pendingApproval: false } : o))
                      }}
                    >
                      Decline
                    </Button>
                </div>
                ) : undefined}
              >
                {order.review && (
                  <ReviewDisplay review={order.review} serviceName={order.title} />
                )}
              </ServiceCard>
              ))}
            </div>
          ) : (
          <Card className="p-8 text-center">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-1">No orders found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "active" ? "You have no active repair orders" : "No completed repairs yet"}
            </p>
          </Card>
        )}

        {selectedOrder && (
          <ServiceDetailModal
            open={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            title={selectedOrder.title}
            subtitle={selectedOrder.instrument}
            status={selectedOrder.status}
            onStatusChange={(s) => handleStatusChange(selectedOrder.id, s as OrderStatus)}
            people={[
              { name: selectedOrder.client, role: "Customer", avatar: selectedOrder.clientAvatar },
            ]}
            fields={[
              { icon: <Wrench className="h-4 w-4" />, label: "Instrument", value: selectedOrder.instrument },
              { icon: <Calendar className="h-4 w-4" />, label: "Date Received", value: formatDate(selectedOrder.date) },
              { icon: <Clock className="h-4 w-4" />, label: "Drop-off", value: selectedOrder.dropOff },
              { icon: <FileText className="h-4 w-4" />, label: "Est. Completion", value: selectedOrder.estCompletion },
              { icon: <MapPin className="h-4 w-4" />, label: "Location", value: selectedOrder.location },
              { icon: <DollarSign className="h-4 w-4" />, label: "Quote", value: `$${selectedOrder.quote}` },
            ]}
            price={`$${selectedOrder.quote}`}
            onMessage={() => {
              handleMessageClient(selectedOrder.client)
              setSelectedOrder(null)
            }}
            messageLabel="Message Client"
            review={selectedOrder.review}
          />
        )}
      </div>
    </div>
  )
}
