import type { AxiosInstance } from 'axios'

/**
 * O app de clientes serve os chamados sob um prefixo próprio, então a raiz do
 * recurso entra pelo adapter em vez de ficar fixa nas funções de API.
 */
export interface ChatHttp {
  client: AxiosInstance
  basePath: string
}

export function chamadosPath(http: ChatHttp, path = ''): string {
  return `${http.basePath}/chamados${path}`
}
