import { useMemo } from 'react'

import type { ChatHttp } from '../api/chat-http'
import { useChatAdapter } from './use-chat-adapter'

export function useChatHttp(): ChatHttp {
  const { api, basePath } = useChatAdapter()

  return useMemo(
    () => ({ client: api, basePath: basePath ?? '' }),
    [api, basePath],
  )
}
