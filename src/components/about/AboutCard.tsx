import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemeColors } from '../../constants/colors';
import { useTheme } from '../../providers/ThemeProvider';

interface AboutCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}

export function AboutCard({ icon, title, children }: AboutCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 12,
    marginTop: 4,
  },
});
