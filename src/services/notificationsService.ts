import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'petfamily-cuidados';

export type NotificationRoute = '/agenda' | '/appointment';

export interface NotificationPayload {
  title: string;
  body: string;
  route: NotificationRoute;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Cuidados e consultas',
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: '#6F3CC3',
      });
    }

    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;

    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch {
    return false;
  }
}

const buildContent = ({ title, body, route }: NotificationPayload): Notifications.NotificationContentInput => ({
  title,
  body,
  data: { route },
  sound: true,
});

export async function notifyNow(payload: NotificationPayload): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: buildContent(payload),
      trigger: Platform.OS === 'android' ? { channelId: CHANNEL_ID, seconds: 1 } : null,
    });
  } catch {
    // notificacao e um reforco: falhar nao pode interromper o fluxo do app
  }
}

// O identificador torna o agendamento idempotente: reagendar o mesmo id substitui o anterior.
export async function scheduleNotificationAt(
  id: string,
  date: Date,
  payload: NotificationPayload
): Promise<void> {
  if (date.getTime() <= Date.now()) return;
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: buildContent(payload),
      trigger: { channelId: CHANNEL_ID, date },
    });
  } catch {
    // ver comentario em notifyNow
  }
}

export async function cancelNotification(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // id inexistente: nada a cancelar
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignorado
  }
}

export function routeFromResponse(response: Notifications.NotificationResponse | null): NotificationRoute | null {
  const route = response?.notification.request.content.data?.route;
  return route === '/agenda' || route === '/appointment' ? route : null;
}

export const onNotificationResponse = (listener: (route: NotificationRoute) => void) => {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const route = routeFromResponse(response);
    if (route) listener(route);
  });
  return () => subscription.remove();
};

export async function getInitialNotificationRoute(): Promise<NotificationRoute | null> {
  try {
    return routeFromResponse(await Notifications.getLastNotificationResponseAsync());
  } catch {
    return null;
  }
}
