import { type InfiniteData, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useChatAdapter } from '../adapter/use-chat-adapter'
import type { GetMensagensResponse } from '../api/get-mensagens'
import type { MensagemTipo } from '../entities/enum'
import { MENSAGEM_TIPO } from '../entities/enum'
import type { MensagemItem } from '../entities/interface'
import type { ParticipanteTipo } from '../entities/tipo-participante'
import { chamadoMensagensQueryKey } from './use-chamado-mensagens'

export interface EchoMensagemPayload {
  mensagem: {
    id: number
    tipo: MensagemTipo
    texto: string
    chamado_id: number
    remetente: {
      id: number
      nome: string | null
      tipo: ParticipanteTipo
    }
    created_at: string
    readed_at: string | null
  }
}

/**
 * O broadcast é um payload só para todos os ouvintes, então `is_me` não pode
 * vir dele: cada lado resolve comparando o tipo do remetente com o seu. O tipo
 * basta porque a conversa tem apenas duas partes — usar o id seria pior, já
 * que locatário, proprietário e imobiliária vêm de tabelas distintas.
 */
export function payloadToMensagem(
  payload: EchoMensagemPayload,
  currentTipo: ParticipanteTipo | null,
): MensagemItem {
  const { mensagem } = payload

  return {
    id: mensagem.id,
    tipo: mensagem.tipo ?? MENSAGEM_TIPO.USUARIO,
    texto: mensagem.texto,
    remetente: {
      id: mensagem.remetente.id,
      nome: mensagem.remetente.nome,
      tipo: mensagem.remetente.tipo,
      is_me: currentTipo !== null && mensagem.remetente.tipo === currentTipo,
    },
    created_at: mensagem.created_at,
    readed_at: mensagem.readed_at,
  }
}

export function useChamadosRealtime() {
  const queryClient = useQueryClient()
  const { realtimeChannel, getRealtime, onRealtimeReconnect } = useChatAdapter()

  useEffect(() => {
    if (!realtimeChannel) return

    const realtime = getRealtime()
    if (!realtime) return

    const channel = realtime.private(realtimeChannel)

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ['chamados', 'lista'] })
    }

    const lidasHandler = (payload: { chamado_id: number }) => {
      const readedAt = new Date().toISOString()

      queryClient.setQueryData<InfiniteData<GetMensagensResponse>>(
        chamadoMensagensQueryKey(payload.chamado_id),
        (old) => {
          if (!old) return old
          let changed = false
          const pages = old.pages.map((page) => ({
            ...page,
            data: page.data.map((m) => {
              if (m.remetente.is_me && m.readed_at === null) {
                changed = true
                return { ...m, readed_at: readedAt }
              }
              return m
            }),
          }))
          return changed ? { ...old, pages } : old
        },
      )
    }

    channel.listen('.mensagem.criada', handler)
    channel.listen('.mensagens.lidas', lidasHandler)

    return () => {
      channel.stopListening('.mensagem.criada')
      channel.stopListening('.mensagens.lidas')
      realtime.leave(realtimeChannel)
    }
  }, [realtimeChannel, getRealtime, queryClient])

  useEffect(() => {
    if (!onRealtimeReconnect) return

    return onRealtimeReconnect(() => {
      queryClient.invalidateQueries({ queryKey: ['chamado-mensagens'] })
      queryClient.invalidateQueries({ queryKey: ['chamados', 'lista'] })
    })
  }, [onRealtimeReconnect, queryClient])
}
