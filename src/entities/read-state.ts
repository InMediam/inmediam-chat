export const CHAMADO_READ_STATE = {
  NOVO: 'novo',
  LIDO: 'lido',
  NAO_LIDO: 'nao_lido',
} as const

export type ChamadoReadState =
  (typeof CHAMADO_READ_STATE)[keyof typeof CHAMADO_READ_STATE]

export function isChamadoLido(readState?: ChamadoReadState | null) {
  return readState === CHAMADO_READ_STATE.LIDO
}
