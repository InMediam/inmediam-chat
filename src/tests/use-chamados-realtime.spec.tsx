import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import type { ChatRealtime } from '../adapter/chat-adapter'
import { ChatProvider } from '../adapter/chat-provider'
import { MENSAGEM_TIPO, type MensagemTipo } from '../entities/enum'
import { PARTICIPANTE_TIPO } from '../entities/tipo-participante'
import {
  type EchoMensagemPayload,
  useChamadosRealtime,
} from '../hooks/use-chamados-realtime'
import { mockChamado } from './fixtures'

function createRealtimeStub() {
  const listeners = new Map<string, (payload: EchoMensagemPayload) => void>()

  const realtime: ChatRealtime = {
    private: () => ({
      listen: (event, callback) =>
        listeners.set(
          event,
          callback as unknown as (payload: EchoMensagemPayload) => void,
        ),
      stopListening: (event) => listeners.delete(event),
    }),
    leave: vi.fn(),
  }

  const emitMensagem = (tipo: MensagemTipo) =>
    act(() =>
      listeners.get('.mensagem.criada')?.({
        mensagem: {
          id: 99,
          tipo,
          texto: 'Chamado finalizado por Imobiliária Teste.',
          chamado_id: mockChamado.id,
          remetente: {
            id: 1,
            nome: 'Imobiliária Teste',
            tipo: PARTICIPANTE_TIPO.IMOBILIARIA,
          },
          created_at: '11/11/2026 às 22:11',
          readed_at: null,
        },
      }),
    )

  return { realtime, emitMensagem }
}

function renderRealtime() {
  const { realtime, emitMensagem } = createRealtimeStub()
  const queryClient = new QueryClient()
  queryClient.setQueryData(['chamado', mockChamado.id], { data: mockChamado })

  const adapter = createChatAdapterStub({
    realtimeChannel: 'user.1.chamados',
    getRealtime: () => realtime,
  })

  renderHook(() => useChamadosRealtime(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ChatProvider adapter={adapter}>{children}</ChatProvider>
      </QueryClientProvider>
    ),
  })

  const isDetalheInvalidado = () =>
    queryClient.getQueryState(['chamado', mockChamado.id])?.isInvalidated

  return { emitMensagem, isDetalheInvalidado }
}

describe('useChamadosRealtime', () => {
  it('invalida o detalhe do chamado quando chega uma mensagem de sistema', () => {
    const { emitMensagem, isDetalheInvalidado } = renderRealtime()

    emitMensagem(MENSAGEM_TIPO.SISTEMA)

    expect(isDetalheInvalidado()).toBe(true)
  })

  it('mantém o detalhe do chamado em cache quando chega uma mensagem comum', () => {
    const { emitMensagem, isDetalheInvalidado } = renderRealtime()

    emitMensagem(MENSAGEM_TIPO.USUARIO)

    expect(isDetalheInvalidado()).toBe(false)
  })
})
