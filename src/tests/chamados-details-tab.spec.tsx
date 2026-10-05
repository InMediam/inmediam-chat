import { render, screen } from '@testing-library/react'

import { createChatAdapterStub } from '../../test/chat-adapter-stub'
import { ChatProvider } from '../adapter/chat-provider'
import type { Chamado } from '../entities/interface'
import { ChamadosDetailsTab } from '../views/details/components/chamados-details-tab'
import { mockChamado } from './fixtures'

function renderTab(overrides: Partial<Chamado> = {}) {
  return render(
    <ChatProvider adapter={createChatAdapterStub()}>
      <ChamadosDetailsTab chamado={{ ...mockChamado, ...overrides }} />
    </ChatProvider>,
  )
}

function rowByLabel(label: string): HTMLElement {
  const row = screen.getByText(label).closest('div')

  if (!row) throw new Error(`linha de "${label}" não encontrada`)

  return row
}

describe('ChamadosDetailsTab', () => {
  it('exibe o subtítulo como "Tipo de solicitação" e o título como "Motivo da solicitação"', () => {
    renderTab({
      titulo: 'Solicitar reparos',
      subtitulo: 'Problemas no Imóvel',
    })

    expect(rowByLabel('Tipo de solicitação')).toHaveTextContent(
      'Problemas no Imóvel',
    )
    expect(rowByLabel('Motivo da solicitação')).toHaveTextContent(
      'Solicitar reparos',
    )
  })

  it('não exibe "Vistoria / Vistoria" quando o assunto e a categoria vêm distintos da API', () => {
    renderTab({
      titulo: 'Troca de fechadura',
      subtitulo: 'Problemas de segurança',
    })

    expect(rowByLabel('Tipo de solicitação')).toHaveTextContent(
      'Problemas de segurança',
    )
    expect(rowByLabel('Motivo da solicitação')).toHaveTextContent(
      'Troca de fechadura',
    )
    expect(screen.queryByText('Vistoria')).not.toBeInTheDocument()
  })
})
