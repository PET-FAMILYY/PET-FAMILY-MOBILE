import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import {
  getInitialNotificationRoute,
  onNotificationResponse,
  setupNotifications,
} from '../services/notificationsService';
import { syncConsultaReminders, syncLembreteReminders } from '../services/reminderNotifications';
import { useConsultasQuery } from './useConsultas';
import { useMeusLembretesQuery } from './useLembretes';

// Pede permissao, cria o canal e leva o usuario a tela certa ao tocar na notificacao.
export const useNotificationSetup = () => {
  const router = useRouter();

  useEffect(() => {
    setupNotifications();

    getInitialNotificationRoute().then((route) => {
      if (route) router.push(route);
    });

    return onNotificationResponse((route) => router.push(route));
  }, [router]);
};

// Mantem os lembretes locais do tutor alinhados com os dados da API: agenda o que esta
// pendente/agendado e cancela o que foi concluido, cancelado ou realizado.
export const useReminderSync = () => {
  const { isVeterinario } = useAuth();
  const lembretesQuery = useMeusLembretesQuery(!isVeterinario);
  const consultasQuery = useConsultasQuery({ size: 20 }, !isVeterinario);

  useEffect(() => {
    if (lembretesQuery.data) syncLembreteReminders(lembretesQuery.data);
  }, [lembretesQuery.data]);

  useEffect(() => {
    if (consultasQuery.data) syncConsultaReminders(consultasQuery.data.content);
  }, [consultasQuery.data]);
};
