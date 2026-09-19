import type { ChatAdapter } from './chat-adapter'
import { ChatContext } from './chat-context'

interface ChatProviderProps {
  adapter: ChatAdapter
  children: React.ReactNode
}

export function ChatProvider({ adapter, children }: ChatProviderProps) {
  return <ChatContext.Provider value={adapter}>{children}</ChatContext.Provider>
}
