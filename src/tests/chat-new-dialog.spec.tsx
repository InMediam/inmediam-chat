import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { setupUser } from '../../test/user-event'
import { setMobileViewport } from '../../test/viewport'
import { ChatProvider } from '../adapter/chat-provider'
import { createChamado } from '../api/create-chamado'
import { getCategorias } from '../api/get-categorias'
import { CreateChamado } from '../views/create/create-chamado'

const { useChamadosChatMock, closeDialog } = vi.hoisted(() => ({
  useChamadosChatMock: vi.fn(),
  closeDialog: vi.fn(),
}))

vi.mock('../hooks/use-chamados-chat', () => ({
  useChamadosChat: useChamadosChatMock,
}))
vi.mock('../api/get-categorias', () => ({ getCategorias: vi.fn() }))
vi.mock('../api/create-chamado', () => ({ createChamado: vi.fn() }))

const categorias = {
  data: [
    {
      id: 1,
      nome: 'Reparos',
      assuntos: [{ id: 10, descricao: 'Vazamento na pia' }],
    },
    {
      id: 2,
      nome: 'Financeiro',
      assuntos: [{ id: 20, descricao: 'Boleto não recebido' }],
    },
  ],
}

const locacoes = [
  {
    id: 7,
    imovel: {
      endereco: 'Rua das Flores',
      numero: '120',
      complemento: null,
      bairro: 'Centro',
      cidade: 'Juiz de Fora',
      uf: 'MG',
      cep: '36010000',
    },
  },
]

const fetchLocacoes = vi.fn()

function renderDialog() {
  useChamadosChatMock.mockReturnValue({
    dialog: 'novo',
    closeDialog,
    selectChamado: vi.fn(),
    locacaoId: undefined,
  })

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ChatProvider adapter={createChatAdapterStub({ fetchLocacoes })}>
        <CreateChamado />
      </ChatProvider>
    </QueryClientProvider>,
  )
}

describe('ChatNewDialog', () => {
  beforeEach(() => {
    useChamadosChatMock.mockReset()
    closeDialog.mockReset()
    vi.mocked(getCategorias).mockReset()
    vi.mocked(getCategorias).mockResolvedValue(categorias)
    fetchLocacoes.mockReset()
    fetchLocacoes.mockResolvedValue(locacoes)
    vi.mocked(createChamado).mockReset()
  })

  it('busca as categorias e os imóveis ao abrir', async () => {
    renderDialog()

    expect(screen.getByText('Abrir novo chamado')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).not.toHaveAttribute('data-vaul-drawer')
    await waitFor(() => expect(getCategorias).toHaveBeenCalled())
    await waitFor(() => expect(fetchLocacoes).toHaveBeenCalled())
  })

  it('mantém o assunto desabilitado enquanto não há categoria', async () => {
    renderDialog()

    await waitFor(() => expect(getCategorias).toHaveBeenCalled())

    expect(screen.getByLabelText(/Assunto/)).toBeDisabled()
  })

  it('exige categoria, assunto, imóvel e descrição no submit', async () => {
    const user = setupUser()
    renderDialog()

    await user.click(screen.getByRole('button', { name: /Enviar chamado/ }))

    expect(await screen.findByText('Selecione a categoria')).toBeInTheDocument()
    expect(screen.getByText('Selecione o assunto')).toBeInTheDocument()
    expect(screen.getByText('Selecione o imóvel')).toBeInTheDocument()
    expect(screen.getByText('Selecione o destinatário')).toBeInTheDocument()
    expect(screen.getByText('Descreva o que aconteceu')).toBeInTheDocument()
    expect(createChamado).not.toHaveBeenCalled()
  })

  it('fecha pelo botão de cancelar', async () => {
    const user = setupUser()
    renderDialog()

    await waitFor(() => expect(getCategorias).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(closeDialog).toHaveBeenCalled()
  })

  it('abre como drawer no mobile e valida o formulário', async () => {
    const user = setupUser()
    setMobileViewport()
    renderDialog()

    expect(screen.getByText('Abrir novo chamado')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute('data-vaul-drawer')
    await waitFor(() => expect(getCategorias).toHaveBeenCalled())

    await user.click(screen.getByRole('button', { name: /Enviar chamado/ }))

    expect(await screen.findByText('Selecione a categoria')).toBeInTheDocument()
    expect(createChamado).not.toHaveBeenCalled()
  })
})
