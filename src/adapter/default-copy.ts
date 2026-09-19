import type { ChatCopy } from './chat-adapter'

export const DEFAULT_CHAT_COPY: ChatCopy = {
  listTitle: 'Chamados',
  createAction: 'Abrir chamado',
  createTitle: 'Abrir novo chamado',
  createDescription: 'Descreva o que aconteceu para que possamos ajudar.',
  searchPlaceholder: 'Buscar',
  searchTooltip:
    'Buscar por título, assunto, serviço, locatário, proprietário e endereço do imóvel',
  emptyListTitle: 'Nenhum chamado por aqui',
  emptyListDescription:
    'Quando um chamado for aberto, ele aparece nesta lista para você acompanhar e responder.',
  noSelectionTitle: 'Selecione um chamado',
  noSelectionDescription:
    'Escolha um chamado na lista ao lado para visualizar as mensagens.',
  messagePlaceholder: 'Informe o que aconteceu, e como podemos te ajudar.',
  destinatarioIndisponivelSuffix: 'em breve',
}
