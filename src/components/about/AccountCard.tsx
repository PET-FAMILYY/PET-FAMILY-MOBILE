import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../providers/AuthProvider';
import { AboutCard } from './AboutCard';
import type { ThemeColors } from '../../constants/colors';
import { useTheme } from '../../providers/ThemeProvider';

export function AccountCard() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <AboutCard icon="person-circle-outline" title="Minha conta">
      <View style={styles.accountRow}>
        <Text style={styles.accountLabel}>Nome</Text>
        <Text style={styles.accountValue}>{user?.nome}</Text>
      </View>
      <View style={styles.accountRow}>
        <Text style={styles.accountLabel}>E-mail</Text>
        <Text style={styles.accountValue}>{user?.email}</Text>
      </View>
      <View style={styles.accountRow}>
        <Text style={styles.accountLabel}>Perfil</Text>
        <View style={styles.rolePill}>
          <Text style={styles.rolePillText}>{user?.role === 'VETERINARIO' ? 'Veterinário' : 'Tutor'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={18} color={colors.errorRed} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </AboutCard>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  accountLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  accountValue: { fontSize: 13, color: colors.text, fontWeight: '700', maxWidth: '65%', textAlign: 'right' },
  rolePill: { backgroundColor: colors.primaryLight, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  rolePillText: { fontSize: 12, color: colors.primary, fontWeight: '800' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.errorLight,
  },
  logoutText: { fontSize: 14, fontWeight: '800', color: colors.errorRed },
});
