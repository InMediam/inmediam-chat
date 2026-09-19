import { SectionDivider } from '../../../components/section-divider'
import type { Chamado } from '../../../entities/interface'
import { cepMask } from '../../../utils/masks/masks'
import { ChamadosDetailsInfoRow } from './chamados-details-info-row'

interface ChamadosDetailsImovelTabProps {
  chamado: Chamado
}

export function ChamadosDetailsImovelTab({
  chamado,
}: ChamadosDetailsImovelTabProps) {
  const imovel = chamado.imovel

  return (
    <>
      {!imovel && (
        <div className="flex h-32 items-center justify-center text-sm text-quaternary">
          Sem dados de imóvel vinculados a este chamado.
        </div>
      )}

      {imovel && (
        <div className="flex flex-col">
          <ChamadosDetailsInfoRow label="ID" value={imovel.id} />
          <ChamadosDetailsInfoRow
            label="Finalidade"
            value={imovel.tipo_imovel.tipo_grupo.nome}
          />
          <ChamadosDetailsInfoRow
            label="Tipo"
            value={imovel.tipo_imovel.nome}
          />

          <SectionDivider className="my-3">Endereço</SectionDivider>

          <ChamadosDetailsInfoRow
            label="CEP"
            value={cepMask({ cep: imovel.cep ?? '' })}
          />
          <ChamadosDetailsInfoRow label="Endereço" value={imovel.endereco} />
          <ChamadosDetailsInfoRow label="Número" value={imovel.numero} />
          <ChamadosDetailsInfoRow label="Bairro" value={imovel.bairro} />
          <ChamadosDetailsInfoRow label="Cidade" value={imovel.cidade} />
          <ChamadosDetailsInfoRow label="Estado" value={imovel.uf} />
          <ChamadosDetailsInfoRow
            label="Complemento"
            value={imovel.complemento}
          />
        </div>
      )}
    </>
  )
}
