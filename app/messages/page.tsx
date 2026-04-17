"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, ArrowLeft } from "lucide-react"
import { useMockMessages } from "@/hooks/use-mock-messages"
import { useAuth } from "@/lib/auth-context"
import { mockProviders } from "@/lib/mock-data"
import { ConversationMenu } from "@/components/shared/conversation-menu"
import { FilterPills } from "@/components/shared/filter-pills"
import { formatDistanceToNow } from "date-fns"

type InboxFilter = "all" | "reported" | "archived"


export default function MessagesPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const { conversations, getConversationMessages, sendMessage } = useMockMessages()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set())
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<InboxFilter>("all")

  const filterCounts = useMemo(() => {
    let all = 0
    let reported = 0
    let archived = 0
    for (const c of conversations) {
      const isArchived = archivedIds.has(c.id)
      const isReported = reportedIds.has(c.id)
      if (isArchived) archived++
      else if (isReported) reported++
      else all++
    }
    return { all, reported, archived }
  }, [conversations, archivedIds, reportedIds])

  const visibleConversations = useMemo(() => {
    return conversations.filter((c) => {
      const isArchived = archivedIds.has(c.id)
      const isReported = reportedIds.has(c.id)
      if (filter === "archived") return isArchived
      if (filter === "reported") return isReported && !isArchived
      return !isArchived && !isReported
    })
  }, [conversations, archivedIds, reportedIds, filter])

  useEffect(() => {
    const convParam = searchParams.get("conv")
    if (convParam && visibleConversations.some((c) => c.id === convParam)) {
      setSelectedConversation(convParam)
    }
  }, [searchParams, visibleConversations])

  useEffect(() => {
    if (selectedConversation && !visibleConversations.some((c) => c.id === selectedConversation)) {
      setSelectedConversation(null)
    }
  }, [selectedConversation, visibleConversations])

  const selectedConv = visibleConversations.find((c) => c.id === selectedConversation)
  const messages = selectedConversation ? getConversationMessages(selectedConversation) : []

  const handleArchive = (convId: string) => {
    setArchivedIds((prev) => {
      const next = new Set(prev)
      next.add(convId)
      return next
    })
    toast.success("Conversation archived", {
      description: "It will no longer appear in your inbox.",
      action: {
        label: "Undo",
        onClick: () =>
          setArchivedIds((prev) => {
            const next = new Set(prev)
            next.delete(convId)
            return next
          }),
      },
    })
  }

  const handleReport = (convId: string) => {
    setReportedIds((prev) => {
      const next = new Set(prev)
      next.add(convId)
      return next
    })
  }

  const handleUnarchive = (convId: string) => {
    setArchivedIds((prev) => {
      const next = new Set(prev)
      next.delete(convId)
      return next
    })
    toast.success("Conversation unarchived", {
      description: "It's back in your inbox.",
    })
  }

  const isSelectedArchived = selectedConversation ? archivedIds.has(selectedConversation) : false

  const profileHrefFor = (other: { id: string; role?: string } | undefined) => {
    if (!other) return undefined
    if (other.role === "parent") return `/browse/${other.id}`
    const prov = mockProviders.find((p) => p.id === other.id) || mockProviders.find((p) => p.userId === other.id)
    return prov ? `/browse/${prov.id}` : `/browse/${other.id}`
  }

  const handleSend = () => {
    if (newMessage.trim() && selectedConversation && user) {
      sendMessage(selectedConversation, newMessage, user.id, user.name)
      setNewMessage("")
    }
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id)
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <div className="md:hidden h-full">
        {!selectedConversation ? (
          <div className="h-full flex flex-col bg-background">
            <div className="border-b bg-background px-4 pt-4 pb-3 space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Chats</h1>
                <div className="text-sm text-muted-foreground">
                  {visibleConversations.length}{" "}
                  {visibleConversations.length === 1 ? "conversation" : "conversations"}
                </div>
              </div>
              <FilterPills<InboxFilter>
                value={filter}
                onChange={setFilter}
                options={[
                  { value: "all", label: "All", count: filterCounts.all },
                  { value: "reported", label: "Reported", count: filterCounts.reported },
                  { value: "archived", label: "Archived", count: filterCounts.archived },
                ]}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {visibleConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                  <div className="mb-4 rounded-full bg-secondary p-6">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold text-lg">
                    {filter === "archived"
                      ? "No archived chats"
                      : filter === "reported"
                        ? "No reported chats"
                        : "No messages yet"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {filter === "archived"
                      ? "Archived conversations will appear here."
                      : filter === "reported"
                        ? "Conversations you report will appear here."
                        : "Start a conversation with a music teacher to get started"}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {visibleConversations.map((conv) => {
                    const otherParticipant = conv.participants.find((p) => p.id !== user?.id)
                    return (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className="w-full p-4 text-left transition-colors active:bg-primary/15 hover:bg-primary/10"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className={`h-14 w-14 ${archivedIds.has(conv.id) ? "opacity-60" : ""}`}>
                              <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-base">{otherParticipant?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {conv.unreadCount > 0 && !archivedIds.has(conv.id) && (
                              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className={`flex-1 min-w-0 ${archivedIds.has(conv.id) ? "opacity-60" : ""}`}>
                            <div className="mb-1 flex items-baseline justify-between gap-2">
                              <h3 className="font-semibold text-base truncate">{otherParticipant?.name}</h3>
                              <p className="text-xs text-muted-foreground flex-shrink-0">
                                {formatDistanceToNow(conv.lastMessage.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {conv.lastMessage.content}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col bg-background">
            {selectedConv && (
              <>
                <div className="border-b bg-background px-3 py-3 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={handleBackToList} className="h-10 w-10 -ml-1">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={selectedConv.participants.find((p) => p.id !== user?.id)?.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {selectedConv.participants.find((p) => p.id !== user?.id)?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate text-base">
                        {selectedConv.participants.find((p) => p.id !== user?.id)?.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedConv.participants.find((p) => p.id !== user?.id)?.role}
                      </p>
                    </div>
                    {(() => {
                      const other = selectedConv.participants.find((p) => p.id !== user?.id)
                      return (
                        <ConversationMenu
                          profileHref={profileHrefFor(other)}
                          participantName={other?.name ?? "this user"}
                          onArchive={() => handleArchive(selectedConv.id)}
                          onReport={() => handleReport(selectedConv.id)}
                          onUnarchive={() => handleUnarchive(selectedConv.id)}
                          isArchived={isSelectedArchived}
                          buttonClassName="h-10 w-10"
                        />
                      )
                    })()}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/20">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                      <div className="mb-3 rounded-full bg-secondary p-5">
                        <Send className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-base text-foreground mb-1">Start the conversation</h3>
                      <p className="text-sm text-muted-foreground max-w-[240px]">
                        Say hello and introduce yourself to get things started
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.senderId === user?.id
                      return (
                        <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] space-y-1`}>
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                isOwn
                                  ? "bg-primary text-primary-foreground rounded-br-sm"
                                  : "bg-background border rounded-bl-sm"
                              }`}
                            >
                              <p className="text-[15px] leading-relaxed break-words">{message.content}</p>
                            </div>
                            <p className={`text-xs text-muted-foreground px-2 ${isOwn ? "text-right" : "text-left"}`}>
                              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                <div className="border-t bg-background p-3 safe-bottom flex-shrink-0">
                  {isSelectedArchived ? (
                    <div className="rounded-full border-2 border-dashed border-muted bg-muted/40 px-4 py-2.5 text-center text-sm text-muted-foreground">
                      This conversation is archived. Unarchive to reply.
                    </div>
                  ) : (
                    <div className="flex gap-2 items-end">
                      <Input
                        placeholder="Message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        className="h-11 text-base rounded-full border-2 flex-1"
                      />
                      <Button
                        onClick={handleSend}
                        size="icon"
                        className="h-11 w-11 rounded-full flex-shrink-0"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="hidden md:block page-container py-8 sm:py-10 lg:py-12">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">Your conversations with teachers</p>
          <div className="mt-5">
            <FilterPills<InboxFilter>
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All", count: filterCounts.all },
                { value: "reported", label: "Reported", count: filterCounts.reported },
                { value: "archived", label: "Archived", count: filterCounts.archived },
              ]}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 h-[calc(100vh-320px)]">
          <Card className="lg:col-span-1 flex flex-col">
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-sm text-muted-foreground">Conversations</h2>
              </div>
              <div className="divide-y flex-1 overflow-y-auto">
                {visibleConversations.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    {filter === "archived"
                      ? "No archived conversations"
                      : filter === "reported"
                        ? "No reported conversations"
                        : "No conversations yet"}
                  </div>
                ) : (
                  visibleConversations.map((conv) => {
                    const otherParticipant = conv.participants.find((p) => p.id !== user?.id)
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`w-full p-4 text-left transition-colors hover:bg-secondary ${
                          selectedConversation === conv.id ? "bg-secondary" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="relative flex-shrink-0">
                            <Avatar className={`h-9 w-9 ${archivedIds.has(conv.id) ? "opacity-60" : ""}`}>
                              <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{otherParticipant?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {conv.unreadCount > 0 && !archivedIds.has(conv.id) && (
                              <div className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className={`flex-1 min-w-0 ${archivedIds.has(conv.id) ? "opacity-60" : ""}`}>
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-sm font-medium truncate">{otherParticipant?.name}</h3>
                              <p className="text-xs text-muted-foreground flex-shrink-0">
                                {formatDistanceToNow(conv.lastMessage.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{conv.lastMessage.content}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 flex flex-col">
            <CardContent className="flex flex-col p-0 flex-1">
              {!selectedConv ? (
                <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground p-8">
                  <div className="mb-4 rounded-full bg-secondary p-6">
                    <Send className="h-10 w-10" />
                  </div>
                  <h3 className="mb-2 font-semibold text-lg">Select a conversation</h3>
                  <p className="text-sm text-center max-w-sm">
                    Choose a conversation from the list to view and send messages
                  </p>
                </div>
              ) : (
                <>
                  <div className="border-b p-4 sm:p-5 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={selectedConv.participants.find((p) => p.id !== user?.id)?.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {selectedConv.participants.find((p) => p.id !== user?.id)?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold">
                          {selectedConv.participants.find((p) => p.id !== user?.id)?.name}
                        </h3>
                      </div>
                      {(() => {
                        const other = selectedConv.participants.find((p) => p.id !== user?.id)
                        return (
                          <ConversationMenu
                            profileHref={profileHrefFor(other)}
                            participantName={other?.name ?? "this user"}
                            onArchive={() => handleArchive(selectedConv.id)}
                            onReport={() => handleReport(selectedConv.id)}
                            onUnarchive={() => handleUnarchive(selectedConv.id)}
                            isArchived={isSelectedArchived}
                          />
                        )
                      })()}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5 bg-secondary/10">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="mb-3 rounded-full bg-secondary p-5">
                          <Send className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-base text-foreground mb-1">Start the conversation</h3>
                        <p className="text-sm text-muted-foreground max-w-[280px]">
                          Write your first message to get the conversation going
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwn = message.senderId === user?.id
                        return (
                          <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] sm:max-w-[70%] space-y-1`}>
                              <div
                                className={`rounded-2xl px-4 py-3 ${
                                  isOwn
                                    ? "bg-primary text-primary-foreground rounded-br-sm"
                                    : "bg-background border rounded-bl-sm"
                                }`}
                              >
                                <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
                              </div>
                              <p className={`text-xs text-muted-foreground px-2 ${isOwn ? "text-right" : "text-left"}`}>
                                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <div className="border-t p-4 sm:p-5 flex-shrink-0">
                    {isSelectedArchived ? (
                      <div className="rounded-md border border-dashed bg-muted/40 px-4 py-3 text-center text-sm text-muted-foreground">
                        This conversation is archived. Unarchive to reply and receive notifications.
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSend()
                            }
                          }}
                          className="h-12 text-base"
                        />
                        <Button
                          onClick={handleSend}
                          size="icon"
                          className="h-12 w-12 flex-shrink-0"
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>

          </Card>
        </div>
      </div>
    </div>
  )
}
