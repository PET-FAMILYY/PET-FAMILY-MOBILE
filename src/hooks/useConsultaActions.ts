import { confirmAction, showErrorAlert, showSuccessAlert } from '../utils/dialogs';
import { useCancelarConsultaMutation, useRealizarConsultaMutation } from './useConsultas';

// Acoes sobre uma consulta ja agendada: cancelar (Tutor e Veterinario) e registrar realizacao (Veterinario).
export const useConsultaActions = () => {
  const cancelarMutation = useCancelarConsultaMutation();
  const realizarMutation = useRealizarConsultaMutation();

  const busy = cancelarMutation.isPending || realizarMutation.isPending;

  const cancelar = (id: number) =>
    confirmAction({
      title: 'Cancelar consulta',
      message: 'Deseja realmente cancelar esta consulta?',
      confirmLabel: 'Cancelar consulta',
      cancelLabel: 'Voltar',
      destructive: true,
      onConfirm: () =>
        cancelarMutation.mutate(id, {
          onError: (err) => showErrorAlert(err, 'Não foi possível cancelar.'),
        }),
    });

  const realizar = (id: number, observacoes: string) =>
    realizarMutation.mutate(
      { id, data: { observacoes } },
      {
        onSuccess: () => showSuccessAlert('Consulta realizada', 'Registro salvo com sucesso.'),
        onError: (err) => showErrorAlert(err, 'Não foi possível concluir a consulta.'),
      }
    );

  return { busy, cancelar, realizar };
};
