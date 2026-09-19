import type { ChatHttp } from './chat-http'
import { chamadosPath } from './chat-http'

export interface AssuntoItem {
  id: number
  descricao: string
}

export interface CategoriaItem {
  id: number
  nome: string
  assuntos: AssuntoItem[]
}

export interface GetCategoriasResponse {
  data: CategoriaItem[]
}

export async function getCategorias(
  http: ChatHttp,
): Promise<GetCategoriasResponse> {
  const response = await http.client.get<GetCategoriasResponse>(
    chamadosPath(http, '/categorias'),
  )
  return response.data
}
