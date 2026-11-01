import type { ConsultaResponse, LembreteResponse } from '../types/api';
import { isoDateToBR, apiTimeToDisplay } from '../utils/validators';
import {
  cancelNotification,
  notifyNow,
  scheduleNotificationAt,
} from './notificationsService';

const HOUR_MS = 60 * 60 * 1000;

const lembreteIds = (id: number) => [`lembrete-${id}-vespera`, `lembrete-${id}-dia`];
const consultaIds = (id: number) => [`consulta-${id}-24h`, `consulta-${id}-1h`];

const parseIsoDate = (iso: string, hour: number, minute: number): Date => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
};

const consultaDate = (consulta: ConsultaResponse): Date => {
  const [hour, minute] = consulta.horario.split(':').map(Number);
  return parseIsoDate(consulta.data, hour, minute);
};

export async function cancelLembreteReminders(id: number): Promise<void> {
  await Promise.all(lembreteIds(id).map(cancelNotification));
}

export async function cancelConsultaReminders(id: number): Promise<void> {
  await Promise.all(consultaIds(id).map(cancelNotification));
}

// Cuidado preventivo pendente: avisa na vespera (18h) e no proprio dia (9h).
export async function scheduleLembreteReminders(lembrete: LembreteResponse): Promise<void> {
  const [vesperaId, diaId] = lembreteIds(lembrete.id);
  const dataBR = isoDateToBR(lembrete.dataLembrete);
  const dia = parseIsoDate(lembrete.dataLembrete, 9, 0);
  const vespera = parseIsoDate(lembrete.dataLembrete, 18, 0);
  vespera.setDate(vespera.getDate() - 1);

  await scheduleNotificationAt(vesperaId, vespera, {
    title: `Amanhã: ${lembrete.titulo}`,
    body: `${lembrete.petNome} tem um cuidado preventivo (${lembrete.tipo}) marcado para ${dataBR}.`,
    route: '/agenda',
  });
  await scheduleNotificationAt(diaId, dia, {
    title: `Hoje: ${lembrete.titulo}`,
    body: `Não esqueça do cuidado de ${lembrete.petNome} (${lembrete.tipo}). Abra o app para marcar como feito.`,
    route: '/agenda',
  });
}

// Consulta agendada: lembra 24h e 1h antes.
export async function scheduleConsultaReminders(consulta: ConsultaResponse): Promise<void> {
  const [id24h, id1h] = consultaIds(consulta.id);
  const quando = consultaDate(consulta);
  const resumo = `${consulta.petNome} — ${consulta.tipoConsulta} às ${apiTimeToDisplay(consulta.horario)} (${isoDateToBR(consulta.data)})`;

  await scheduleNotificationAt(id24h, new Date(quando.getTime() - 24 * HOUR_MS), {
    title: 'Consulta amanhã',
    body: resumo,
    route: '/appointment',
  });
  await scheduleNotificationAt(id1h, new Date(quando.getTime() - HOUR_MS), {
    title: 'Consulta daqui a 1 hora',
    body: resumo,
    route: '/appointment',
  });
}

export async function announceConsultaAgendada(consulta: ConsultaResponse): Promise<void> {
  await notifyNow({
    title: 'Consulta agendada',
    body: `${consulta.petNome} — ${consulta.tipoConsulta} em ${isoDateToBR(consulta.data)} às ${apiTimeToDisplay(consulta.horario)}. Vamos te lembrar antes.`,
    route: '/appointment',
  });
}

export async function syncLembreteReminders(lembretes: LembreteResponse[]): Promise<void> {
  await Promise.all(
    lembretes.map((lembrete) =>
      lembrete.status === 'PENDENTE'
        ? scheduleLembreteReminders(lembrete)
        : cancelLembreteReminders(lembrete.id)
    )
  );
}

export async function syncConsultaReminders(consultas: ConsultaResponse[]): Promise<void> {
  await Promise.all(
    consultas.map((consulta) =>
      consulta.status === 'AGENDADA'
        ? scheduleConsultaReminders(consulta)
        : cancelConsultaReminders(consulta.id)
    )
  );
}
