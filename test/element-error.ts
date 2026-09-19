import { configure, prettyDOM } from '@testing-library/react'

const CONTAINER_PRINT_LIMIT = Number(process.env.DEBUG_PRINT_LIMIT ?? 0)

const MATCH_PRINT_LIMIT = 1000

function createElementError(message: string | null, container: Element) {
  const limit = message === null ? MATCH_PRINT_LIMIT : CONTAINER_PRINT_LIMIT
  const markup = limit > 0 ? prettyDOM(container, limit) : ''

  const error = new Error([message, markup].filter(Boolean).join('\n\n'))
  error.name = 'TestingLibraryElementError'

  Error.captureStackTrace?.(error, createElementError)

  return error
}

configure({ getElementError: createElementError })
