"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, ArrowLeft, MoreVertical, User } from "lucide-react"
import { useMockMessages } from "@/hooks/use-mock-messages"
import { useAuth } from "@/lib/auth-context"
import { mockProviders } from "@/lib/mock-data"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"


export default function MessagesPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const { conversations, getConversationMessages, sendMessage } = useMockMessages()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const convParam = searchParams.get("conv")
    if (convParam && conversations.some((c) => c.id === convParam)) {
      setSelectedConversation(convParam)
    }
  }, [searchParams, conversations])

  const selectedConv = conversations.find((c) => c.id === selectedConversation)
  const messages = selectedConversation ? getConversationMessages(selectedConversation) : []

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
            <div className="border-b bg-background px-4 py-4 flex items-center justify-between">
              <h1 className="text-xl font-bold">Chats</h1>
              <div className="text-sm text-muted-foreground">
                {conversations.length} {conversations.length === 1 ? "conversation" : "conversations"}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                  <div className="mb-4 rounded-full bg-secondary p-6">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold text-lg">No messages yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Start a conversation with a music teacher to get started
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conv) => {
                    const otherParticipant = conv.participants.find((p) => p.id !== user?.id)
                    return (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className="w-full p-4 text-left transition-colors active:bg-primary/15 hover:bg-primary/10"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="h-14 w-14">
                              <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-base">{otherParticipant?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {conv.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
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
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
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
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="hidden md:block page-container py-8 sm:py-10 lg:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">Your conversations with teachers</p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 h-[calc(100vh-320px)]">
          <Card className="lg:col-span-1 flex flex-col">
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-sm text-muted-foreground">Conversations</h2>
              </div>
              <div className="divide-y flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">No conversations yet</div>
                ) : (
                  conversations.map((conv) => {
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
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{otherParticipant?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {conv.unreadCount > 0 && (
                              <div className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
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
                        if (!other) return null
                        let profileHref = `/browse/${other.id}`
                        if (other.role !== "parent") {
                          const prov = mockProviders.find((p) => p.id === other.id) || mockProviders.find((p) => p.userId === other.id)
                          if (prov) profileHref = `/browse/${prov.id}`
                        }
                        return (
                          <Link
                            href={profileHref}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <User className="h-3.5 w-3.5" />
                            View Profile
                          </Link>
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
