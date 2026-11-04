import type { LembreteResponse } from '../types/api';

export interface LembretesAgrupados {
  pendentes: LembreteResponse[];
  concluidos: LembreteResponse[];
  cancelados: LembreteResponse[];
  total: number;
  // Percentual de cuidados concluidos sobre o total (0 a 100).
  progresso: number;
}

export const agruparLembretes = (lembretes: LembreteResponse[]): LembretesAgrupados => {
  const pendentes = lembretes.filter((l) => l.status === 'PENDENTE');
  const concluidos = lembretes.filter((l) => l.status === 'CONCLUIDO');
  const cancelados = lembretes.filter((l) => l.status === 'CANCELADO');
  const total = lembretes.length;
  const progresso = total > 0 ? Math.round((concluidos.length / total) * 100) : 0;

  return { pendentes, concluidos, cancelados, total, progresso };
};
