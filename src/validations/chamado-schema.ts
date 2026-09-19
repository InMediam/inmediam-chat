import { z } from 'zod'

export function getChamadoSchema({
  requireDestinatario,
}: {
  requireDestinatario: boolean
}) {
  return z.object({
    categoria_id: z.string().min(1, 'Selecione a categoria'),
    assunto_id: z.string().min(1, 'Selecione o assunto'),
    locacao_id: z.string().min(1, 'Selecione o imóvel'),
    destinatario: requireDestinatario
      ? z.string().min(1, 'Selecione o destinatário')
      : z.string(),
    descricao: z
      .string()
      .min(1, 'Descreva o que aconteceu')
      .max(2500, 'Máximo de 2500 caracteres'),
  })
}

export type ChamadoSchema = z.infer<ReturnType<typeof getChamadoSchema>>
