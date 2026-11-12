import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import type { ChatRealtime } from '../adapter/chat-adapter'
import { ChatProvider } from '../adapter/chat-provider'
import { MENSAGEM_TIPO, type MensagemTipo } from '../entities/enum'
import { CHAMADO_STATUS } from '../entities/status'
import { PARTICIPANTE_TIPO } from '../entities/tipo-participante'
import {
  type EchoMensagemPayload,
  useChamadosRealtime,
} from '../hooks/use-chamados-realtime'
import { mockChamado } from './fixtures'

const LISTA_EM_ABERTO = ['chamados', 'lista', 'em-aberto']

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
  const fetchDetalhe = vi.fn().mockResolvedValue({
    data: { ...mockChamado, status: CHAMADO_STATUS.FECHADO },
  })

  queryClient.setQueryDefaults(['chamado'], { queryFn: fetchDetalhe })
  queryClient.setQueryData(['chamado', mockChamado.id], { data: mockChamado })
  queryClient.setQueryData(LISTA_EM_ABERTO, { pages: [], pageParams: [] })

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

  return { queryClient, fetchDetalhe, emitMensagem }
}

describe('useChamadosRealtime', () => {
  it('recarrega o detalhe do chamado fora da tela quando chega uma mensagem de sistema', async () => {
    const { queryClient, emitMensagem } = renderRealtime()

    emitMensagem(MENSAGEM_TIPO.SISTEMA)

    await waitFor(() =>
      expect(queryClient.getQueryData(['chamado', mockChamado.id])).toEqual({
        data: { ...mockChamado, status: CHAMADO_STATUS.FECHADO },
      }),
    )
    expect(queryClient.getQueryState(LISTA_EM_ABERTO)?.isInvalidated).toBe(true)
  })

  it('só invalida a lista quando chega uma mensagem comum', () => {
    const { queryClient, fetchDetalhe, emitMensagem } = renderRealtime()

    emitMensagem(MENSAGEM_TIPO.USUARIO)

    expect(fetchDetalhe).not.toHaveBeenCalled()
    expect(queryClient.getQueryState(LISTA_EM_ABERTO)?.isInvalidated).toBe(true)
  })
})
