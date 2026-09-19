import type { ChamadoStatusQuery } from '../entities/enum'
import type { Chamado } from '../entities/interface'
import type { ChatHttp } from './chat-http'
import { chamadosPath } from './chat-http'

export interface GetChamadosQuery {
  status?: ChamadoStatusQuery
  search?: string
  locacao_id?: number
  pageIndex?: number
  perPage?: number
}

export interface GetChamadosResponse {
  data: Chamado[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getChamados(
  http: ChatHttp,
  params: GetChamadosQuery = {},
) {
  const response = await http.client.get<GetChamadosResponse>(
    chamadosPath(http),
    { params },
  )
  return response.data
}
