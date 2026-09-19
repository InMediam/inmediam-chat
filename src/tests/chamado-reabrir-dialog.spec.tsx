import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { setupUser } from '../../test/user-event'
import { ChatProvider } from '../adapter/chat-provider'
import { updateChamadoStatus } from '../api/update-chamado-status'
import { ChamadoReabrirDialog } from '../views/reabrir/chamado-reabrir-dialog'
import { mockChamado } from './fixtures'

const chamadoFinalizado = {
  ...mockChamado,
  status: 'fechado' as const,
  finished_at: '2026-05-02T10:00:00.000000Z',
}

const { useChamadosChatMock } = vi.hoisted(() => ({
  useChamadosChatMock: vi.fn(),
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
  useChamadosChatMock.mockReturnValue({ dialog, closeDialog: vi.fn() })

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ChatProvider adapter={createChatAdapterStub()}>
        <ChamadoReabrirDialog />
      </ChatProvider>
    </QueryClientProvider>,
  )
}

describe('ChamadoReabrirDialog', () => {
  beforeEach(() => {
    useChamadosChatMock.mockReset()
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
})
