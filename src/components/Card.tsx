import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import type { ThemeColors } from '../constants/colors';
import { useTheme } from '../providers/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'purple' | 'light';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'default' }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  default: {
    backgroundColor: colors.surface,
  },
  purple: {
    backgroundColor: colors.primary,
  },
  light: {
    backgroundColor: colors.primaryLight,
  },
});
