import { brDateToIso, isFutureDateTime, isValidEmail, isValidTime } from './validators';

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export const validateLogin = (email: string, password: string): FieldErrors<'email' | 'password'> => {
  const errors: FieldErrors<'email' | 'password'> = {};
  if (!email.trim()) errors.email = 'E-mail obrigatório';
  else if (!isValidEmail(email)) errors.email = 'E-mail inválido';
  if (!password) errors.password = 'Senha obrigatória';
  return errors;
};

interface RegistroFields {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export const validateRegistro = ({
  name,
  email,
  password,
  confirm,
}: RegistroFields): FieldErrors<keyof RegistroFields> => {
  const errors: FieldErrors<keyof RegistroFields> = {};
  if (!name.trim()) errors.name = 'Nome obrigatório';
  if (!email.trim()) errors.email = 'E-mail obrigatório';
  else if (!isValidEmail(email)) errors.email = 'E-mail inválido';
  if (!password) errors.password = 'Senha obrigatória';
  else if (password.length < 6) errors.password = 'Mínimo de 6 caracteres';
  if (!confirm) errors.confirm = 'Confirmação obrigatória';
  else if (confirm !== password) errors.confirm = 'As senhas não coincidem';
  return errors;
};

interface AgendamentoFields {
  petId: number | null;
  data: string;
  horario: string;
}

export const validateAgendamento = ({
  petId,
  data,
  horario,
}: AgendamentoFields): FieldErrors<keyof AgendamentoFields> => {
  const errors: FieldErrors<keyof AgendamentoFields> = {};
  if (!petId) errors.petId = 'Selecione um pet.';
  if (!data.trim() || !brDateToIso(data)) errors.data = 'Data inválida (DD/MM/AAAA).';
  if (!horario.trim() || !isValidTime(horario)) errors.horario = 'Horário inválido (HH:MM).';
  if (!errors.data && !errors.horario && !isFutureDateTime(data, horario)) {
    errors.data = 'Data/horário precisa ser futuro.';
  }
  return errors;
};
