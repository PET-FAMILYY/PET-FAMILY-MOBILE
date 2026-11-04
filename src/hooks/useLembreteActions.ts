import type { LembreteResponse } from '../types/api';
import { confirmAction, showErrorAlert } from '../utils/dialogs';
import {
  useCancelarLembreteMutation,
  useConcluirLembreteMutation,
  useDeleteLembreteMutation,
} from './useLembretes';

// Acoes de negocio sobre um lembrete, cada uma com confirmacao e tratamento de erro.
export const useLembreteActions = () => {
  const concluirMutation = useConcluirLembreteMutation();
  const cancelarMutation = useCancelarLembreteMutation();
  const deleteMutation = useDeleteLembreteMutation();

  const busy = concluirMutation.isPending || cancelarMutation.isPending || deleteMutation.isPending;

  const concluir = (lembrete: LembreteResponse) =>
    confirmAction({
      title: 'Concluir cuidado',
      message: `Confirmar que "${lembrete.titulo}" foi realizado?`,
      confirmLabel: 'Confirmar',
      onConfirm: () =>
        concluirMutation.mutate(lembrete.id, {
          onError: (err) => showErrorAlert(err, 'Não foi possível concluir.'),
        }),
    });

  const cancelar = (lembrete: LembreteResponse) =>
    confirmAction({
      title: 'Cancelar cuidado',
      message: `Cancelar "${lembrete.titulo}"?`,
      confirmLabel: 'Cancelar cuidado',
      cancelLabel: 'Voltar',
      destructive: true,
      onConfirm: () =>
        cancelarMutation.mutate(lembrete.id, {
          onError: (err) => showErrorAlert(err, 'Não foi possível cancelar.'),
        }),
    });

  const remover = (lembrete: LembreteResponse) =>
    confirmAction({
      title: 'Remover cuidado',
      message: `Remover "${lembrete.titulo}" definitivamente?`,
      confirmLabel: 'Remover',
      destructive: true,
      onConfirm: () =>
        deleteMutation.mutate(lembrete.id, {
          onError: (err) => showErrorAlert(err, 'Não foi possível remover.'),
        }),
    });

  return { busy, concluir, cancelar, remover };
};
