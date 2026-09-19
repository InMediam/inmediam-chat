import { recordViolation } from './violations'

const WATCHED_WARNINGS = [
  'not wrapped in act',
  'Missing `Description`',
  'forwardRef render functions',
  'Each child in a list should have a unique "key"',
  'Warning: Failed prop type',
  'validateDOMNesting',
]

const MAX_DETAIL_LENGTH = 200

const allowedWarnings: RegExp[] = []

/**
 * Libera, só no teste atual, avisos que casem com o padrão. Use apenas para
 * defeito de terceiro que não dá para corrigir aqui, com o motivo ao lado da
 * chamada.
 */
export function allowWarning(pattern: RegExp) {
  allowedWarnings.push(pattern)
}

export function resetAllowedWarnings() {
  allowedWarnings.length = 0
}

/**
 * O React chama `console.error` com format string (`An update to %s …`), então a
 * mensagem crua esconde justamente o nome do componente que causou o aviso.
 */
function formatMessage(args: unknown[]) {
  const [template, ...values] = args
  const pending = [...values]

  const interpolated = String(template ?? '').replace(/%[sdifoOc]/g, () =>
    pending.length ? String(pending.shift()) : '',
  )

  return [interpolated, ...pending.map((value) => String(value))].join(' ')
}

function watchConsole(method: 'error' | 'warn') {
  const original = console[method]

  console[method] = (...args: unknown[]) => {
    const message = formatMessage(args)
    const isWatched = WATCHED_WARNINGS.some((warning) =>
      message.includes(warning),
    )
    const isAllowed = allowedWarnings.some((pattern) => pattern.test(message))

    if (isWatched && !isAllowed) {
      recordViolation({
        kind: 'warning',
        detail: message.split('\n')[0].slice(0, MAX_DETAIL_LENGTH),
      })
    }

    original(...(args as Parameters<typeof original>))
  }
}

watchConsole('error')
watchConsole('warn')
