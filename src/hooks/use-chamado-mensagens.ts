import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useChatHttp } from '../adapter/use-chat-http'
import type { GetMensagensResponse } from '../api/get-mensagens'
import { getMensagens } from '../api/get-mensagens'
import type { MensagemItem } from '../entities/interface'

const MENSAGENS_PER_PAGE = 30

export function chamadoMensagensQueryKey(chamadoId: number | null) {
  return ['chamado-mensagens', chamadoId] as const
}

export function useChamadoMensagens(
  chamadoId: number | null,
  enabled: boolean = true,
) {
  const http = useChatHttp()

  const query = useInfiniteQuery({
    queryKey: chamadoMensagensQueryKey(chamadoId),
    queryFn: ({ pageParam }) =>
      getMensagens(http, {
        chamadoId: chamadoId!,
        cursor: pageParam,
        perPage: MENSAGENS_PER_PAGE,
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (last: GetMensagensResponse) => last.meta.next_cursor,
    enabled: enabled && chamadoId !== null,
    staleTime: Infinity,
  })

  const messages = useMemo<MensagemItem[]>(() => {
    if (!query.data) return []
    return query.data.pages
      .slice()
      .reverse()
      .flatMap((page) => page.data)
  }, [query.data])

  return {
    messages,
    isLoading: query.isPending,
    isFetchingMore: query.isFetchingNextPage,
    hasMoreMessages: query.hasNextPage ?? false,
    fetchOlderMessages: query.fetchNextPage,
  }
}
