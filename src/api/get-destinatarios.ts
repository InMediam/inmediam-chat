import type { ParticipanteTipo } from '../entities/tipo-participante'
import type { ChatHttp } from './chat-http'
import { chamadosPath } from './chat-http'

export interface DestinatarioChamado {
  id: number
  nome: string | null
  tipo: ParticipanteTipo
}

export async function getDestinatarios(
  http: ChatHttp,
  locacaoId: number,
): Promise<DestinatarioChamado[]> {
  const response = await http.client.get<DestinatarioChamado[]>(
    chamadosPath(http, `/locacoes/${locacaoId}/destinatarios`),
  )
  return response.data
}
