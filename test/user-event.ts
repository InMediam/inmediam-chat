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
    click: (...args) => act(() => user.click(...args)),
    type: (...args) => act(() => user.type(...args)),
    hover: (...args) => act(() => user.hover(...args)),
    keyboard: (...args) => act(() => user.keyboard(...args)),
    upload: (...args) => act(() => user.upload(...args)),
  }
}
