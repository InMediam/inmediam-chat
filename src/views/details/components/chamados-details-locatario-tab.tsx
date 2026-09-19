import { Avatar, AvatarFallback, AvatarImage } from '@inmediam/ui'

import type { Chamado } from '../../../entities/interface'
import { formatDateStringToBrTZ } from '../../../utils/formatter/date-formatter'
import { getInitialsName } from '../../../utils/get-initials-name'
import {
  documentMaskByLength,
  phoneMask,
  telMask,
} from '../../../utils/masks/masks'
import { ChamadosDetailsInfoRow } from './chamados-details-info-row'

interface ChamadosDetailsLocatarioTabProps {
  chamado: Chamado
}

export function ChamadosDetailsLocatarioTab({
  chamado,
}: ChamadosDetailsLocatarioTabProps) {
  const locatario = chamado.locatario
  const documento = documentMaskByLength({ document: locatario?.documento })

  return (
    <>
      {!locatario && (
        <div className="flex h-32 items-center justify-center text-sm text-quaternary">
          Sem dados de locatário vinculados a este chamado.
        </div>
      )}

      {locatario && (
        <div className="flex flex-col">
          <ChamadosDetailsInfoRow label="ID" value={locatario.id} />
          <ChamadosDetailsInfoRow
            label="Nome"
            value={
              locatario.nome ? (
                <div className="flex items-center justify-end gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={locatario.avatar ?? undefined} />
                    <AvatarFallback className="bg-quaternary text-[10px] font-semibold text-secondary">
                      {getInitialsName({ name: locatario.nome })}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{locatario.nome}</span>
                </div>
              ) : null
            }
          />
          <ChamadosDetailsInfoRow
            label="Nome social"
            value={locatario.nome_social}
          />
          <ChamadosDetailsInfoRow
            label="Nascimento"
            value={
              locatario.data_nascimento
                ? formatDateStringToBrTZ({ date: locatario.data_nascimento })
                : null
            }
          />
          <ChamadosDetailsInfoRow label="CPF" value={documento} />
          <ChamadosDetailsInfoRow label="E-mail" value={locatario.email} />
          <ChamadosDetailsInfoRow
            label="Telefone"
            value={telMask({ tel: locatario.telefone ?? '' })}
          />
          <ChamadosDetailsInfoRow
            label="Celular"
            value={phoneMask({ phone: locatario.celular ?? '' })}
          />
        </div>
      )}
    </>
  )
}
