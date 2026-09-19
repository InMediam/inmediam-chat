import type { ChatHttp } from './chat-http'
import { chamadosPath } from './chat-http'

export async function marcarMensagensLidas(http: ChatHttp, chamadoId: number) {
  const response = await http.client.post(
    chamadosPath(http, `/${chamadoId}/mensagens/lidas`),
  )
  return response.data
}
