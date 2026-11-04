import { Alert } from 'react-native';
import { ApiError } from '../services/api';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

// Mensagem da API quando houver; caso contrario, o texto padrao da acao que falhou.
export const getErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof ApiError ? err.message : fallback;

export const showErrorAlert = (err: unknown, fallback: string): void => {
  Alert.alert('Erro', getErrorMessage(err, fallback));
};

export const showSuccessAlert = (title: string, message: string, onClose?: () => void): void => {
  Alert.alert(title, message, [{ text: 'OK', onPress: onClose }]);
};

export const confirmAction = ({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
}: ConfirmOptions): void => {
  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
};
