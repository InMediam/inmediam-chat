import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useChatAdapter } from '../adapter/use-chat-adapter'
import { useChatHttp } from '../adapter/use-chat-http'
import { getChamados } from '../api/get-chamados'
import { toChamadoStatusQuery } from '../entities/enum'
import { getNextPageParam } from '../utils/infinite-scroll'
import { useChamadosChat } from './use-chamados-chat'

const CHAMADOS_PER_PAGE = 15

export function useChamadosList() {
  const { isAuthenticated } = useChatAdapter()
  const http = useChatHttp()
  const { filter, effectiveSearch, locacaoId } = useChamadosChat()

  const query = useInfiniteQuery({
    queryKey: [
      'chamados',
      'lista',
      filter,
      effectiveSearch,
      ...(locacaoId !== undefined ? [locacaoId] : []),
    ],
    queryFn: ({ pageParam }) =>
      getChamados(http, {
        status: toChamadoStatusQuery(filter),
        search: effectiveSearch || undefined,
        locacao_id: locacaoId,
        pageIndex: pageParam,
        perPage: CHAMADOS_PER_PAGE,
      }),
    getNextPageParam: (lastPage) => getNextPageParam({ ...lastPage.meta }),
    initialPageParam: 1,
    enabled: isAuthenticated && (locacaoId === undefined || !!locacaoId),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  })

  const chamados = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  )

  return {
    chamados,
    totalCount: query.data?.pages[0]?.meta.totalCount ?? 0,
    isPending: query.isPending,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  }
}
