import { type InfiniteData, type QueryClient } from '@tanstack/react-query'

import type { GetChamadoResponse } from '../api/get-chamado'
import type { GetChamadosResponse } from '../api/get-chamados'
import type { GetMensagensResponse } from '../api/get-mensagens'
import type { Chamado, MensagemItem } from '../entities/interface'
import { CHAMADO_READ_STATE } from '../entities/read-state'
import { chamadoMensagensQueryKey } from './use-chamado-mensagens'

// Refactor: export funciton useChamadoCache() { return { appendMensagemToCache, marcarChamadoLidoNoCache, updateChamadoInCache } }

export function appendMensagemToCache(
  queryClient: QueryClient,
  chamadoId: number,
  mensagem: MensagemItem,
) {
  queryClient.setQueryData<InfiniteData<GetMensagensResponse>>(
    chamadoMensagensQueryKey(chamadoId),
    (old) => {
      if (!old) return old
      const exists = old.pages.some((p) =>
        p.data.some((m) => m.id === mensagem.id),
      )
      if (exists) return old
      const [first, ...rest] = old.pages
      if (!first) return old
      return {
        ...old,
        pages: [{ ...first, data: [...first.data, mensagem] }, ...rest],
      }
    },
  )
}

export function marcarChamadoLidoNoCache(
  queryClient: QueryClient,
  chamadoId: number,
) {
  queryClient.setQueryData<GetChamadoResponse>(
    ['chamado', chamadoId],
    (old) => {
      if (!old) return old
      return {
        ...old,
        data: { ...old.data, read_state: CHAMADO_READ_STATE.LIDO },
      }
    },
  )

  // Atualiza no lugar (sem refetch) para o item permanecer na lista atual, só sem o badge.
  queryClient.setQueriesData<InfiniteData<GetChamadosResponse>>(
    { queryKey: ['chamados', 'lista'] },
    (old) => {
      if (!old?.pages) return old
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map((chamado) =>
            chamado.id === chamadoId
              ? { ...chamado, read_state: CHAMADO_READ_STATE.LIDO }
              : chamado,
          ),
        })),
      }
    },
  )
}

export function updateChamadoInCache(
  queryClient: QueryClient,
  chamado: Chamado,
) {
  queryClient.setQueryData<GetChamadoResponse>(['chamado', chamado.id], {
    data: chamado,
  })

  // Atualiza cada página já carregada no lugar: invalidar a lista inteira
  // devolveria o usuário ao topo e perderia as páginas do scroll infinito.
  queryClient.setQueriesData<InfiniteData<GetChamadosResponse>>(
    { queryKey: ['chamados', 'lista'] },
    (old) => {
      if (!old?.pages) return old
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map((item) =>
            item.id === chamado.id ? { ...item, ...chamado } : item,
          ),
        })),
      }
    },
  )
}

export function prependChamadoToCache(
  queryClient: QueryClient,
  chamado: Chamado,
) {
  queryClient.setQueryData<GetChamadoResponse>(['chamado', chamado.id], {
    data: chamado,
  })

  // Insere no topo da primeira página de cada filtro já carregado: invalidar a
  // lista devolveria o usuário ao começo do scroll infinito.
  queryClient.setQueriesData<InfiniteData<GetChamadosResponse>>(
    { queryKey: ['chamados', 'lista'] },
    (old) => {
      if (!old?.pages) return old
      const [first, ...rest] = old.pages
      if (!first) return old
      if (first.data.some((item) => item.id === chamado.id)) return old

      return {
        ...old,
        pages: [{ ...first, data: [chamado, ...first.data] }, ...rest],
      }
    },
  )
}
