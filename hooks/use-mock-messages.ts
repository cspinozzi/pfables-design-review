"use client"

import { useMessageContext } from "@/lib/message-context"

export function useMockMessages() {
  const { conversations, getConversationMessages, sendMessage } = useMessageContext()
  return { conversations, getConversationMessages, sendMessage }
}
