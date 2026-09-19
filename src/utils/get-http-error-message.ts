import { AxiosError, AxiosResponse } from 'axios'

type StatusMessages = Partial<Record<number, string | React.ReactNode>>

export function getHttpErrorMessage(
  error: AxiosError,
  customMessages?: StatusMessages,
): string | React.ReactNode {
  const response = error.response
  const status = response?.status

  if (!status || !response) {
    return 'Erro desconhecido, tente novamente mais tarde'
  }

  if (customMessages?.[status]) {
    return customMessages[status]!
  }

  return resolveDefaultMessage(response, status)
}

function resolveDefaultMessage(
  response: AxiosResponse,
  status: number,
): string {
  switch (status) {
    case 400:
      return response.data?.message ?? 'Requisição inválida'
    case 401:
      return response.data?.message ?? 'Não autorizado'
    case 403:
      return (
        response.data?.message ??
        'Você não possui permissão para realizar esta ação'
      )
    case 404:
      return 'Recurso não encontrado'
    case 409:
      return response.data?.message ?? 'Conflito ao processar a requisição'
    case 413: {
      return (
        response.data?.message ??
        'O conteúdo enviado excede o tamanho máximo permitido. Reduza os dados ou o arquivo e tente novamente.'
      )
    }
    case 422: {
      const errors = response.data?.errors
      if (errors) {
        return [...new Set(Object.values(errors).flat() as string[])]
          .join(' ')
          .trim()
      }
      return response.data?.message ?? 'Dados inválidos'
    }
    case 410:
      return response.data?.message ?? 'Este link não está mais disponível'
    case 429:
      return (
        response.data?.message ??
        'O limite de requisições foi excedido. Tente novamente mais tarde.'
      )
    case 500:
      return 'Ocorreu um erro inesperado, tente novamente mais tarde'
    case 502:
      return (
        response.data?.message ??
        'O servidor está temporariamente indisponível, tente novamente mais tarde'
      )
    default:
      return 'Ocorreu um erro inesperado, tente novamente mais tarde'
  }
}
