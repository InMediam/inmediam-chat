import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'

import { setupUser } from '../../test/user-event'
import { ChatConversationItem } from '../components/conversation/chat-conversation-item'
import { ChamadosChatProvider } from '../contexts/chamados-chat-context'
import { formatDateStringToBrTZ } from '../utils/formatter/date-formatter'
import { mockChamado } from './fixtures'

function LocationProbe() {
  const location = useLocation()
  return <div data-testid="loc">{location.search}</div>
}

function renderItem(ui: ReactElement, entries = ['/chamados']) {
  return render(
    <MemoryRouter initialEntries={entries}>
      <ChamadosChatProvider>
        {ui}
        <LocationProbe />
      </ChamadosChatProvider>
    </MemoryRouter>,
  )
}

describe('ChatConversationItem', () => {
  it('renderiza título, subtítulo, data e solicitante', () => {
    renderItem(<ChatConversationItem chamado={mockChamado} />)

    expect(screen.getByText(mockChamado.titulo)).toBeInTheDocument()
    expect(screen.getByText(mockChamado.subtitulo)).toBeInTheDocument()
    expect(
      screen.getByText(
        formatDateStringToBrTZ({ date: mockChamado.created_at }),
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(mockChamado.participante!.nome)).toBeInTheDocument()
  })

  it('seleciona o chamado na URL ao clicar', async () => {
    const user = setupUser()
    renderItem(<ChatConversationItem chamado={mockChamado} />)

    await user.click(screen.getByRole('button', { name: mockChamado.titulo }))

    expect(screen.getByTestId('loc')).toHaveTextContent(
      `chamado=${mockChamado.id}`,
    )
  })

  it('mostra o badge "Novo" quando read_state é novo', () => {
    renderItem(
      <ChatConversationItem chamado={{ ...mockChamado, read_state: 'novo' }} />,
    )

    expect(screen.getByText('Novo')).toBeInTheDocument()
    expect(screen.queryByText('Não lido')).not.toBeInTheDocument()
  })

  it('mostra o badge "Não lido" quando read_state é nao_lido', () => {
    renderItem(
      <ChatConversationItem
        chamado={{ ...mockChamado, read_state: 'nao_lido' }}
      />,
    )

    expect(screen.getByText('Não lido')).toBeInTheDocument()
    expect(screen.queryByText('Novo')).not.toBeInTheDocument()
  })

  it('esconde os badges de leitura quando read_state é lido', () => {
    renderItem(
      <ChatConversationItem chamado={{ ...mockChamado, read_state: 'lido' }} />,
    )

    expect(screen.queryByText('Novo')).not.toBeInTheDocument()
    expect(screen.queryByText('Não lido')).not.toBeInTheDocument()
  })

  it('marca o item como ativo quando é o chamado da URL', () => {
    renderItem(<ChatConversationItem chamado={mockChamado} />, [
      `/chamados?chamado=${mockChamado.id}`,
    ])

    expect(
      screen.getByRole('button', { name: mockChamado.titulo }),
    ).toHaveAttribute('data-active', 'true')
  })

  it('marca o item como inativo quando outro chamado está na URL', () => {
    renderItem(<ChatConversationItem chamado={mockChamado} />, [
      '/chamados?chamado=99',
    ])

    expect(
      screen.getByRole('button', { name: mockChamado.titulo }),
    ).toHaveAttribute('data-active', 'false')
  })
})
