import {
  QueryClient,
  QueryClientProvider,
  QueryObserver,
} from '@tanstack/react-query'
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

function renderRealtime({ conversaAberta = false } = {}) {
  const { realtime, emitMensagem } = createRealtimeStub()
  const queryClient = new QueryClient()
  const fetchDetalhe = vi.fn().mockResolvedValue({
    data: { ...mockChamado, status: CHAMADO_STATUS.FECHADO },
  })

  queryClient.setQueryData(['chamado', mockChamado.id], { data: mockChamado })
  queryClient.setQueryData(LISTA_EM_ABERTO, { pages: [], pageParams: [] })

  const adapter = createChatAdapterStub({
    realtimeChannel: 'user.1.chamados',
    getRealtime: () => realtime,
  })

  if (conversaAberta) {
    new QueryObserver(queryClient, {
      queryKey: ['chamado', mockChamado.id],
      queryFn: fetchDetalhe,
      staleTime: Infinity,
    }).subscribe(() => undefined)
  }

  renderHook(() => useChamadosRealtime(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ChatProvider adapter={adapter}>{children}</ChatProvider>
      </QueryClientProvider>
    ),
  })

  const listaInvalidada = () =>
    queryClient.getQueryState(LISTA_EM_ABERTO)?.isInvalidated

  return { queryClient, fetchDetalhe, emitMensagem, listaInvalidada }
}

describe('useChamadosRealtime', () => {
  it('descarta o detalhe em cache do chamado fora da tela quando chega uma mensagem de sistema', () => {
    const { queryClient, fetchDetalhe, emitMensagem, listaInvalidada } =
      renderRealtime()

    emitMensagem(MENSAGEM_TIPO.SISTEMA)

    expect(
      queryClient.getQueryData(['chamado', mockChamado.id]),
    ).toBeUndefined()
    expect(fetchDetalhe).not.toHaveBeenCalled()
    expect(listaInvalidada()).toBe(true)
  })

  it('recarrega o detalhe da conversa aberta quando chega uma mensagem de sistema', async () => {
    const { queryClient, emitMensagem } = renderRealtime({
      conversaAberta: true,
    })

    emitMensagem(MENSAGEM_TIPO.SISTEMA)

    await waitFor(() =>
      expect(queryClient.getQueryData(['chamado', mockChamado.id])).toEqual({
        data: { ...mockChamado, status: CHAMADO_STATUS.FECHADO },
      }),
    )
  })

  it('mantém o detalhe em cache e só invalida a lista quando chega uma mensagem comum', () => {
    const { queryClient, emitMensagem, listaInvalidada } = renderRealtime()

    emitMensagem(MENSAGEM_TIPO.USUARIO)

    expect(queryClient.getQueryData(['chamado', mockChamado.id])).toEqual({
      data: mockChamado,
    })
    expect(listaInvalidada()).toBe(true)
  })
})
