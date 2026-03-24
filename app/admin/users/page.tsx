"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerificationBadge } from "@/components/verification-badge"
import { mockProviders, mockUsers } from "@/lib/mock-data"
import { Search, ExternalLink, Music, Wrench, User, ChevronLeft, ChevronRight, MapPin } from "lucide-react"

type TabType = "all" | "parents" | "providers" | "repairers"
const PAGE_SIZE = 20

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [parentPage, setParentPage] = useState(1)

  const parents = mockUsers.filter((u) => u.role === "parent")
  const providers = mockProviders.filter((p) => p.providerType === "teacher")
  const repairers = mockProviders.filter((p) => p.providerType === "repair")

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "all", label: "All", count: parents.length + providers.length + repairers.length },
    { key: "parents", label: "Parents", count: parents.length },
    { key: "providers", label: "Providers", count: providers.length },
    { key: "repairers", label: "Repairers", count: repairers.length },
  ]

  const filteredParents = parents.filter(
    (u) =>
      searchQuery === "" ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.location && u.location.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredProviders = providers.filter(
    (p) =>
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredRepairers = repairers.filter(
    (p) =>
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Pagination for parents
  const totalParentPages = Math.ceil(filteredParents.length / PAGE_SIZE)
  const paginatedParents = filteredParents.slice(
    (parentPage - 1) * PAGE_SIZE,
    parentPage * PAGE_SIZE,
  )

  // Reset page on search or tab change
  const handleSearchChange = (v: string) => {
    setSearchQuery(v)
    setParentPage(1)
  }
  const handleTabChange = (t: TabType) => {
    setActiveTab(t)
    setParentPage(1)
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      <div className="page-container pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-1 font-display text-2xl font-medium">User Management</h1>
          <p className="text-sm text-muted-foreground">View and manage all platform users</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <Card className="flex flex-col items-center justify-center p-4">
            <User className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{parents.length}</p>
            <p className="text-xs text-muted-foreground">Parents</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4">
            <Music className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{providers.length}</p>
            <p className="text-xs text-muted-foreground">Providers</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4">
            <Wrench className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{repairers.length}</p>
            <p className="text-xs text-muted-foreground">Repairers</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-4">
            <User className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{parents.length + providers.length + repairers.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or location..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Parents List */}
        {(activeTab === "all" || activeTab === "parents") && filteredParents.length > 0 && (
          <div className="mb-10">
            {activeTab === "all" && (
              <h2 className="font-display text-xl font-medium mb-4">Parents ({filteredParents.length})</h2>
            )}
            <div className="flex flex-col gap-3">
              {paginatedParents.map((parent) => (
                <Link key={parent.id} href={`/admin/users/${parent.id}`}>
                  <Card className="p-4 transition-colors hover:bg-secondary/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={parent.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-sm">{parent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-semibold text-sm truncate">{parent.name}</h4>
                          <Badge variant="outline" className="text-[11px]">Parent</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          <span>{parent.email}</span>
                          {parent.location && (
                            <span className="flex items-center gap-0.5">
                              <MapPin className="h-3 w-3" />
                              {parent.location}
                            </span>
                          )}
                          {parent.joinedDate && (
                            <span>Joined {parent.joinedDate}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[11px] shrink-0">Active</Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalParentPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">
                  Showing {(parentPage - 1) * PAGE_SIZE + 1}-{Math.min(parentPage * PAGE_SIZE, filteredParents.length)} of {filteredParents.length} parents
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-transparent"
                    disabled={parentPage === 1}
                    onClick={() => setParentPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {parentPage} / {totalParentPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-transparent"
                    disabled={parentPage === totalParentPages}
                    onClick={() => setParentPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Providers List */}
        {(activeTab === "all" || activeTab === "providers") && filteredProviders.length > 0 && (
          <div className="mb-10">
            {activeTab === "all" && (
              <h2 className="font-display text-xl font-medium mb-4">Providers ({filteredProviders.length})</h2>
            )}
            <div className="flex flex-col gap-3">
              {filteredProviders.map((provider) => (
                <Link key={provider.id} href={`/admin/users/${provider.userId}`}>
                  <Card className="p-4 transition-colors hover:bg-secondary/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={provider.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-sm">{provider.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-semibold text-sm truncate">{provider.name}</h4>
                          <VerificationBadge status={provider.backgroundCheckStatus} size="sm" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{provider.specialty.join(", ")}</span>
                          <span>·</span>
                          <span>{provider.location}</span>
                          <Badge variant="outline" className="text-[11px]">{provider.subscriptionTier}</Badge>
                          <Badge variant="secondary" className="text-[11px]">{provider.rating} stars</Badge>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Repairers List */}
        {(activeTab === "all" || activeTab === "repairers") && filteredRepairers.length > 0 && (
          <div className="mb-10">
            {activeTab === "all" && (
              <h2 className="font-display text-xl font-medium mb-4">Repairers ({filteredRepairers.length})</h2>
            )}
            <div className="flex flex-col gap-3">
              {filteredRepairers.map((repairer) => (
                <Link key={repairer.id} href={`/admin/users/${repairer.userId}`}>
                  <Card className="p-4 transition-colors hover:bg-secondary/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={repairer.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-sm">{repairer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-semibold text-sm truncate">{repairer.name}</h4>
                          <VerificationBadge status={repairer.backgroundCheckStatus} size="sm" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{repairer.specialty.join(", ")}</span>
                          <span>·</span>
                          <span>{repairer.location}</span>
                          <Badge variant="outline" className="text-[11px]">{repairer.subscriptionTier}</Badge>
                          <Badge variant="secondary" className="text-[11px]">{repairer.rating} stars</Badge>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty states */}
        {activeTab === "parents" && filteredParents.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No parents found</p>
          </Card>
        )}
        {activeTab === "providers" && filteredProviders.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No providers found</p>
          </Card>
        )}
        {activeTab === "repairers" && filteredRepairers.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No repairers found</p>
          </Card>
        )}
      </div>
    </div>
  )
}
