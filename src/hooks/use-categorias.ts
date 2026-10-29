import { useQuery } from '@tanstack/react-query'

import { useChatHttp } from '../adapter/use-chat-http'
import { getCategorias } from '../api/get-categorias'

export function useCategorias() {
  const http = useChatHttp()

  return useQuery({
    queryKey: ['chamados', 'categorias'],
    queryFn: () => getCategorias(http),
    staleTime: Infinity,
  })
}
