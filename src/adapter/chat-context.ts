import { createContext } from 'react'

import type { ChatAdapter } from './chat-adapter'

export const ChatContext = createContext<ChatAdapter>({} as ChatAdapter)
