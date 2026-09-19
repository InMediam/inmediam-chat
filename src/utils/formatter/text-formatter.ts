/**
 * Text formatter utility functions for string manipulation.
 * Provides functions to convert text to uppercase, capitalize the first letter, etc.
 *
 * @params
 * - text: The input string to be formatted.
 * - mode: A string flag to indicate if only the first letter should be capitalized (default: 'default').
 */

type ModeVariant = 'default' | 'only' | 'all'
export function upperCaseFirstLetter({
  text,
  mode = 'default',
}: {
  text: string
  mode?: ModeVariant
}): string {
  if (typeof text !== 'string' || text.length === 0) {
    return ''
  }

  if (mode === 'only') {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  if (mode === 'all') {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return text.replace(/\p{L}/u, (match) => match.toUpperCase())
}

/**
 * Monta uma contagem já flexionada.
 *
 * Ex: formatPlural(1, 'item', 'itens') -> '1 item'
 * Ex: formatPlural(2, 'item', 'itens') -> '2 itens'
 */
export function formatPlural(
  quantidade: number,
  singular: string,
  plural: string,
): string {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`
}

export function htmlToPlainText({ html }: { html: string }): string {
  if (typeof html !== 'string' || html.length === 0) {
    return ''
  }

  return html
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\/\s*(p|div|li|tr|h[1-6])\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
