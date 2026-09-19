import type { AxiosInstance } from 'axios'
import { vi } from 'vitest'

import type { ChatAdapter } from '../src/adapter/chat-adapter'
import { PARTICIPANTE_TIPO } from '../src/entities/tipo-participante'

/**
 * A instância existe só para satisfazer o contrato: os specs mockam os módulos
 * de `src/api`, então nenhum método daqui é chamado de verdade — e a guarda de
 * rede falharia o teste se fosse.
 */
function createApiStub(): AxiosInstance {
  const resolved = () => vi.fn().mockResolvedValue({ data: {} })

  return {
    get: resolved(),
    post: resolved(),
    put: resolved(),
    patch: resolved(),
    delete: resolved(),
  } as unknown as AxiosInstance
}

export function createChatAdapterStub(
  overrides: Partial<ChatAdapter> = {},
): ChatAdapter {
  return {
    api: createApiStub(),
    isAuthenticated: true,
    currentUser: {
      tipo: PARTICIPANTE_TIPO.IMOBILIARIA,
      id: 1,
      nome: 'Imobiliária Teste',
      avatar: null,
    },
    realtimeChannel: null,
    getRealtime: () => null,
    capabilities: {
      createChamado: true,
      selectDestinatario: true,
      finalizeChamado: true,
      reopenChamado: true,
    },
    fetchLocacoes: vi.fn().mockResolvedValue([]),
    ...overrides,
  }
}
