import type { ChatCurrentUser } from '../adapter/chat-adapter'
import { MENSAGEM_TIPO } from '../entities/enum'
import type {
  Chamado,
  MensagemItem,
  MensagemView,
  MensagemViewGroup,
} from '../entities/interface'
import type { ParticipanteTipo } from '../entities/tipo-participante'
import { PARTICIPANTE_TIPO } from '../entities/tipo-participante'

/**
 * O chamado guarda apenas a contraparte. Quando ela é a InMediam, quem abriu
 * foi esta instalação, então o solicitante é o próprio usuário autenticado.
 */
export function getChamadoSolicitante(
  chamado: Chamado,
  currentUser: ChatCurrentUser | null,
): { nome: string | null; foto: string | null } {
  if (chamado.participante?.tipo === PARTICIPANTE_TIPO.INMEDIAM) {
    return {
      nome: currentUser?.nome ?? null,
      foto: currentUser?.avatar ?? null,
    }
  }

  return {
    nome: chamado.participante?.nome ?? null,
    foto: chamado.participante?.foto ?? null,
  }
}

const MIME_EXTENSION: Record<string, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'DOCX',
}

/**
 * O Select devolve um valor único, mas o destinatário é identificado pelo par
 * (tipo, id): locatário e proprietário vêm de tabelas distintas e seus ids
 * colidem entre si.
 */
export function toDestinatarioValue(tipo: ParticipanteTipo, id: number) {
  return `${tipo}:${id}`
}

export function parseDestinatarioValue(value: string) {
  const [tipo, id] = value.split(':')

  return { tipo: tipo as ParticipanteTipo, id: Number(id) }
}

export function getMimeExtension(mime: string): string {
  return MIME_EXTENSION[mime] ?? mime.split('/').pop()?.toUpperCase() ?? ''
}

export function groupMensagensByDate(
  mensagens: MensagemItem[],
): MensagemViewGroup[] {
  const groups: Map<string, MensagemView[]> = new Map()

  for (const m of mensagens) {
    const [datePart] = m.created_at.split(' às ')
    const label = dateLabelFromBrDate(datePart)

    if (!groups.has(label)) {
      groups.set(label, [])
    }

    groups.get(label)!.push({
      id: String(m.id),
      tipo: m.tipo ?? MENSAGEM_TIPO.USUARIO,
      author: m.remetente.nome ?? 'Desconhecido',
      isMe: m.remetente.is_me,
      body: m.texto,
      time: m.created_at,
      read: m.readed_at !== null,
      anexos: m.anexos ?? [],
    })
  }

  return Array.from(groups.entries()).map(([label, messages], index) => ({
    id: `group-${index}`,
    label,
    messages,
  }))
}

function dateLabelFromBrDate(brDate: string): string {
  const [day, month, year] = brDate.split('/').map(Number)
  const date = new Date(year, month - 1, day)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Hoje'
  if (date.toDateString() === yesterday.toDateString()) return 'Ontem'
  return brDate
}
