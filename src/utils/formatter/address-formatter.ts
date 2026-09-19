import { cepMask } from '../masks/masks'

interface FormatFullAddressParams {
  label?: string
  imovel: {
    endereco: string
    numero: string | number
    complemento?: string | null
    bairro: string
    cidade: string
    uf: string
    cep: string
  }
}

export function formatFullAddress({
  imovel,
  label = 'Não informado',
}: FormatFullAddressParams) {
  const { endereco, numero, complemento, bairro, cidade, uf, cep } = imovel

  if (!endereco || endereco === '') {
    return label
  }

  return `${endereco}, Nº ${numero} - ${complemento ? complemento + '. ' : ''}${bairro}, ${cidade} - ${uf} · CEP: ${cepMask({ cep })}`
}
