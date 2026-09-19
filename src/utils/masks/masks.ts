export function cepMask({ cep }: { cep: string | null | undefined }) {
  if (!cep) return ''
  return cep.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2')
}

export function cpfMask({ cpf }: { cpf: string | null | undefined }) {
  if (!cpf) return ''

  return cpf
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})$/, '$1-$2')
}

export function cnpjMask({ cnpj }: { cnpj: string | null | undefined }) {
  if (!cnpj) return ''

  // Mantém letras (A-Z) e dígitos; remove máscara e caracteres inválidos; máx. 14
  const value = cnpj
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 14)

  // Aplica a máscara progressivamente: XX.XXX.XXX/XXXX-XX
  let out = value.slice(0, 2)
  if (value.length > 2) out += '.' + value.slice(2, 5)
  if (value.length > 5) out += '.' + value.slice(5, 8)
  if (value.length > 8) out += '/' + value.slice(8, 12)
  if (value.length > 12) out += '-' + value.slice(12, 14)

  return out
}

export function passportMask({
  passport,
}: {
  passport: string | null | undefined
}) {
  if (!passport) return ''

  return passport
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 9)
}

export function documentMaskByType({
  document,
  type,
}: {
  document: string | null | undefined
  type: 'CPF' | 'CNPJ'
}) {
  if (!document) return ''

  if (type === 'CNPJ') return cnpjMask({ cnpj: document })

  return cpfMask({ cpf: document })
}

export function documentMaskByLength({
  document,
}: {
  document: string | null | undefined
}) {
  if (!document) return ''

  const unmasked = unMaskInputDocumentValue({ document })

  if (unmasked.length === 14) return cnpjMask({ cnpj: unmasked })

  if (unmasked.length === 11) return cpfMask({ cpf: unmasked })

  return document
}

export function phoneMask({ phone }: { phone: string | null | undefined }) {
  if (!phone) return ''
  return phone
    ?.replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(\d{4})(\d)/, '$1$2')
}

export function telMask({ tel }: { tel: string | null | undefined }) {
  if (!tel) return ''
  return tel
    ?.replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\d{4})(\d)/, '$1$2')
}

export function unMask({ value }: { value: string }) {
  if (!value) return ''
  return value.replace(/\D/g, '').trim()
}

/**
 * Máscara para número de conta bancária: mantém apenas dígitos e o hífen do
 * dígito verificador (ex.: "12345-6"), bloqueando letras e demais caracteres.
 */
export function maskContaBancaria({ value }: { value: string }) {
  if (!value) return ''
  const sanitized = value.replace(/[^\d-]/g, '').replace(/^-+/, '')
  const hyphenIndex = sanitized.indexOf('-')
  if (hyphenIndex === -1) return sanitized
  return (
    sanitized.slice(0, hyphenIndex + 1) +
    sanitized.slice(hyphenIndex + 1).replace(/-/g, '')
  )
}

/**
 * Formata para exibição uma conta armazenada apenas com dígitos (ex.: "123456"),
 * inserindo o hífen antes do dígito verificador (ex.: "12345-6"). Se já vier com
 * hífen, mantém como está.
 */
export function formatContaComDigito(conta?: string | null) {
  if (!conta) return ''
  if (conta.includes('-')) return conta
  const digits = conta.replace(/\D/g, '')
  if (digits.length < 2) return digits
  return `${digits.slice(0, -1)}-${digits.slice(-1)}`
}

export function unMaskInputCEPValue({ cep }: { cep: string }) {
  if (!cep) return ''

  let unMaskValue = unMask({ value: cep })

  if (unMaskValue.length > 8) {
    unMaskValue = unMaskValue.slice(0, -1)
  }

  return unMaskValue
}

export function unMaskInputPhoneValue({ phone }: { phone: string }) {
  if (!phone) return ''

  let unMaskValue = unMask({ value: phone })

  if (unMaskValue.length > 11) {
    unMaskValue = unMaskValue.slice(0, -1)
  }

  return unMaskValue
}

export function unMaskInputTelValue({ tel }: { tel: string }) {
  if (!tel) return ''
  let unMaskValue = unMask({ value: tel })

  if (unMaskValue.length > 10) {
    unMaskValue = unMaskValue.slice(0, -1)
  }
  return unMaskValue
}

export function unMaskInputCPFValue({ cpf }: { cpf: string }) {
  if (!cpf) return ''

  let unMaskValue = unMask({ value: cpf })

  if (unMaskValue.length > 11) {
    unMaskValue = unMaskValue.slice(0, -1)
  }

  return unMaskValue
}

export function unMaskInputDocumentValue({
  document,
  type,
}: {
  document: string
  type?: 'CPF' | 'CNPJ'
}) {
  if (!document) return ''

  // CPF é sempre numérico
  if (type === 'CPF') {
    return unMask({ value: document }).slice(0, 11)
  }

  // CNPJ (alfanumérico) e detecção por tamanho (sem type): mantém A-Z + dígitos
  let unMaskValue = document.toUpperCase().replace(/[^A-Z0-9]/g, '')

  if (type === 'CNPJ') {
    unMaskValue = unMaskValue.slice(0, 14)
    // Os 2 dígitos verificadores devem ser numéricos
    if (unMaskValue.length > 12) {
      unMaskValue =
        unMaskValue.slice(0, 12) + unMaskValue.slice(12).replace(/\D/g, '')
    }
  }

  return unMaskValue
}

export function percentageMask({ percentage }: { percentage: number }) {
  if (!percentage) return '0%'

  if (Number.isInteger(percentage)) {
    return `${percentage}%`
  }

  return `${percentage.toFixed(2)}%`
}

export function branchMask({ branch }: { branch: string | null | undefined }) {
  if (!branch) return '-'
  return branch.padStart(4, '0')
}
