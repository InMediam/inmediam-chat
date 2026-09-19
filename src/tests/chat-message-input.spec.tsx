import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { setupUser } from '../../test/user-event'
import { ChatProvider } from '../adapter/chat-provider'
import { sendMensagem } from '../api/send-mensagem'
import { ChatMessageInput } from '../components/message/chat-message-input'
import { ChamadosChatProvider } from '../contexts/chamados-chat-context'
import { mockChamado } from './fixtures'

const { useChamadoSelecionadoMock } = vi.hoisted(() => ({
  useChamadoSelecionadoMock: vi.fn(),
}))

vi.mock('../hooks/use-chamado-selecionado', () => ({
  useChamadoSelecionado: useChamadoSelecionadoMock,
}))
vi.mock('../api/send-mensagem', () => ({ sendMensagem: vi.fn() }))

function renderInput() {
  useChamadoSelecionadoMock.mockReturnValue({ chamado: mockChamado })

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ChatProvider adapter={createChatAdapterStub()}>
        <MemoryRouter initialEntries={[`/chamados?chamado=${mockChamado.id}`]}>
          <ChamadosChatProvider>
            <ChatMessageInput />
          </ChamadosChatProvider>
        </MemoryRouter>
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
      screen.getAllByPlaceholderText('Escreva sua mensagem...'),
    ).not.toHaveLength(0)
  })

  it('guarda o texto digitado no rascunho do chamado', async () => {
    const user = setupUser()
    renderInput()

    const [input] = screen.getAllByPlaceholderText('Escreva sua mensagem...')
    await user.type(input, 'Olá')

    expect(input).toHaveValue('Olá')
  })

  it('envia a mensagem sem anexos ao clicar em enviar', async () => {
    const user = setupUser()
    renderInput()

    const [input] = screen.getAllByPlaceholderText('Escreva sua mensagem...')
    await user.type(input, 'Olá')

    const [sendButton] = screen.getAllByRole('button', {
      name: 'Enviar mensagem',
    })
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

    const [sendButton] = screen.getAllByRole('button', {
      name: 'Enviar mensagem',
    })
    await user.click(sendButton)

    expect(sendMensagem).not.toHaveBeenCalled()
  })

  it('renderiza as ações de anexo e emoji', () => {
    renderInput()

    expect(
      screen.getAllByRole('button', { name: 'Adicionar anexo' }),
    ).not.toHaveLength(0)
    expect(screen.getAllByRole('button', { name: 'Emoji' })).not.toHaveLength(0)
  })
})
