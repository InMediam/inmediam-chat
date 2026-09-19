import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useChatAdapter } from '../adapter/use-chat-adapter'
import { useChatHttp } from '../adapter/use-chat-http'
import { getChamado } from '../api/get-chamado'
import { useChamadosChat } from './use-chamados-chat'
import { useChamadosList } from './use-chamados-list'

export function useChamadoSelecionado() {
  const { isAuthenticated } = useChatAdapter()
  const http = useChatHttp()
  const { selectedId } = useChamadosChat()
  const { chamados } = useChamadosList()

  const {
    data: detailData,
    isPending: isPendingDetail,
    isError,
  } = useQuery({
    queryKey: ['chamado', selectedId],
    queryFn: () => getChamado(http, selectedId!),
    enabled: isAuthenticated && selectedId !== null,
    staleTime: 1000 * 60,
  })

  // O item da lista é o fallback enquanto o detalhe carrega, para o painel abrir
  // já com cabeçalho e status em vez de um skeleton inteiro.
  const chamado = useMemo(() => {
    if (selectedId === null) return null
    if (detailData && detailData.data.id === selectedId) return detailData.data
    return chamados.find((item) => item.id === selectedId) ?? null
  }, [selectedId, detailData, chamados])

  return {
    chamado,
    detalhe: detailData?.data ?? null,
    isError,
    isPending: selectedId !== null && isPendingDetail,
  }
}
