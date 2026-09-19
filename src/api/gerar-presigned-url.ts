import type { ChatHttp } from './chat-http'
import { chamadosPath } from './chat-http'

export interface PresignedUrlItem {
  upload_url: string
  path: string
}

export async function gerarPresignedUrls(
  http: ChatHttp,
  chamadoId: number,
  quantidade: number,
): Promise<PresignedUrlItem[]> {
  const response = await http.client.post<{ data: PresignedUrlItem[] }>(
    chamadosPath(http, `/${chamadoId}/mensagens/presigned-url`),
    { quantidade },
  )
  return response.data.data
}

export async function gerarPresignedUrlsParaChamado(
  http: ChatHttp,
  quantidade: number,
): Promise<PresignedUrlItem[]> {
  const response = await http.client.post<{ data: PresignedUrlItem[] }>(
    chamadosPath(http, '/presigned-url'),
    { quantidade },
  )
  return response.data.data
}
