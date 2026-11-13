import { cn } from '@inmediam/ui'

import { ChatHeader } from './chat-header'
import { ChatSubHeader } from './chat-sub-header'
import { ChatMessageFeed } from './message/chat-message-feed'
import { ChatMessageInput } from './message/chat-message-input'
import { ChatWallpaper } from './message/chat-wallpaper'

interface ChatPanelProps {
  className?: string
}

export function ChatPanel({ className }: ChatPanelProps) {
  return (
    <section
      className={cn(
        'flex min-h-0 min-w-0 flex-1 flex-col bg-primary',
        className,
      )}
    >
      <ChatHeader />
      <ChatSubHeader />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <ChatWallpaper />
        <ChatMessageFeed />
        <ChatMessageInput />
      </div>
    </section>
  )
}
