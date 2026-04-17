import { MessagesView } from "@/components/views/messages-view"

export default function ProviderMessagesPage() {
  return (
    <MessagesView
      desktopSubtitle="Your conversations with parents"
      emptyListDescription="When parents contact you, their messages will appear here"
      counterpartRoleLabel="Parent"
    />
  )
}
