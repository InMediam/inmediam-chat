import type { Chamado } from '../entities/interface'
import type { ChamadoStatus } from '../entities/status'
import type { ChatHttp } from './chat-http'
import { chamadosPath } from './chat-http'

export interface UpdateChamadoStatusBody {
  chamadoId: number
  status: ChamadoStatus
}

export interface UpdateChamadoStatusResponse {
  data: Chamado
}

export async function updateChamadoStatus(
  http: ChatHttp,
  { chamadoId, status }: UpdateChamadoStatusBody,
) {
  const response = await http.client.patch<UpdateChamadoStatusResponse>(
    chamadosPath(http, `/${chamadoId}/status`),
    { status },
  )
  return response.data
}
