"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { mockConversations, mockMessages, type Conversation, type Message } from "@/lib/mock-data"

interface MessageContextType {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  getConversationMessages: (conversationId: string) => Message[]
  sendMessage: (conversationId: string, content: string, senderId: string, senderName: string, senderAvatar?: string) => void
  injectMessage: (conversationId: string, message: Message) => void
  findConversationByParticipantName: (name: string, excludeId?: string) => Conversation | undefined
}

const defaultMessageContext: MessageContextType = {
  conversations: [],
  messages: {},
  getConversationMessages: () => [],
  sendMessage: () => {},
  injectMessage: () => {},
  findConversationByParticipantName: () => undefined,
}

const MessageContext = createContext<MessageContextType>(defaultMessageContext)

export function MessageProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)

  const getConversationMessages = useCallback(
    (conversationId: string) => messages[conversationId] || [],
    [messages]
  )

  const injectMessage = useCallback((conversationId: string, message: Message) => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message],
    }))
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, lastMessage: message, unreadCount: conv.unreadCount + 1 }
          : conv
      )
    )
  }, [])

  const sendMessage = useCallback(
    (conversationId: string, content: string, senderId: string, senderName: string, senderAvatar?: string) => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId,
        senderName,
        senderAvatar: senderAvatar || "/placeholder.svg",
        content,
        timestamp: new Date(),
        read: false,
      }
      injectMessage(conversationId, newMessage)
    },
    [injectMessage]
  )

  const findConversationByParticipantName = useCallback(
    (name: string, excludeId?: string) =>
      conversations.find((c) =>
        c.participants.some((p) => p.name === name && p.id !== excludeId)
      ),
    [conversations]
  )

  return (
    <MessageContext.Provider
      value={{ conversations, messages, getConversationMessages, sendMessage, injectMessage, findConversationByParticipantName }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export function useMessageContext() {
  return useContext(MessageContext)
}
