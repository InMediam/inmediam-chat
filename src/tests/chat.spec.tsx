import { TooltipProvider } from '@inmediam/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { setupUser } from '../../test/user-event'
import { ChatProvider } from '../adapter/chat-provider'
import { getChamados } from '../api/get-chamados'
import { ChamadosChat } from '../chamados-chat'

vi.mock('../hooks/use-chamado-mensagens', () => ({
  useChamadoMensagens: () => ({
    messages: [],
    isLoading: false,
    isFetchingMore: false,
    hasMoreMessages: false,
    fetchOlderMessages: vi.fn(),
  }),
}))
vi.mock('../hooks/use-chamado-mensagens-realtime', () => ({
  useChamadoMensagensRealtime: () => undefined,
}))
vi.mock('../hooks/use-infinite-scroll', () => ({
  useInfiniteScroll: () => ({ sentinelRef: { current: null } }),
}))
vi.mock('../api/get-chamados', () => ({ getChamados: vi.fn() }))
vi.mock('../api/get-chamado', () => ({ getChamado: vi.fn() }))

function LocationProbe() {
  const location = useLocation()
  return <div data-testid="loc">{location.search}</div>
}

function renderChat(entries = ['/chamados']) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ChatProvider adapter={createChatAdapterStub()}>
        <TooltipProvider>
          <MemoryRouter initialEntries={entries}>
            <ChamadosChat />
            <LocationProbe />
          </MemoryRouter>
        </TooltipProvider>
      </ChatProvider>
    </QueryClientProvider>,
  )
}

describe('ChamadosChat — busca na URL', () => {
  beforeEach(() => {
    vi.mocked(getChamados).mockResolvedValue({
      data: [],
      meta: { pageIndex: 1, perPage: 15, totalCount: 0 },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('grava ?search na URL e busca no back ao buscar com 3+ caracteres', async () => {
    const user = setupUser()
    renderChat()

    await user.type(screen.getByPlaceholderText('Buscar'), 'rua{Enter}')

    await waitFor(() =>
      expect(screen.getByTestId('loc')).toHaveTextContent('search=rua'),
    )
    await waitFor(() =>
      expect(getChamados).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ search: 'rua' }),
      ),
    )
  })

  it('não altera a URL nem busca com menos de 3 caracteres', async () => {
    const user = setupUser()
    renderChat()

    await user.type(screen.getByPlaceholderText('Buscar'), 'ru{Enter}')

    expect(screen.getByTestId('loc').textContent).toBe('')
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(getChamados).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ search: 'ru' }),
    )
  })

  it('usa o termo vindo da URL ao montar', async () => {
    renderChat(['/chamados?search=paulista'])

    expect(screen.getByPlaceholderText('Buscar')).toHaveValue('paulista')
    await waitFor(() =>
      expect(getChamados).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ search: 'paulista' }),
      ),
    )
  })
})
