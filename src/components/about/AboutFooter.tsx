import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemeColors } from '../../constants/colors';
import { useTheme } from '../../providers/ThemeProvider';

export function AboutFooter() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.footer}>
      <View style={styles.footerIcon}>
        <Ionicons name="school" size={22} color={colors.primary} />
      </View>
      <Text style={styles.footerTitle}>Projeto acadêmico</Text>
      <Text style={styles.footerText}>
        Desenvolvido para a Sprint 4 de Mobile Application Development.
        O assistente PetDoc usa IA generativa (Gemini), contextualizada
        com os dados do pet selecionado.
      </Text>
      <View style={styles.footerDivider} />
      <Text style={styles.footerVersion}>Pet Family v1.0.0</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  footer: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footerDivider: {
    width: 44,
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  footerVersion: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
