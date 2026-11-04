import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AboutCard } from './AboutCard';
import type { ThemeColors } from '../../constants/colors';
import { useTheme } from '../../providers/ThemeProvider';
import { getAppInfo } from '../../utils/appInfo';

const formatBuildDate = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString('pt-BR');
};

export function AppInfoCard() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const info = getAppInfo();

  return (
    <AboutCard icon="information-circle-outline" title="Sobre o App">
      <View style={styles.row}>
        <Text style={styles.label}>Versão</Text>
        <Text style={styles.value}>{info.version}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Commit</Text>
        <Text style={styles.valueMono} selectable>
          {info.commitShort}
          {info.commitDirty ? ' (alterações locais)' : ''}
        </Text>
      </View>
      {info.buildDate && (
        <View style={styles.row}>
          <Text style={styles.label}>Build</Text>
          <Text style={styles.value}>{formatBuildDate(info.buildDate)}</Text>
        </View>
      )}
      <Text style={styles.hashLabel}>Hash completo do commit (segure para copiar)</Text>
      <Text style={styles.hash} selectable>{info.commitHash}</Text>
    </AboutCard>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  value: { fontSize: 13, color: colors.text, fontWeight: '700' },
  valueMono: { fontSize: 13, color: colors.primary, fontWeight: '800', fontFamily: 'monospace' },
  hashLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600', marginTop: 12 },
  hash: { fontSize: 11, color: colors.text, fontFamily: 'monospace', marginTop: 4 },
});
