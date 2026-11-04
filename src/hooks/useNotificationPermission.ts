import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';
import {
  getNotificationPermission,
  setupNotifications,
  type NotificationPermission,
} from '../services/notificationsService';

// Estado da permissao de notificacoes do sistema. Reconsulta ao voltar das configuracoes do aparelho.
export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  const refresh = useCallback(async () => {
    setPermission(await getNotificationPermission());
  }, []);

  useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  // Pede a permissao; se o sistema nao deixar mais perguntar, leva o usuario as configuracoes.
  const enable = useCallback(async () => {
    const granted = await setupNotifications();
    if (granted) {
      setPermission('granted');
      return;
    }
    const current = await getNotificationPermission();
    setPermission(current);
    if (current === 'denied') Linking.openSettings();
  }, []);

  return { permission, enable };
};
