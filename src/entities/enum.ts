export const CHAMADO_FILTRO = {
  TODOS: 'todos',
  EM_ABERTO: 'em-aberto',
  FINALIZADOS: 'finalizados',
  NAO_LIDOS: 'nao-lidos',
} as const

export type ChamadoFiltro = (typeof CHAMADO_FILTRO)[keyof typeof CHAMADO_FILTRO]

export const CHAMADO_STATUS_QUERY = {
  EM_ABERTO: 'em-aberto',
  FINALIZADO: 'finalizado',
  NAO_LIDOS: 'nao-lidos',
} as const

export type ChamadoStatusQuery =
  (typeof CHAMADO_STATUS_QUERY)[keyof typeof CHAMADO_STATUS_QUERY]

const FILTRO_TO_STATUS_QUERY: Record<
  ChamadoFiltro,
  ChamadoStatusQuery | undefined
> = {
  [CHAMADO_FILTRO.TODOS]: undefined,
  [CHAMADO_FILTRO.EM_ABERTO]: CHAMADO_STATUS_QUERY.EM_ABERTO,
  [CHAMADO_FILTRO.FINALIZADOS]: CHAMADO_STATUS_QUERY.FINALIZADO,
  [CHAMADO_FILTRO.NAO_LIDOS]: CHAMADO_STATUS_QUERY.NAO_LIDOS,
}

export function toChamadoStatusQuery(filtro: ChamadoFiltro) {
  return FILTRO_TO_STATUS_QUERY[filtro]
}

export const MENSAGEM_TIPO = {
  USUARIO: 'usuario',
  SISTEMA: 'sistema',
} as const

export type MensagemTipo = (typeof MENSAGEM_TIPO)[keyof typeof MENSAGEM_TIPO]
