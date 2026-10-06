import { configure, getConfig } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { act } from 'react'

type UserEvent = ReturnType<typeof userEvent.setup>

export interface ActUserEvent {
  click: (...args: Parameters<UserEvent['click']>) => Promise<void>
  type: (...args: Parameters<UserEvent['type']>) => Promise<void>
  hover: (...args: Parameters<UserEvent['hover']>) => Promise<void>
  keyboard: (...args: Parameters<UserEvent['keyboard']>) => Promise<void>
  upload: (...args: Parameters<UserEvent['upload']>) => Promise<void>
}

/**
 * Roda a interação dentro de um `act` que fica aberto até ela terminar.
 *
 * O user-event executa cada chamada no `asyncWrapper` do Testing Library, que
 * desliga `IS_REACT_ACT_ENVIRONMENT` durante a interação. Com a fila deste
 * `act` aberta, o React 19 avisa "The current testing environment is not
 * configured to support act(...)" a cada update. Aqui o `asyncWrapper` só
 * repassa a chamada, e o original volta no fim.
 */
function withinAct(interaction: () => Promise<void>) {
  return act(async () => {
    const { asyncWrapper } = getConfig()
    configure({ asyncWrapper: (callback) => callback() })

    try {
      await interaction()
    } finally {
      configure({ asyncWrapper })
    }
  })
}

/**
 * `userEvent.setup()` com cada interação envolvida em `act`.
 *
 * O user-event já despacha cada evento dentro de `act`, mas atualizações
 * agendadas por `startTransition` (navegação do react-router v7) ou por ref
 * callbacks do Radix são processadas depois que esse escopo fecha — e aí o
 * React avisa "An update to X inside a test was not wrapped in act(...)".
 * Manter a fila do `act` aberta durante a interação inteira cobre esses
 * updates tardios.
 *
 * O `act` vem de `react`: o reexportado por `@testing-library/react` aponta
 * para `react-dom/test-utils`, que está marcado como deprecated.
 */
export function setupUser(): ActUserEvent {
  const user = userEvent.setup()

  return {
    click: (...args) => withinAct(() => user.click(...args)),
    type: (...args) => withinAct(() => user.type(...args)),
    hover: (...args) => withinAct(() => user.hover(...args)),
    keyboard: (...args) => withinAct(() => user.keyboard(...args)),
    upload: (...args) => withinAct(() => user.upload(...args)),
  }
}
