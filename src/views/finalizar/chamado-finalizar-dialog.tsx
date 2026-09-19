import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  InputItemsWrapper,
  Label,
  Separator,
} from '@inmediam/ui'
import { CircleCheck } from 'lucide-react'
import { useState } from 'react'

import { useChatAdapter } from '../../adapter/use-chat-adapter'
import { LoadingSpin } from '../../components/loading-spin'
import { CHAMADO_DIALOG } from '../../contexts/chamados-chat-context'
import { CHAMADO_STATUS } from '../../entities/status'
import { useChamadoSelecionado } from '../../hooks/use-chamado-selecionado'
import { useChamadosChat } from '../../hooks/use-chamados-chat'
import { useUpdateChamadoStatus } from '../../hooks/use-update-chamado-status'
import { getChamadoSolicitante } from '../../utils/chat-utils'
import { formatDateStringToBrTZ } from '../../utils/formatter/date-formatter'

export function ChamadoFinalizarDialog() {
  const { dialog, closeDialog } = useChamadosChat()
  const { detalhe: chamado } = useChamadoSelecionado()
  const { currentUser } = useChatAdapter()
  const [checkedTerms, setCheckedTerms] = useState(false)
  const solicitante = chamado
    ? getChamadoSolicitante(chamado, currentUser)
    : null

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) return
    setCheckedTerms(false)
    closeDialog()
  }

  const { mutate: finalizarChamado, isPending } = useUpdateChamadoStatus({
    successMessage: 'Chamado finalizado com sucesso.',
    onUpdated: () => handleOpenChange(false),
  })

  function handleConfirm() {
    if (!chamado) return
    finalizarChamado({ chamadoId: chamado.id, status: CHAMADO_STATUS.FECHADO })
  }

  return (
    <Dialog
      open={dialog === CHAMADO_DIALOG.FINALIZAR}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-w-2xl" aria-describedby={undefined}>
        {chamado && (
          <div className="flex w-full flex-col gap-5">
            <DialogHeader className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary">
                <CircleCheck className="h-6 w-6 text-fg-brand-primary" />
              </div>
              <div className="flex flex-col gap-2">
                <DialogTitle className="mx-0 px-0">
                  Tem certeza que deseja finalizar este chamado?
                </DialogTitle>
                <DialogDescription className="py-0 text-sm/5 font-normal text-quaternary">
                  Após a finalização, o chamado será encerrado e não receberá
                  mais mensagens. Essa ação não pode ser desfeita.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="flex w-full flex-col gap-4">
              <Card className="h-full w-full overflow-hidden">
                <CardContent className="flex h-full flex-row px-4 py-0">
                  <div className="flex w-full justify-start">
                    <div className="flex flex-col gap-1 py-5">
                      <h3 className="whitespace-nowrap text-xs font-medium leading-[18px] text-quaternary">
                        Protocolo
                      </h3>
                      <p className="text-sm/5 font-medium">
                        {chamado.protocolo}
                      </p>
                    </div>
                  </div>
                  <Separator className="mx-4 h-full" orientation="vertical" />
                  <div className="flex w-full justify-start">
                    <div className="flex flex-col gap-1 py-5">
                      <h3 className="whitespace-nowrap text-xs font-medium leading-[18px] text-quaternary">
                        Solicitado por
                      </h3>
                      <p className="text-sm/5 font-medium">
                        {solicitante?.nome ?? '-'}
                      </p>
                    </div>
                  </div>
                  <Separator className="mx-4 h-full" orientation="vertical" />
                  <div className="flex w-full justify-start">
                    <div className="flex flex-col gap-1 py-5">
                      <h3 className="whitespace-nowrap text-xs font-medium leading-[18px] text-quaternary">
                        Tipo
                      </h3>
                      <p className="text-sm/5 font-medium">
                        {chamado.subtitulo || '-'}
                      </p>
                    </div>
                  </div>
                  <Separator className="mx-4 h-full" orientation="vertical" />
                  <div className="flex w-full justify-start">
                    <div className="flex w-full flex-col gap-1 py-5">
                      <h3 className="whitespace-nowrap text-xs font-medium leading-[18px] text-quaternary">
                        Abertura
                      </h3>
                      <p className="text-sm/5 font-medium">
                        {chamado.created_at
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

            <Separator
              className="w-full bg-quaternary"
              orientation="horizontal"
            />

            <DialogFooter className="mx-auto flex w-full gap-1 sm:justify-between lg:justify-between">
              <DialogClose asChild>
                <Button className="w-full" variant="outline" type="button">
                  Fechar
                </Button>
              </DialogClose>
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
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
