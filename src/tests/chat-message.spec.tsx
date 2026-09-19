import { render, screen } from '@testing-library/react'

import { ChatMessage } from '../components/chat-message'
import type { MensagemView } from '../entities/interface'

const baseOwnerMessage: MensagemView = {
  id: '1',
  tipo: 'usuario',
  author: 'Você',
  isMe: true,
  body: 'Olá, como posso ajudar?',
  time: '10:00',
  read: false,
  anexos: [],
}

describe('ChatMessage read receipts', () => {
  it('shows single check (Enviada) when own message is not read', () => {
    render(<ChatMessage message={baseOwnerMessage} participante={null} />)

    expect(screen.getByLabelText('Enviada')).toBeInTheDocument()
    expect(screen.queryByLabelText('Lida')).not.toBeInTheDocument()
  })

  it('shows double check (Lida) when own message is read', () => {
    render(
      <ChatMessage
        message={{ ...baseOwnerMessage, read: true }}
        participante={null}
      />,
    )

    expect(screen.getByLabelText('Lida')).toBeInTheDocument()
    expect(screen.queryByLabelText('Enviada')).not.toBeInTheDocument()
  })

  it('does not show receipts on incoming messages', () => {
    render(
      <ChatMessage
        message={{ ...baseOwnerMessage, isMe: false, read: true }}
        participante={{ id: 1, nome: 'Marina', tipo: 'locatario', foto: null }}
      />,
    )

    expect(screen.queryByLabelText('Lida')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Enviada')).not.toBeInTheDocument()
  })
})
