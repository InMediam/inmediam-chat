import { useContext } from 'react'

import { ChatContext } from './chat-context'

export const useChatAdapter = () => useContext(ChatContext)
