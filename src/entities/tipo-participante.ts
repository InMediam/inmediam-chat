export const PARTICIPANTE_TIPO = {
  LOCATARIO: 'locatario',
  PROPRIETARIO: 'proprietario',
  IMOBILIARIA: 'imobiliaria',
  INMEDIAM: 'inmediam',
  SISTEMA: 'sistema',
} as const

export type ParticipanteTipo =
  (typeof PARTICIPANTE_TIPO)[keyof typeof PARTICIPANTE_TIPO]

const PARTICIPANTE_TIPO_LABEL: Record<ParticipanteTipo, string> = {
  [PARTICIPANTE_TIPO.LOCATARIO]: 'Locatário(a)',
  [PARTICIPANTE_TIPO.PROPRIETARIO]: 'Proprietário(a)',
  [PARTICIPANTE_TIPO.IMOBILIARIA]: 'Imobiliária',
  [PARTICIPANTE_TIPO.INMEDIAM]: 'InMediam',
  [PARTICIPANTE_TIPO.SISTEMA]: 'Sistema',
}

export function getParticipanteTipoLabel(tipo?: ParticipanteTipo | null) {
  return PARTICIPANTE_TIPO_LABEL[tipo ?? PARTICIPANTE_TIPO.LOCATARIO]
}
