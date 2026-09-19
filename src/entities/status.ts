export const CHAMADO_STATUS = {
  ABERTO: 'aberto',
  EM_ANDAMENTO: 'em andamento',
  FECHADO: 'fechado',
  REABERTO: 'reaberto',
} as const

export type ChamadoStatus = (typeof CHAMADO_STATUS)[keyof typeof CHAMADO_STATUS]

export function isChamadoFinalizado(status?: ChamadoStatus | null) {
  return status === CHAMADO_STATUS.FECHADO
}

const CHAMADO_STATUS_LABEL: Record<ChamadoStatus, string> = {
  [CHAMADO_STATUS.ABERTO]: 'Em aberto',
  [CHAMADO_STATUS.EM_ANDAMENTO]: 'Em aberto',
  [CHAMADO_STATUS.FECHADO]: 'Finalizado',
  [CHAMADO_STATUS.REABERTO]: 'Reaberto',
}

export function getChamadoStatusLabel(status?: ChamadoStatus | null) {
  return (status && CHAMADO_STATUS_LABEL[status]) || '-'
}
