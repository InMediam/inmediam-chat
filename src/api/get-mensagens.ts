import type { MensagemItem } from '../entities/interface'
import type { ChatHttp } from './chat-http'
import { chamadosPath } from './chat-http'

export interface GetMensagensParams {
  chamadoId: number
  cursor?: number | null
  perPage?: number
}

export interface GetMensagensResponse {
  data: MensagemItem[]
  meta: {
    next_cursor: number | null
    has_more: boolean
  }
}

export async function getMensagens(
  http: ChatHttp,
  { chamadoId, cursor, perPage = 30 }: GetMensagensParams,
): Promise<GetMensagensResponse> {
  const params: Record<string, number> = { perPage }
  if (cursor != null) params.cursor = cursor

  const response = await http.client.get<GetMensagensResponse>(
    chamadosPath(http, `/${chamadoId}/mensagens`),
    { params },
  )
  return response.data
}
