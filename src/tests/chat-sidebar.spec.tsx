import { TooltipProvider } from '@inmediam/ui'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { setupUser } from '../../test/user-event'
import { ChatProvider } from '../adapter/chat-provider'
import { ChatSidebar } from '../components/chat-sidebar'
import { ChamadosChatProvider } from '../contexts/chamados-chat-context'
import type { Chamado } from '../entities/interface'
import { mockChamado } from './fixtures'

const { useChamadosListMock } = vi.hoisted(() => ({
  useChamadosListMock: vi.fn(),
}))

vi.mock('../hooks/use-chamados-list', () => ({
  useChamadosList: useChamadosListMock,
}))
vi.mock('../hooks/use-infinite-scroll', () => ({
  useInfiniteScroll: () => ({ sentinelRef: { current: null } }),
}))

const secondChamado: Chamado = {
  ...mockChamado,
  id: 2,
  titulo: 'Interfone sem áudio',
  subtitulo: 'Suporte técnico',
  participante: {
    id: 6,
    nome: 'Juliana Ramos',
    tipo: 'locatario',
    foto: null,
  },
  status: 'aberto',
}

function LocationProbe() {
  const location = useLocation()
  return <div data-testid="loc">{location.search}</div>
}

function renderSidebar(chamados: Chamado[] = [mockChamado, secondChamado]) {
  useChamadosListMock.mockReturnValue({
    chamados,
    totalCount: chamados.length,
    isPending: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
  })

  return render(
    <ChatProvider adapter={createChatAdapterStub()}>
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <MemoryRouter initialEntries={['/chamados']}>
          <ChamadosChatProvider>
            <ChatSidebar />
            <LocationProbe />
          </ChamadosChatProvider>
        </MemoryRouter>
      </TooltipProvider>
    </ChatProvider>,
  )
}

describe('ChatSidebar', () => {
  beforeEach(() => {
    useChamadosListMock.mockReset()
  })

  it('renderiza o título e o total', () => {
    renderSidebar()

    expect(screen.getByText('Chamados')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renderiza todos os chamados da lista', () => {
    renderSidebar()

    expect(screen.getByText(mockChamado.titulo)).toBeInTheDocument()
    expect(screen.getByText(secondChamado.titulo)).toBeInTheDocument()
  })

  it('grava o chamado selecionado na URL ao clicar no item', async () => {
    const user = setupUser()
    renderSidebar()

    await user.click(screen.getByRole('button', { name: secondChamado.titulo }))

    expect(screen.getByTestId('loc')).toHaveTextContent(
      `chamado=${secondChamado.id}`,
    )
  })

  it('não renderiza itens quando a lista está vazia', () => {
    renderSidebar([])

    expect(screen.queryByText(mockChamado.titulo)).not.toBeInTheDocument()
  })
})
