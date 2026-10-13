import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { setupUser } from '../../test/user-event'
import { setMobileViewport } from '../../test/viewport'
import { ChatProvider } from '../adapter/chat-provider'
import { updateChamadoStatus } from '../api/update-chamado-status'
import { ChamadoReabrir } from '../views/reabrir/chamado-reabrir'
import { mockChamado } from './fixtures'

const chamadoFinalizado = {
  ...mockChamado,
  status: 'fechado' as const,
  finished_at: '2026-05-02T10:00:00.000000Z',
}

const { useChamadosChatMock, closeDialog } = vi.hoisted(() => ({
  useChamadosChatMock: vi.fn(),
  closeDialog: vi.fn(),
}))

vi.mock('../hooks/use-chamados-chat', () => ({
  useChamadosChat: useChamadosChatMock,
}))
vi.mock('../hooks/use-chamado-selecionado', () => ({
  useChamadoSelecionado: () => ({ detalhe: chamadoFinalizado }),
}))
vi.mock('../api/update-chamado-status', () => ({
  updateChamadoStatus: vi.fn(),
}))

function renderDialog(dialog: 'reabrir' | null = 'reabrir') {
  useChamadosChatMock.mockReturnValue({ dialog, closeDialog })

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ChatProvider adapter={createChatAdapterStub()}>
        <ChamadoReabrir />
      </ChatProvider>
    </QueryClientProvider>,
  )
}

describe('ChamadoReabrir', () => {
  beforeEach(() => {
    useChamadosChatMock.mockReset()
    closeDialog.mockReset()
    vi.mocked(updateChamadoStatus).mockReset()
    vi.mocked(updateChamadoStatus).mockResolvedValue({
      data: chamadoFinalizado,
    })
  })

  it('renderiza o resumo do chamado com a data de finalização', () => {
    renderDialog()

    expect(
      screen.getByText('Tem certeza que deseja reabrir este chamado?'),
    ).toBeInTheDocument()
    expect(screen.getByText('Finalizado em')).toBeInTheDocument()
    expect(screen.getByText('02/05/2026')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).not.toHaveAttribute('data-vaul-drawer')
  })

  it('fica fechado quando outro diálogo está ativo', () => {
    renderDialog(null)

    expect(
      screen.queryByText('Tem certeza que deseja reabrir este chamado?'),
    ).not.toBeInTheDocument()
  })

  it('mantém o confirmar desabilitado até marcar o aceite', async () => {
    const user = setupUser()
    renderDialog()

    const confirmar = screen.getByRole('button', { name: /Reabrir chamado/ })
    expect(confirmar).toBeDisabled()

    await user.click(screen.getByRole('checkbox'))

    expect(confirmar).toBeEnabled()
  })

  it('envia o status reaberto ao confirmar', async () => {
    const user = setupUser()
    renderDialog()

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /Reabrir chamado/ }))

    expect(updateChamadoStatus).toHaveBeenCalledWith(expect.anything(), {
      chamadoId: mockChamado.id,
      status: 'reaberto',
    })
  })

  it('abre como drawer no mobile', async () => {
    const user = setupUser()
    setMobileViewport()
    renderDialog()

    expect(
      screen.getByText('Tem certeza que deseja reabrir este chamado?'),
    ).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute('data-vaul-drawer')

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /Reabrir chamado/ }))

    expect(updateChamadoStatus).toHaveBeenCalledWith(expect.anything(), {
      chamadoId: mockChamado.id,
      status: 'reaberto',
    })
  })

  it('fecha pelo botão de fechar', async () => {
    const user = setupUser()
    renderDialog()

    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(closeDialog).toHaveBeenCalled()
  })
})
