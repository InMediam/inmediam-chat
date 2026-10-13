import {
  Button,
  Card,
  CardContent,
  Checkbox,
  InputItemsWrapper,
  Label,
  Separator,
} from '@inmediam/ui'
import { useState } from 'react'

import { useChatAdapter } from '../../adapter/use-chat-adapter'
import { LoadingSpin } from '../../components/loading-spin'
import { CHAMADO_STATUS } from '../../entities/status'
import { useChamadoSelecionado } from '../../hooks/use-chamado-selecionado'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { useUpdateChamadoStatus } from '../../hooks/use-update-chamado-status'
import { getChamadoSolicitante } from '../../utils/chat-utils'
import { formatDateStringToBrTZ } from '../../utils/formatter/date-formatter'

export function ChamadoFinalizarContent() {
  const { closeDialog } = useChamadosChat()
  const { detalhe: chamado } = useChamadoSelecionado()
  const { currentUser } = useChatAdapter()
  const [checkedTerms, setCheckedTerms] = useState(false)
  const solicitante = chamado
    ? getChamadoSolicitante(chamado, currentUser)
    : null

  const { mutate: finalizarChamado, isPending } = useUpdateChamadoStatus({
    successMessage: 'Chamado finalizado com sucesso.',
    onUpdated: closeDialog,
  })

  function handleConfirm() {
    if (!chamado) return
    finalizarChamado({ chamadoId: chamado.id, status: CHAMADO_STATUS.FECHADO })
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex w-full flex-col gap-4">
        <Card className="h-full w-full overflow-hidden">
          <CardContent className="grid grid-cols-2 gap-x-4 px-4 py-2 md:flex md:h-full md:flex-row md:gap-x-0 md:py-0">
            <div className="flex w-full justify-start">
              <div className="flex flex-col gap-1 py-3 md:py-5">
                <h3 className="whitespace-nowrap text-xs font-medium leading-[18px] text-quaternary">
                  Protocolo
                </h3>
                <p className="text-sm/5 font-medium">
                  {chamado?.protocolo ?? '-'}
                </p>
              </div>
            </div>
            <Separator
              className="mx-4 hidden h-full md:block"
              orientation="vertical"
            />
            <div className="flex w-full justify-start">
              <div className="flex min-w-0 flex-col gap-1 py-3 md:py-5">
                <h3 className="whitespace-nowrap text-xs font-medium leading-[18px] text-quaternary">
                  Solicitado por
                </h3>
                <p className="break-words text-sm/5 font-medium">
                  {solicitante?.nome ?? '-'}
                </p>
              </div>
            </div>
            <Separator
              className="mx-4 hidden h-full md:block"
              orientation="vertical"
            />
            <div className="flex w-full justify-start">
              <div className="flex min-w-0 flex-col gap-1 py-3 md:py-5">
                <h3 className="whitespace-nowrap text-xs font-medium leading-[18px] text-quaternary">
                  Tipo
                </h3>
                <p className="break-words text-sm/5 font-medium">
                  {chamado?.subtitulo || '-'}
                </p>
              </div>
            </div>
            <Separator
              className="mx-4 hidden h-full md:block"
              orientation="vertical"
            />
            <div className="flex w-full justify-start">
              <div className="flex w-full flex-col gap-1 py-3 md:py-5">
                <h3 className="whitespace-nowrap text-xs font-medium leading-[18px] text-quaternary">
                  Abertura
                </h3>
                <p className="text-sm/5 font-medium">
                  {chamado?.created_at
                    ? formatDateStringToBrTZ({ date: chamado.created_at })
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <InputItemsWrapper className="flex-row">
          <div className="pt-[0.025rem]">
            <Checkbox
              id="finalizar-chamado-confirm"
              className="text-sm/5 font-semibold text-tertiary"
              onCheckedChange={(checked) => setCheckedTerms(!!checked)}
              checked={checkedTerms}
            />
          </div>
          <Label
            htmlFor="finalizar-chamado-confirm"
            className="cursor-pointer text-sm/5 font-medium text-secondary"
          >
            Declaro estar ciente de que este chamado será finalizado
            permanentemente.
          </Label>
        </InputItemsWrapper>
      </div>

      <Separator className="w-full bg-quaternary" orientation="horizontal" />

      <div className="flex w-full flex-col-reverse gap-3 md:flex-row">
        <Button
          className="w-full"
          variant="outline"
          type="button"
          onClick={closeDialog}
        >
          Fechar
        </Button>
        <Button
          className="w-full"
          type="button"
          disabled={!checkedTerms || isPending}
          data-loading-disabled={isPending}
          onClick={handleConfirm}
        >
          <LoadingSpin data-pending={isPending} />
          Finalizar chamado
        </Button>
      </div>
    </div>
  )
}
