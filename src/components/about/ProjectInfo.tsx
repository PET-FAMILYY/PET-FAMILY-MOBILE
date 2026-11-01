import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AboutCard, SectionTitle } from './AboutCard';
import type { ThemeColors } from '../../constants/colors';
import { useTheme } from '../../providers/ThemeProvider';
import type { IoniconName } from '../../types/icons';

const TECHS: { name: string; desc: string; icon: IoniconName }[] = [
  { name: 'React Native', desc: 'Framework mobile', icon: 'phone-portrait' },
  { name: 'Expo Router', desc: 'Navegação entre telas', icon: 'map' },
  { name: 'TanStack Query', desc: 'Estado de servidor e cache', icon: 'sync' },
  { name: 'Axios', desc: 'Cliente HTTP para a API Java', icon: 'swap-horizontal' },
  { name: 'Expo SecureStore', desc: 'Sessão persistida com segurança', icon: 'lock-closed' },
  { name: 'Spring Boot', desc: 'API REST (JWT, JPA, Flyway)', icon: 'server' },
  { name: 'Gemini + FastAPI', desc: 'Assistente PetDoc (IA generativa)', icon: 'sparkles' },
  { name: 'Expo Notifications', desc: 'Lembretes locais de cuidados e consultas', icon: 'notifications' },
];

const FEATURES = [
  'Login e cadastro reais, com sessão persistida via SecureStore',
  'CRUD completo de pets integrado à API',
  'CRUD completo de cuidados preventivos (perfil Veterinário)',
  'Agendamento e acompanhamento de consultas',
  'Dashboard clínico com indicadores reais (perfil Veterinário)',
  'Assistente veterinário PetDoc com IA generativa (perfil Tutor)',
  'Notificações locais de cuidados preventivos e consultas (perfil Tutor)',
  'Tema claro e escuro, automático ou escolhido pelo usuário',
];

export function ProjectInfo() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <>
      <AboutCard icon="paw" title="Sobre o projeto">
        <Text style={styles.cardText}>
          O <Text style={styles.bold}>Pet Family</Text> é um MVP criado para
          melhorar a continuidade do cuidado veterinário. O app conecta
          tutor, pet e clínica por meio de lembretes preventivos,
          agendamento de consultas e um assistente de apoio — tudo
          integrado a uma API Spring Boot real.
        </Text>
      </AboutCard>

      <AboutCard icon="sparkles" title="Nossa solução">
        {FEATURES.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={13} color={colors.white} />
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </AboutCard>

      <SectionTitle>Tecnologias utilizadas</SectionTitle>

      <View style={styles.techGrid}>
        {TECHS.map((tech, index) => (
          <View key={index} style={styles.techCard}>
            <View style={styles.techIconBox}>
              <Ionicons name={tech.icon} size={22} color={colors.primary} />
            </View>
            <Text style={styles.techName}>{tech.name}</Text>
            <Text style={styles.techDesc}>{tech.desc}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '900',
    color: colors.primary,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  techCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  techIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  techName: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 4,
  },
  techDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
