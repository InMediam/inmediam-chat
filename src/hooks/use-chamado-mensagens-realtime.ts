import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useChatAdapter } from '../adapter/use-chat-adapter'
import { appendMensagemToCache } from './use-chamado-cache'
import {
  type EchoMensagemPayload,
  payloadToMensagem,
} from './use-chamados-realtime'

export function useChamadoMensagensRealtime(chamadoId: number | null) {
  const queryClient = useQueryClient()
  const { currentUser, getRealtime } = useChatAdapter()
  const currentTipo = currentUser?.tipo ?? null

  useEffect(() => {
    if (!chamadoId) return

    const realtime = getRealtime()
    if (!realtime) return

    const channelName = `chamado.${chamadoId}`
    const channel = realtime.private(channelName)

    const handler = (payload: EchoMensagemPayload) => {
      const mensagem = payloadToMensagem(payload, currentTipo)
      appendMensagemToCache(queryClient, chamadoId, mensagem)
    }

    channel.listen('.mensagem.criada', handler)

    return () => {
      channel.stopListening('.mensagem.criada')
      realtime.leave(channelName)
    }
  }, [chamadoId, currentTipo, getRealtime, queryClient])
}
