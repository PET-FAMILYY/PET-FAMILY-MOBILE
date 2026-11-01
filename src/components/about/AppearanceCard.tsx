import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AboutCard } from './AboutCard';
import type { ThemeColors } from '../../constants/colors';
import { ThemeMode, useTheme } from '../../providers/ThemeProvider';

const OPTIONS: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { mode: 'system', label: 'Sistema', icon: 'phone-portrait-outline' },
  { mode: 'light', label: 'Claro', icon: 'sunny-outline' },
  { mode: 'dark', label: 'Escuro', icon: 'moon-outline' },
];

export function AppearanceCard() {
  const { colors, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <AboutCard icon="color-palette-outline" title="Aparência">
      <View style={styles.options}>
        {OPTIONS.map((option) => {
          const active = option.mode === mode;
          return (
            <TouchableOpacity
              key={option.mode}
              style={[styles.option, active && styles.optionActive]}
              onPress={() => setMode(option.mode)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Ionicons name={option.icon} size={18} color={active ? colors.white : colors.textSecondary} />
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </AboutCard>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  options: { flexDirection: 'row', gap: 8 },
  option: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  optionTextActive: { color: colors.white },
});
