import z from 'zod'

const MIN_SEARCH_LENGTH = 3

export const searchSchema = z.object({
  search: z
    .string()
    .refine(
      (value) =>
        value.trim().length === 0 || value.trim().length >= MIN_SEARCH_LENGTH,
      {
        message: `Digite ao menos ${MIN_SEARCH_LENGTH} caracteres para buscar.`,
      },
    ),
})

export type SearchSchema = z.infer<typeof searchSchema>
