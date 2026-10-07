import { TooltipProvider } from '@inmediam/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { setupUser } from '../../test/user-event'
import type { ChatAdapter } from '../adapter/chat-adapter'
import { ChatProvider } from '../adapter/chat-provider'
import { sendMensagem } from '../api/send-mensagem'
import { ChatMessageInput } from '../components/message/chat-message-input'
import { ChamadosChatProvider } from '../contexts/chamados-chat-context'
import type { Chamado } from '../entities/interface'
import { mockChamado } from './fixtures'

const { useChamadoSelecionadoMock } = vi.hoisted(() => ({
  useChamadoSelecionadoMock: vi.fn(),
}))

vi.mock('../hooks/use-chamado-selecionado', () => ({
  useChamadoSelecionado: useChamadoSelecionadoMock,
}))
vi.mock('../api/send-mensagem', () => ({ sendMensagem: vi.fn() }))

function renderInput({
  chamado = mockChamado,
  adapter = {},
}: { chamado?: Chamado; adapter?: Partial<ChatAdapter> } = {}) {
  useChamadoSelecionadoMock.mockReturnValue({ chamado })

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ChatProvider adapter={createChatAdapterStub(adapter)}>
        <TooltipProvider delayDuration={0} skipDelayDuration={0}>
          <MemoryRouter initialEntries={[`/chamados?chamado=${chamado.id}`]}>
            <ChamadosChatProvider>
              <ChatMessageInput />
            </ChamadosChatProvider>
          </MemoryRouter>
        </TooltipProvider>
      </ChatProvider>
    </QueryClientProvider>,
  )
}

describe('ChatMessageInput', () => {
  beforeEach(() => {
    useChamadoSelecionadoMock.mockReset()
    vi.mocked(sendMensagem).mockReset()
    vi.mocked(sendMensagem).mockResolvedValue({
      data: {
        id: 10,
        tipo: 'usuario',
        texto: 'Olá',
        remetente: { id: 1, nome: 'Eu', tipo: 'imobiliaria', is_me: true },
        created_at: '01/05/2026 às 10:00',
        readed_at: null,
      },
    })
  })

  it('renderiza o placeholder da mensagem', () => {
    renderInput()

    expect(
      screen.getByPlaceholderText('Escreva sua mensagem...'),
    ).toBeInTheDocument()
  })

  it('guarda o texto digitado no rascunho do chamado', async () => {
    const user = setupUser()
    renderInput()

    const input = screen.getByPlaceholderText('Escreva sua mensagem...')
    await user.type(input, 'Olá')

    expect(input).toHaveValue('Olá')
  })

  it('envia a mensagem sem anexos ao clicar em enviar', async () => {
    const user = setupUser()
    renderInput()

    const input = screen.getByPlaceholderText('Escreva sua mensagem...')
    await user.type(input, 'Olá')

    const sendButton = screen.getByRole('button', { name: 'Enviar mensagem' })
    await user.click(sendButton)

    expect(sendMensagem).toHaveBeenCalledWith(expect.anything(), {
      chamadoId: mockChamado.id,
      texto: 'Olá',
      anexos: undefined,
    })
  })

  it('não envia quando o rascunho está vazio', async () => {
    const user = setupUser()
    renderInput()

    const sendButton = screen.getByRole('button', { name: 'Enviar mensagem' })
    await user.click(sendButton)

    expect(sendMensagem).not.toHaveBeenCalled()
  })

  it('renderiza as ações de anexo e emoji', () => {
    renderInput()

    expect(
      screen.getByRole('button', { name: 'Adicionar anexo' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Emoji' })).toBeInTheDocument()
  })

  describe('com o chamado finalizado', () => {
    const chamadoFinalizado: Chamado = { ...mockChamado, status: 'fechado' }

    // O campo desabilitado não recebe ponteiro: o tooltip mora na caixa em volta.
    function getComposer() {
      return screen
        .getByPlaceholderText('Chamado finalizado')
        .closest<HTMLElement>('[data-finalizado="true"]')!
    }

    it('desabilita o campo, o envio e os anexos', () => {
      renderInput({ chamado: chamadoFinalizado })

      expect(screen.getByPlaceholderText('Chamado finalizado')).toBeDisabled()
      expect(
        screen.getByRole('button', { name: 'Enviar mensagem' }),
      ).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Emoji' })).toBeDisabled()
      expect(
        screen.queryByRole('button', { name: 'Adicionar anexo' }),
      ).not.toBeInTheDocument()
    })

    it('explica no tooltip que o chamado pode ser reaberto', async () => {
      const user = setupUser()
      renderInput({ chamado: chamadoFinalizado })

      await user.hover(getComposer())

      expect(await screen.findByRole('tooltip')).toHaveTextContent(
        'Este chamado foi finalizado e não aceita novas mensagens. Reabra o chamado para continuar a conversa.',
      )
    })

    it('não sugere reabrir quando o app não permite', async () => {
      const user = setupUser()
      renderInput({
        chamado: chamadoFinalizado,
        adapter: {
          capabilities: {
            createChamado: true,
            selectDestinatario: false,
            finalizeChamado: false,
            reopenChamado: false,
          },
        },
      })

      await user.hover(getComposer())

      const tooltip = await screen.findByRole('tooltip')
      expect(tooltip).toHaveTextContent(
        'Este chamado foi finalizado e não aceita novas mensagens.',
      )
      expect(tooltip).not.toHaveTextContent('Reabra')
    })
  })
})
