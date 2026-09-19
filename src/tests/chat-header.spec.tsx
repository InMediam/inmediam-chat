import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { setupUser } from '../../test/user-event'
import { ChatProvider } from '../adapter/chat-provider'
import { ChatHeader } from '../components/chat-header'
import { ChamadosChatProvider } from '../contexts/chamados-chat-context'
import type { Chamado } from '../entities/interface'
import { mockChamado } from './fixtures'

const { useChamadoSelecionadoMock } = vi.hoisted(() => ({
  useChamadoSelecionadoMock: vi.fn(),
}))

vi.mock('../hooks/use-chamado-selecionado', () => ({
  useChamadoSelecionado: useChamadoSelecionadoMock,
}))

function renderHeader(chamado: Chamado) {
  useChamadoSelecionadoMock.mockReturnValue({ chamado })

  return render(
    <ChatProvider adapter={createChatAdapterStub()}>
      <MemoryRouter initialEntries={['/chamados']}>
        <ChamadosChatProvider>
          <ChatHeader />
        </ChamadosChatProvider>
      </MemoryRouter>
    </ChatProvider>,
  )
}

describe('ChatHeader', () => {
  beforeEach(() => {
    useChamadoSelecionadoMock.mockReset()
  })

  it('renderiza o nome e o tipo do participante', () => {
    renderHeader(mockChamado)

    expect(
      screen.getAllByText(mockChamado.participante!.nome),
    ).not.toHaveLength(0)
    expect(screen.getAllByText('Locatário(a)')).not.toHaveLength(0)
  })

  it('renderiza Proprietário(a) para participante proprietario', () => {
    renderHeader({
      ...mockChamado,
      participante: { ...mockChamado.participante!, tipo: 'proprietario' },
    })

    expect(screen.getAllByText('Proprietário(a)')).not.toHaveLength(0)
    expect(screen.queryByText('Locatário(a)')).not.toBeInTheDocument()
  })

  it('oferece finalizar enquanto o chamado não está fechado', async () => {
    const user = setupUser()
    renderHeader(mockChamado)

    await user.click(
      screen.getByRole('button', { name: 'Mais ações do chamado' }),
    )

    expect(screen.getByText('Finalizar chamado')).toBeInTheDocument()
    expect(screen.queryByText('Reabrir chamado')).not.toBeInTheDocument()
  })

  it('oferece reabrir quando o chamado está fechado', async () => {
    const user = setupUser()
    renderHeader({ ...mockChamado, status: 'fechado' })

    await user.click(
      screen.getByRole('button', { name: 'Mais ações do chamado' }),
    )

    expect(screen.getByText('Reabrir chamado')).toBeInTheDocument()
    expect(screen.queryByText('Finalizar chamado')).not.toBeInTheDocument()
  })

  it('renderiza o botão de voltar para a lista', () => {
    renderHeader(mockChamado)

    expect(
      screen.getByRole('button', { name: 'Voltar para lista de chamados' }),
    ).toBeInTheDocument()
  })
})
