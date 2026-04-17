import { MessagesView } from "@/components/views/messages-view"

export default function RepairerMessagesPage() {
  return (
    <MessagesView
      desktopSubtitle="Your conversations with clients"
      emptyListDescription="When clients contact you about repairs, their messages will appear here"
      counterpartRoleLabel="Client"
    />
  )
}
