import { afterEach, expect } from 'vitest'

import { resetAllowedWarnings } from './console-warnings'
import { resetAllowedNetwork } from './network'
import { takeViolations, Violation, ViolationKind } from './violations'

export { allowWarning } from './console-warnings'
export { allowNetwork } from './network'

const VIOLATION_HINT: Record<ViolationKind, string> = {
  network:
    'Chamada HTTP real (mocke o módulo de `src/api` ou use `allowNetwork`)',
  warning: 'Aviso do React/Radix (corrija o teste ou use `allowWarning`)',
}

function buildHintBlock(kind: ViolationKind, violations: Violation[]) {
  const details = [
    ...new Set(
      violations
        .filter((violation) => violation.kind === kind)
        .map((violation) => `  - ${violation.detail}`),
    ),
  ]

  if (!details.length) return []

  return [`${VIOLATION_HINT[kind]}:\n${details.join('\n')}`]
}

/**
 * Falhar no instante da violação não funciona: uma exceção lançada dentro de
 * uma `queryFn` é capturada pelo React Query, a query só vai para o estado de
 * erro e o teste segue verde. Por isso as violações são coletadas durante o
 * teste e cobradas aqui.
 */
afterEach(() => {
  const violations = takeViolations()

  resetAllowedNetwork()
  resetAllowedWarnings()

  if (!violations.length) return

  const blocks = [
    ...buildHintBlock('network', violations),
    ...buildHintBlock('warning', violations),
  ]

  expect.fail(`Guardas de teste violadas.\n\n${blocks.join('\n\n')}`)
})
