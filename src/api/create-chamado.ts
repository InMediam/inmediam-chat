import type { Chamado } from '../entities/interface'
import type { ParticipanteTipo } from '../entities/tipo-participante'
import type { ChatHttp } from './chat-http'
import { chamadosPath } from './chat-http'
import type { AnexoRef } from './send-mensagem'

export interface CreateChamadoBody {
  assunto_id?: number
  servico?: string
  locacao_id: number
  titulo?: string
  descricao: string
  destinatario_tipo?: ParticipanteTipo
  destinatario_id?: number
  anexos?: AnexoRef[]
}

export interface CreateChamadoResponse {
  data: Chamado
}

export async function createChamado(
  http: ChatHttp,
  body: CreateChamadoBody,
): Promise<CreateChamadoResponse> {
  const response = await http.client.post<CreateChamadoResponse>(
    chamadosPath(http),
    body,
  )
  return response.data
}
