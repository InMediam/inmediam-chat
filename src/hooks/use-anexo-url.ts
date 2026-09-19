import { useQuery } from '@tanstack/react-query'

import { useChatAdapter } from '../adapter/use-chat-adapter'

// A URL do anexo é resolvida sob demanda porque o back devolve um link
// assinado de curta duração — daí o staleTime menor que a expiração.
export function useAnexoUrl(apiUrl: string, enabled = true) {
  const { api } = useChatAdapter()

  return useQuery({
    queryKey: ['anexo-url', apiUrl],
    queryFn: () =>
      api.get<{ url: string }>(apiUrl).then((response) => response.data.url),
    staleTime: 1000 * 60 * 8,
    enabled,
  })
}
