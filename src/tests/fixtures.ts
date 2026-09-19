import type { Chamado } from '../entities/interface'

export const mockChamado: Chamado = {
  id: 1,
  protocolo: '202605000001',
  status: 'em andamento',
  titulo: 'Vazamento na pia da cozinha',
  subtitulo: 'Solicitar reparos',
  participante: {
    id: 5,
    nome: 'Marina Costa',
    tipo: 'locatario',
    foto: null,
  },
  imovel: null,
  locatario: null,
  preview: 'Olá, notei um vazamento contínuo na pia.',
  read_state: 'lido',
  locacao_id: null,
  finished_at: null,
  created_at: '2026-04-30T10:00:00.000000Z',
}
