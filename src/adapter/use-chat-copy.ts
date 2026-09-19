import type { ChatCopy } from './chat-adapter'
import { DEFAULT_CHAT_COPY } from './default-copy'
import { useChatAdapter } from './use-chat-adapter'

export function useChatCopy(): ChatCopy {
  const { copy } = useChatAdapter()

  return { ...DEFAULT_CHAT_COPY, ...copy }
}
