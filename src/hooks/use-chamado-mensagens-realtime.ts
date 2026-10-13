import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useChatAdapter } from '../adapter/use-chat-adapter'
import { MENSAGEM_TIPO } from '../entities/enum'
import {
  appendMensagemToCache,
  invalidateChamadoStatus,
} from './use-chamado-cache'
import {
  type EchoMensagemPayload,
  payloadToMensagem,
} from './use-chamados-realtime'

export function useChamadoMensagensRealtime(chamadoId: number | null) {
  const queryClient = useQueryClient()
  const { currentUser, getRealtime } = useChatAdapter()

  useEffect(() => {
    if (!chamadoId) return

    const realtime = getRealtime()
    if (!realtime) return

    const channelName = `chamado.${chamadoId}`
    const channel = realtime.private(channelName)

    const handler = (payload: EchoMensagemPayload) => {
      const mensagem = payloadToMensagem(payload, currentUser)
      appendMensagemToCache(queryClient, chamadoId, mensagem)

      // Finalizar e reabrir chegam como mensagem de sistema; sem refetch o
      // input seguiria com o status antigo.
      if (mensagem.tipo === MENSAGEM_TIPO.SISTEMA) {
        invalidateChamadoStatus(queryClient, chamadoId)
      }
    }

    channel.listen('.mensagem.criada', handler)

    return () => {
      channel.stopListening('.mensagem.criada')
      realtime.leave(channelName)
    }
  }, [chamadoId, currentUser, getRealtime, queryClient])
}
