import type { MensagemItem } from '../entities/interface'
import type { ChatHttp } from './chat-http'
import { chamadosPath } from './chat-http'

export interface AnexoRef {
  path: string
  mime: string
  bytes: number
}

export interface SendMensagemBody {
  chamadoId: number
  texto?: string
  anexos?: AnexoRef[]
}

export interface SendMensagemResponse {
  data: MensagemItem
}

export async function sendMensagem(
  http: ChatHttp,
  { chamadoId, texto, anexos }: SendMensagemBody,
) {
  const response = await http.client.post<SendMensagemResponse>(
    chamadosPath(http, `/${chamadoId}/mensagens`),
    { texto, anexos },
  )
  return response.data
}
