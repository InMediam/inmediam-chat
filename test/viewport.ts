import { afterEach } from 'vitest'

const DESKTOP_WIDTH = window.innerWidth

/**
 * O `useIsMobile` do `@inmediam/ui` lê `window.innerWidth` ao montar, e é ele
 * que decide entre Dialog e Drawer. Chame antes do `render`.
 */
export function setMobileViewport(width = 375) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  })
}

afterEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: DESKTOP_WIDTH,
  })
})
