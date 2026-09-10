import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export const LoadingState: React.FC<{ label?: string }> = ({ label = 'Carregando...' }) => (
  <View style={styles.wrap}>
    <ActivityIndicator size="large" color={Colors.primary} />
    <Text style={styles.label}>{label}</Text>
  </View>
);

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Não foi possível carregar os dados.',
  onRetry,
}) => (
  <View style={styles.wrap}>
    <Ionicons name="cloud-offline-outline" size={40} color={Colors.errorRed} />
    <Text style={styles.errorText}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
        <Ionicons name="refresh" size={16} color={Colors.white} />
        <Text style={styles.retryText}>Tentar novamente</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const EmptyState: React.FC<{
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}> = ({ icon = 'file-tray-outline', title, subtitle }) => (
  <View style={styles.wrap}>
    <Ionicons name={icon} size={40} color={Colors.textLight} />
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  label: { marginTop: 12, fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  errorText: { marginTop: 12, fontSize: 14, color: Colors.errorRed, textAlign: 'center', fontWeight: '600' },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 16,
  },
  retryText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  emptyTitle: { marginTop: 12, fontSize: 15, fontWeight: '700', color: Colors.textSecondary, textAlign: 'center' },
  emptySub: { marginTop: 4, fontSize: 13, color: Colors.textLight, textAlign: 'center' },
});
