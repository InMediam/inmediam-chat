import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { setupUser } from '../../test/user-event'
import { setMobileViewport } from '../../test/viewport'
import type { ChatAdapter } from '../adapter/chat-adapter'
import { ChatProvider } from '../adapter/chat-provider'
import { createChamado } from '../api/create-chamado'
import { getCategorias } from '../api/get-categorias'
import { getDestinatarios } from '../api/get-destinatarios'
import { PARTICIPANTE_TIPO } from '../entities/tipo-participante'
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
vi.mock('../api/get-destinatarios', () => ({ getDestinatarios: vi.fn() }))

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

const destinatarios = [
  { id: 1, nome: 'InMediam', tipo: PARTICIPANTE_TIPO.INMEDIAM },
  { id: 3, nome: 'Ana Souza', tipo: PARTICIPANTE_TIPO.LOCATARIO },
]

const fetchLocacoes = vi.fn()

interface RenderDialogOptions {
  locacaoId?: number
  adapter?: Partial<ChatAdapter>
}

function renderDialog({ locacaoId, adapter }: RenderDialogOptions = {}) {
  useChamadosChatMock.mockReturnValue({
    dialog: 'novo',
    closeDialog,
    selectChamado: vi.fn(),
    locacaoId,
  })

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ChatProvider
        adapter={createChatAdapterStub({ fetchLocacoes, ...adapter })}
      >
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
    vi.mocked(getDestinatarios).mockReset()
    vi.mocked(getDestinatarios).mockResolvedValue(destinatarios)
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

describe('ChatNewDialog com destinatário atendido fora do chat', () => {
  const onSubmitExterno = vi.fn()

  const destinatariosExternos = [
    {
      tipo: PARTICIPANTE_TIPO.INMEDIAM,
      notice: 'Os anexos não seguem por este canal.',
      submitLabel: 'Continuar no canal externo',
      onSubmit: onSubmitExterno,
    },
  ]

  async function selecionar(
    user: ReturnType<typeof setupUser>,
    campo: RegExp,
    opcao: string,
  ) {
    await waitFor(() => expect(screen.getByLabelText(campo)).toBeEnabled())
    await user.click(screen.getByLabelText(campo))
    await user.click(await screen.findByRole('option', { name: opcao }))
  }

  async function preencher(
    user: ReturnType<typeof setupUser>,
    destinatario: string,
  ) {
    await selecionar(user, /Categoria/, 'Reparos')
    await selecionar(user, /Assunto/, 'Vazamento na pia')
    await selecionar(user, /Destinatário/, destinatario)
    await user.type(
      screen.getByLabelText(/Escreva sua mensagem/),
      'A pia da cozinha está vazando.',
    )
  }

  beforeEach(() => {
    useChamadosChatMock.mockReset()
    closeDialog.mockReset()
    onSubmitExterno.mockReset()
    vi.mocked(getCategorias).mockReset()
    vi.mocked(getCategorias).mockResolvedValue(categorias)
    fetchLocacoes.mockReset()
    fetchLocacoes.mockResolvedValue(locacoes)
    vi.mocked(createChamado).mockReset()
    vi.mocked(getDestinatarios).mockReset()
    vi.mocked(getDestinatarios).mockResolvedValue(destinatarios)
  })

  it('troca os anexos pelo aviso e renomeia o envio', async () => {
    const user = setupUser()
    renderDialog({ locacaoId: 7, adapter: { destinatariosExternos } })

    await selecionar(user, /Destinatário/, 'InMediam · InMediam')

    expect(
      screen.getByText('Os anexos não seguem por este canal.'),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Clique ou arraste/)).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Continuar no canal externo/ }),
    ).toBeInTheDocument()
  })

  it('entrega o rascunho ao app em vez de criar o chamado', async () => {
    const user = setupUser()
    renderDialog({ locacaoId: 7, adapter: { destinatariosExternos } })

    await preencher(user, 'InMediam · InMediam')
    await user.click(
      screen.getByRole('button', { name: /Continuar no canal externo/ }),
    )

    await waitFor(() =>
      expect(onSubmitExterno).toHaveBeenCalledWith({
        categoria: 'Reparos',
        assunto: 'Vazamento na pia',
        locacaoId: 7,
        descricao: 'A pia da cozinha está vazando.',
      }),
    )
    expect(createChamado).not.toHaveBeenCalled()
    expect(closeDialog).toHaveBeenCalled()
  })

  it('cria o chamado normalmente para destinatários do chat', async () => {
    const user = setupUser()
    vi.mocked(createChamado).mockResolvedValue({
      data: { id: 99 },
    } as Awaited<ReturnType<typeof createChamado>>)
    renderDialog({ locacaoId: 7, adapter: { destinatariosExternos } })

    await preencher(user, 'Ana Souza · Locatário(a)')
    expect(screen.getByText(/Clique ou arraste/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Enviar chamado/ }))

    await waitFor(() =>
      expect(createChamado).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          destinatario_tipo: PARTICIPANTE_TIPO.LOCATARIO,
          destinatario_id: 3,
        }),
      ),
    )
    expect(onSubmitExterno).not.toHaveBeenCalled()
  })
})
