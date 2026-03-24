"use client"

import { useState } from "react"
import { mockConversations, mockMessages, type Conversation, type Message } from "@/lib/mock-data"

export function useMockMessages() {
  const [conversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)

  const getConversationMessages = (conversationId: string): Message[] => {
    return messages[conversationId] || []
  }

  const sendMessage = (conversationId: string, content: string, senderId: string, senderName: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      senderAvatar: `/placeholder.svg?height=40&width=40&query=person`,
      content,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }))
  }

  return {
    conversations,
    getConversationMessages,
    sendMessage,
  }
}
