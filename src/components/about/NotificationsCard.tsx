import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AboutCard } from './AboutCard';
import type { ThemeColors } from '../../constants/colors';
import { useTheme } from '../../providers/ThemeProvider';
import { useNotificationPermission } from '../../hooks/useNotificationPermission';

export function NotificationsCard() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { permission, enable } = useNotificationPermission();
  const granted = permission === 'granted';

  return (
    <AboutCard icon="notifications-outline" title="Notificações">
      <View style={styles.statusRow}>
        <Ionicons
          name={granted ? 'checkmark-circle' : 'alert-circle'}
          size={20}
          color={granted ? colors.green : colors.errorRed}
        />
        <Text style={styles.statusText}>
          {granted ? 'Ativadas' : 'Desativadas'}
        </Text>
      </View>

      <Text style={styles.description}>
        {granted
          ? 'Você recebe avisos de consultas (24h e 1h antes) e de cuidados preventivos (na véspera e no dia).'
          : 'Ative para ser avisado sobre consultas agendadas e cuidados preventivos dos seus pets.'}
      </Text>

      {!granted && permission !== null && (
        <TouchableOpacity style={styles.button} onPress={enable} activeOpacity={0.85}>
          <Ionicons name="notifications" size={18} color={colors.white} />
          <Text style={styles.buttonText}>
            {permission === 'denied' ? 'Abrir configurações' : 'Ativar notificações'}
          </Text>
        </TouchableOpacity>
      )}
    </AboutCard>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusText: { fontSize: 14, fontWeight: '800', color: colors.text },
  description: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginTop: 8 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 14,
  },
  buttonText: { fontSize: 14, fontWeight: '800', color: colors.white },
});
