import type { AxiosInstance } from 'axios'

import type { LocacaoChamado } from '../entities/interface'
import type { ParticipanteTipo } from '../entities/tipo-participante'

export interface ChatCurrentUser {
  /**
   * Lado da conversa em que esta instalação está. É o que decide o alinhamento
   * da bolha: o id não serve para isso porque locatário, proprietário e
   * imobiliária vivem em tabelas distintas e seus ids colidem entre si.
   */
  tipo: ParticipanteTipo
  nome: string | null
  avatar: string | null
}

export interface ChatCapabilities {
  createChamado: boolean
  selectDestinatario: boolean
  finalizeChamado: boolean
  reopenChamado: boolean
}

export interface ChatCopy {
  listTitle: string
  createAction: string
  createTitle: string
  createDescription: string
  searchPlaceholder: string
  searchTooltip: string
  emptyListTitle: string
  emptyListDescription: string
  noSelectionTitle: string
  noSelectionDescription: string
  messagePlaceholder: string
  destinatarioIndisponivelSuffix: string
}

export const CHAT_DETAILS_TAB = {
  CHAMADO: 'chamado',
  LOCATARIO: 'locatario',
  IMOVEL: 'imovel',
} as const

export type ChatDetailsTab =
  (typeof CHAT_DETAILS_TAB)[keyof typeof CHAT_DETAILS_TAB]

export interface ChatDetailsTabOption {
  value: ChatDetailsTab
  label: string
}

export interface ChatRealtimeChannel {
  listen: (event: string, callback: (payload: never) => void) => unknown
  stopListening: (event: string) => unknown
}

export interface ChatRealtime {
  private: (channelName: string) => ChatRealtimeChannel
  leave: (channelName: string) => void
}

export interface ChatAdapter {
  api: AxiosInstance
  /**
   * Raiz do recurso, quando o app serve os chamados sob um prefixo próprio
   * (ex.: `/inmediam-clientes`). Vazio por padrão.
   */
  basePath?: string
  isAuthenticated: boolean
  currentUser: ChatCurrentUser | null
  /**
   * Canal privado que avisa a conta inteira sobre qualquer chamado. Cada app
   * monta o nome porque a identidade difere: a imobiliária escuta pelo cliente
   * e o app de clientes escuta pelo usuário.
   */
  realtimeChannel: string | null
  getRealtime: () => ChatRealtime | null
  /**
   * Chamado quando o transporte reconecta, para revalidar o que se perdeu
   * offline. O app devolve a função de cancelar a inscrição.
   */
  onRealtimeReconnect?: (callback: () => void) => () => void
  capabilities: ChatCapabilities
  /**
   * Tipos de destinatário que aparecem na lista mas ainda não aceitam chamado.
   * É configuração porque a regra é do produto, e não do pacote: reabilitar
   * não pode depender de publicar versão nova.
   */
  destinatariosIndisponiveis?: ParticipanteTipo[]
  fetchLocacoes: () => Promise<LocacaoChamado[]>
  copy?: Partial<ChatCopy>
  detailsTabs?: ChatDetailsTabOption[]
}
