import type { Chamado } from '../entities/interface'
import type { ChatHttp } from './chat-http'
import { chamadosPath } from './chat-http'

export interface GetChamadoResponse {
  data: Chamado
}

export async function getChamado(http: ChatHttp, id: number) {
  const response = await http.client.get<GetChamadoResponse>(
    chamadosPath(http, `/${id}`),
  )
  return response.data
}
