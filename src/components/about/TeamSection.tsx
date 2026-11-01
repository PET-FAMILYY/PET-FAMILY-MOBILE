import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SectionTitle } from './AboutCard';
import type { ThemeColors } from '../../constants/colors';
import { useTheme } from '../../providers/ThemeProvider';

const MEMBERS = [
  { name: 'Pedro Vaz', rm: 'RM 566551', role: 'Desenvolvedor Full Stack', initials: 'PV' },
  { name: 'João Victor Luiz Oliveira Resende', rm: 'RM 565139', role: 'Desenvolvedor & UX Designer', initials: 'JV' },
];

export function TeamSection() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <>
      <SectionTitle>Equipe</SectionTitle>

      {MEMBERS.map((member, index) => (
        <View key={index} style={styles.memberCard}>
          <LinearGradient colors={[colors.gradientEnd, colors.primary]} style={styles.memberAvatar}>
            <Text style={styles.memberInitials}>{member.initials}</Text>
          </LinearGradient>

          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
          </View>

          <View style={styles.rmBadge}>
            <Text style={styles.rmText}>{member.rm}</Text>
          </View>
        </View>
      ))}
    </>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  memberCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberAvatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitials: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.white,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },
  memberRole: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
  rmBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rmText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '900',
  },
});
