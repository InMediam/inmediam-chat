import { parse, toDate } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { format, toZonedTime } from 'date-fns-tz'

import { upperCaseFirstLetter } from './text-formatter'

export type StringDate = string | null | undefined

/**
 * Formata uma data em string para o formato especificado (padrão: 'dd/MM/yyyy').
 *
 * ⚠️ ATENÇÃO: Esta função assume que a data está time zone: 'America/Sao_Paulo'.
 * Ela pode retornar valores incorretos ao lidar com time zones fora do Brasil,
 */
export function formatDateString({
  date,
  dateFormat = 'dd/MM/yyyy',
}: {
  date: StringDate
  dateFormat?: string
}) {
  if (!date) return ''

  const dateConverted = toDate(date)

  if (isNaN(dateConverted.getTime())) {
    return ''
  }

  if (dateFormat.includes('H')) {
    const zonedDate = toZonedTime(dateConverted, 'America/Sao_Paulo')
    return format(zonedDate, dateFormat, { locale: ptBR })
  }

  const dateIso = dateConverted.toISOString()
  const parsed = parse(dateIso, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date())

  if (isNaN(parsed.getTime())) {
    return ''
  }

  return format(parsed, dateFormat, { locale: ptBR })
}

export function formatCompetencia({
  competencia,
}: {
  competencia: StringDate
}) {
  if (!competencia) return ''

  const [ano, mes] = competencia.split('-')

  if (!ano || !mes) return ''

  return `${mes}/${ano}`
}

export function formatStringToDate({
  date,
}: {
  date: StringDate
}): Date | undefined {
  if (!date) return undefined

  const formattedDate = toDate(date)

  if (isNaN(formattedDate.getTime())) return undefined

  return formattedDate
}

export function dateRangeString({
  initialDate,
  finalDate,
}: {
  initialDate: StringDate
  finalDate: StringDate
}): string {
  if (!initialDate || !finalDate) {
    return ''
  }

  const initialDateString = formatDateString({
    date: initialDate,
    dateFormat: 'dd/MM/yyyy',
  })
  const finalDateString = formatDateString({
    date: finalDate,
    dateFormat: 'dd/MM/yyyy',
  })

  const [parsedInitialDay, ...parsedInitialMonth] = initialDateString.split('/')
  const [parsedFinalDay, ...parsedFinalMonth] = finalDateString.split('/')

  const isSameDay = parsedInitialDay === parsedFinalDay
  const isSameMonth =
    parsedInitialMonth.join('/') === parsedFinalMonth.join('/')

  if (isSameDay && isSameMonth) {
    return formatDateString({
      date: initialDate,
      dateFormat: "d 'de' MMMM",
    })
  }

  const formattedInitialDate = formatDateString({
    date: initialDate,
    dateFormat: isSameMonth ? 'd' : "d 'de' MMMM",
  })

  const formattedFinalDate = formatDateString({
    date: finalDate,
    dateFormat: "d 'de' MMMM",
  })

  return `${formattedInitialDate} a ${formattedFinalDate}`
}

export function dateWithUppercaseMonth({
  date,
  dateFormat = 'dd de MMM yyyy',
}: {
  date: StringDate
  dateFormat?: string
}): string {
  if (!date) return ''

  const formattedDate = []

  if (dateFormat.includes('dd')) {
    formattedDate.push(
      formatDateString({
        date,
        dateFormat: 'dd',
      }),
    )
  }

  if (dateFormat.includes('de')) {
    formattedDate.push('de')
  }

  if (dateFormat.includes('MMM')) {
    formattedDate.push(
      upperCaseFirstLetter({
        text: formatDateString({
          date,
          dateFormat: 'MMM',
        }),
      }),
    )
  }

  if (dateFormat.includes('yyyy')) {
    formattedDate.push(
      formatDateString({
        date,
        dateFormat: 'yyyy',
      }),
    )
  }

  return formattedDate.join(' ')
}

export function formatDateStringToBrTZ({
  date,
  dateFormat = 'dd/MM/yyyy',
}: {
  date: string
  dateFormat?: string
}): string {
  const timeZone = 'America/Sao_Paulo'

  const isIsoWithoutTZ = /^\d{4}-\d{2}-\d{2}(?!T)/.test(date)

  const formattedDate = isIsoWithoutTZ
    ? new Date(`${date}T00:00:00-03:00`)
    : new Date(date)

  const zonedDate = toZonedTime(formattedDate, timeZone)
  return format(zonedDate, dateFormat, { locale: ptBR, timeZone })
}
