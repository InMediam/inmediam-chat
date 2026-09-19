import type { MensagemTipo } from './enum'
import { ChamadoReadState } from './read-state'
import { ChamadoStatus } from './status'
import { ParticipanteTipo } from './tipo-participante'

export interface ImovelChamado {
  id: number
  endereco: string
  numero: string | number
  complemento?: string | null
  bairro: string
  cidade: string
  uf: string
  cep: string
  descricao?: string
  tipo_imovel: {
    id: number
    nome: string
    tipo_grupo: {
      id: number
      nome: string
    }
  }
}

export interface LocatarioChamado {
  id: number
  nome: string | null
  nome_social: string | null
  data_nascimento: string | null
  documento: string | null
  email: string | null
  telefone: string | null
  celular: string | null
  avatar: string | null
}

export type Participante = {
  id: number
  nome: string
  tipo: ParticipanteTipo
  foto: string | null
} | null

export interface Chamado {
  id: number
  protocolo: string
  status: ChamadoStatus
  titulo: string
  subtitulo: string
  participante: Participante
  preview: string | null
  read_state: ChamadoReadState
  locacao_id: number | null
  created_at: string
  finished_at: string | null
  imovel: ImovelChamado | null
  locatario: LocatarioChamado | null
}

export interface AnexoItem {
  url: string
  mime: string
  bytes: number
}

export interface MensagemItem {
  id: number
  tipo: MensagemTipo
  texto: string
  remetente: {
    id: number
    nome: string | null
    tipo: ParticipanteTipo
    is_me: boolean
  }
  created_at: string
  readed_at: string | null
  anexos?: AnexoItem[]
}

/**
 * Mensagem já preparada para render. `isMe` vem do backend (`remetente.is_me`)
 * porque só o servidor sabe qual das partes é quem está autenticado — o mesmo
 * chamado é lido pela imobiliária e pelo cliente, cada um do seu lado.
 */
export interface MensagemView {
  id: string
  tipo: MensagemTipo
  author: string
  isMe: boolean
  body: string
  time: string
  read: boolean
  anexos: AnexoItem[]
}

export interface MensagemViewGroup {
  id: string
  label: string
  messages: MensagemView[]
}

export interface LocacaoChamado {
  id: number
  imovel: {
    endereco: string
    numero: string | number
    complemento?: string | null
    bairro: string
    cidade: string
    uf: string
    cep: string
  }
}
