import { TooltipProvider } from '@inmediam/ui'
import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'

import { setupUser } from '../../test/user-event'
import { ChatSearchInput } from '../components/chat-search-input'

const TOOLTIP = 'Buscar por título, assunto e endereço'

function renderWithProviders(ui: ReactElement) {
  return render(
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      {ui}
    </TooltipProvider>,
  )
}

describe('ChatSearchInput', () => {
  it('preenche o input a partir da prop value (busca vinda da URL)', () => {
    renderWithProviders(
      <ChatSearchInput
        value="paulista"
        onSearch={vi.fn()}
        placeholder="Buscar"
        tooltipContent={TOOLTIP}
      />,
    )

    expect(screen.getByPlaceholderText('Buscar')).toHaveValue('paulista')
  })

  it('emite o termo no Enter quando tem 3+ caracteres', async () => {
    const user = setupUser()
    const onSearch = vi.fn()

    renderWithProviders(
      <ChatSearchInput
        value=""
        onSearch={onSearch}
        placeholder="Buscar"
        tooltipContent={TOOLTIP}
      />,
    )

    await user.type(screen.getByPlaceholderText('Buscar'), 'rua{Enter}')

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith('rua')
  })

  it('bloqueia e mostra dica quando tem menos de 3 caracteres', async () => {
    const user = setupUser()
    const onSearch = vi.fn()

    renderWithProviders(
      <ChatSearchInput
        value=""
        onSearch={onSearch}
        placeholder="Buscar"
        tooltipContent={TOOLTIP}
      />,
    )

    await user.type(screen.getByPlaceholderText('Buscar'), 'ru{Enter}')

    expect(onSearch).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Digite ao menos 3 caracteres para buscar.',
    )
  })

  it('limpa a dica ao continuar digitando', async () => {
    const user = setupUser()

    renderWithProviders(
      <ChatSearchInput
        value=""
        onSearch={vi.fn()}
        placeholder="Buscar"
        tooltipContent={TOOLTIP}
      />,
    )

    const input = screen.getByPlaceholderText('Buscar')
    await user.type(input, 'ru{Enter}')
    expect(screen.getByRole('alert')).toBeInTheDocument()

    await user.type(input, 'a')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('limpa a busca emitindo string vazia no botão X', async () => {
    const user = setupUser()
    const onSearch = vi.fn()

    renderWithProviders(
      <ChatSearchInput
        value="paulista"
        onSearch={onSearch}
        placeholder="Buscar"
        tooltipContent={TOOLTIP}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Limpar busca' }))

    expect(onSearch).toHaveBeenCalledWith('')
    expect(screen.getByPlaceholderText('Buscar')).toHaveValue('')
  })
})
