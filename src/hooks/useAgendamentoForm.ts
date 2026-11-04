import { useState } from 'react';
import { brDateToIso, timeToApiFormat } from '../utils/validators';
import { validateAgendamento } from '../utils/formValidation';
import { showErrorAlert } from '../utils/dialogs';
import { useAgendarConsultaMutation } from './useConsultas';

export interface AgendamentoValues {
  tipo: string;
  data: string;
  horario: string;
  observacoes: string;
}

type AgendamentoErrors = Partial<Record<'petId' | 'data' | 'horario', string>>;

// Estado, validacao e envio do formulario de agendamento de consulta (perfil Tutor).
export const useAgendamentoForm = () => {
  const agendarMutation = useAgendarConsultaMutation();
  const [petId, setPetId] = useState<number | null>(null);
  const [values, setValues] = useState<AgendamentoValues>({
    tipo: 'Preventiva',
    data: '',
    horario: '',
    observacoes: '',
  });
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<AgendamentoErrors>({});

  // Qualquer alteracao invalida a confirmacao anterior.
  const setField = (field: keyof AgendamentoValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setConfirmed(false);
  };

  const selectPet = (id: number) => {
    setPetId(id);
    setConfirmed(false);
  };

  const validate = () => {
    const found = validateAgendamento({ petId, data: values.data, horario: values.horario });
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const submit = () => {
    if (agendarMutation.isPending || !validate()) return;
    agendarMutation.mutate(
      {
        petId: petId as number,
        tipoConsulta: values.tipo,
        data: brDateToIso(values.data)!,
        horario: timeToApiFormat(values.horario),
        observacoes: values.observacoes.trim() || undefined,
      },
      {
        onSuccess: () => setConfirmed(true),
        onError: (err) => showErrorAlert(err, 'Não foi possível agendar.'),
      }
    );
  };

  return {
    petId,
    values,
    errors,
    confirmed,
    isFilled: !!petId && !!values.data && !!values.horario,
    isSubmitting: agendarMutation.isPending,
    setField,
    selectPet,
    submit,
  };
};
