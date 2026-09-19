import { recordViolation } from './violations'

const allowedUrls: RegExp[] = []

/** Libera, só no teste atual, chamadas HTTP que casem com o padrão. */
export function allowNetwork(pattern: RegExp) {
  allowedUrls.push(pattern)
}

export function resetAllowedNetwork() {
  allowedUrls.length = 0
}

function recordRequest(method: string, url: string) {
  if (!/^https?:/i.test(url)) return
  if (allowedUrls.some((pattern) => pattern.test(url))) return

  recordViolation({ kind: 'network', detail: `${method} ${url}` })
}

function getRequestUrl(input: Parameters<typeof fetch>[0]) {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href

  return input.url
}

// Specs com `@vitest-environment node` (a geração de PDF, por exemplo) rodam
// sem XHR, e o acesso direto quebraria a coleta do arquivo inteiro.
if (typeof XMLHttpRequest !== 'undefined') {
  const originalOpen = XMLHttpRequest.prototype.open

  // `open` é sobrecarregada e depende do `this` da instância; tipar os
  // argumentos aqui obrigaria a replicar as duas assinaturas só para
  // repassá-las intactas ao original.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  XMLHttpRequest.prototype.open = function (this: any, ...args: any[]) {
    recordRequest(String(args[0] ?? 'GET'), String(args[1] ?? ''))

    return originalOpen.apply(this, args as never)
  }
}

const originalFetch = globalThis.fetch
globalThis.fetch = (...args: Parameters<typeof fetch>) => {
  recordRequest('FETCH', getRequestUrl(args[0]))

  return originalFetch(...args)
}
