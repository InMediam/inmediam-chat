import { render, screen } from '@testing-library/react'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { setupUser } from '../../test/user-event'
import { setMobileViewport } from '../../test/viewport'
import { ChatProvider } from '../adapter/chat-provider'
import { ChamadosDetails } from '../views/details/chamados-details'
import { mockChamado } from './fixtures'

const { useChamadosChatMock, closeDialog } = vi.hoisted(() => ({
  useChamadosChatMock: vi.fn(),
  closeDialog: vi.fn(),
}))

vi.mock('../hooks/use-chamados-chat', () => ({
  useChamadosChat: useChamadosChatMock,
}))
vi.mock('../hooks/use-chamado-selecionado', () => ({
  useChamadoSelecionado: () => ({ detalhe: mockChamado }),
}))

function renderDetails(dialog: 'details' | null = 'details') {
  useChamadosChatMock.mockReturnValue({ dialog, closeDialog })

  return render(
    <ChatProvider adapter={createChatAdapterStub()}>
      <ChamadosDetails />
    </ChatProvider>,
  )
}

describe('ChamadosDetails', () => {
  beforeEach(() => {
    useChamadosChatMock.mockReset()
    closeDialog.mockReset()
  })

  it('abre como dialog no desktop com o protocolo do chamado', () => {
    renderDetails()

    expect(screen.getByText('Detalhes do chamado')).toBeInTheDocument()
    expect(screen.getByText(mockChamado.protocolo)).toBeInTheDocument()
    expect(screen.getByRole('dialog')).not.toHaveAttribute('data-vaul-drawer')
  })

  it('fica fechado quando outro diálogo está ativo', () => {
    renderDetails(null)

    expect(screen.queryByText('Detalhes do chamado')).not.toBeInTheDocument()
  })

  it('abre como drawer no mobile com o protocolo do chamado', () => {
    setMobileViewport()
    renderDetails()

    expect(screen.getByText('Detalhes do chamado')).toBeInTheDocument()
    expect(screen.getByText(mockChamado.protocolo)).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute('data-vaul-drawer')
  })

  it('fecha o drawer pelo botão de fechar', async () => {
    const user = setupUser()
    setMobileViewport()
    renderDetails()

    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(closeDialog).toHaveBeenCalled()
  })
})
