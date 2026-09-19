import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import type { ChatHttp } from '../api/chat-http'
import { getMensagens } from '../api/get-mensagens'

const mockGet = vi.fn().mockResolvedValue({
  data: { data: [], meta: { next_cursor: null, has_more: false } },
})

const http: ChatHttp = {
  client: { get: mockGet } as unknown as AxiosInstance,
  basePath: '',
}

describe('getMensagens', () => {
  it('chama endpoint paginado com cursor e perPage', async () => {
    mockGet.mockClear()

    await getMensagens(http, { chamadoId: 42, cursor: 100, perPage: 20 })

    expect(mockGet).toHaveBeenCalledWith('/chamados/42/mensagens', {
      params: { perPage: 20, cursor: 100 },
    })
  })

  it('omite cursor quando null', async () => {
    mockGet.mockClear()

    await getMensagens(http, { chamadoId: 7 })

    expect(mockGet).toHaveBeenCalledWith('/chamados/7/mensagens', {
      params: { perPage: 30 },
    })
  })
})
