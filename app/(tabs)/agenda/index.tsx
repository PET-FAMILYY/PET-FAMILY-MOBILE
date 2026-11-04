import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientHeader } from '../../../src/components/GradientHeader';
import { Ionicons } from '@expo/vector-icons';
import { LembreteCard } from '../../../src/components/LembreteCard';
import { LoadingState, ErrorState, EmptyState } from '../../../src/components/StateViews';
import { ThemedRefreshControl } from '../../../src/components/ThemedRefreshControl';
import { useAuth } from '../../../src/providers/AuthProvider';
import { useAgendaLembretes } from '../../../src/hooks/useAgendaLembretes';
import { useLembreteActions } from '../../../src/hooks/useLembreteActions';
import type { ThemeColors } from '../../../src/constants/colors';
import { useTheme } from '../../../src/providers/ThemeProvider';
import type { LembreteResponse } from '../../../src/types/api';

export default function AgendaScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { isVeterinario } = useAuth();

  const { pendentes, concluidos, cancelados, total, progresso, isLoading, isError, isRefetching, refetch } =
    useAgendaLembretes();
  const { busy, concluir, cancelar, remover } = useLembreteActions();

  const renderCard = (item: LembreteResponse) => (
    <LembreteCard
      key={item.id}
      lembrete={item}
      showPetName={isVeterinario}
      busy={busy}
      onConcluir={!isVeterinario ? () => concluir(item) : undefined}
      onCancelar={isVeterinario ? () => cancelar(item) : undefined}
      onEdit={isVeterinario ? () => router.push(`/agenda/${item.id}`) : undefined}
      onDelete={isVeterinario ? () => remover(item) : undefined}
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<ThemedRefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <GradientHeader style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>SAÚDE DO PET</Text>
              <Text style={styles.headerTitle}>Lembretes</Text>
              <Text style={styles.headerSub}>
                {isVeterinario ? 'Cuidados preventivos de todos os pets' : 'Vacinas, consultas e cuidados'}
              </Text>
            </View>
            {isVeterinario && (
              <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/agenda/new')} activeOpacity={0.85}>
                <Ionicons name="add" size={24} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>

          {total > 0 && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{pendentes.length}</Text>
                <Text style={styles.statLabel}>Pendentes</Text>
              </View>
              <View style={styles.statSep} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{concluidos.length}</Text>
                <Text style={styles.statLabel}>Concluídos</Text>
              </View>
              <View style={styles.statSep} />
              <View style={styles.statItem}>
                <Text style={[styles.statNum, styles.statNumAccent]}>{progresso}%</Text>
                <Text style={[styles.statLabel, styles.statLabelAccent]}>Progresso</Text>
              </View>
            </View>
          )}
        </GradientHeader>

        <View style={styles.sheet}>
          {!isVeterinario && (
            <View style={styles.infoBanner}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.infoBannerText}>
                Novos cuidados são criados pelo veterinário responsável. Você pode marcá-los como concluídos aqui.
              </Text>
            </View>
          )}

          {isLoading ? (
            <LoadingState label="Carregando lembretes..." />
          ) : isError ? (
            <ErrorState message="Não foi possível carregar os lembretes." onRetry={refetch} />
          ) : total === 0 ? (
            <EmptyState
              icon="notifications-outline"
              title="Nenhum lembrete por aqui"
              subtitle={isVeterinario ? 'Toque em + para criar um cuidado preventivo.' : 'Seu veterinário ainda não criou cuidados para seus pets.'}
            />
          ) : (
            <>
              {pendentes.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.sectionTitle}>Pendentes</Text>
                  </View>
                  {pendentes.map(renderCard)}
                </View>
              )}
              {concluidos.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionDot, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.sectionTitle}>Concluídos</Text>
                  </View>
                  {concluidos.map(renderCard)}
                </View>
              )}
              {cancelados.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionDot, { backgroundColor: '#9CA3AF' }]} />
                    <Text style={styles.sectionTitle}>Cancelados</Text>
                  </View>
                  {cancelados.map(renderCard)}
                </View>
              )}
            </>
          )}
          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#3B0F8C' },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 0 },

  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 48 },
  headerTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  eyebrow: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 2.5, marginBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 4, fontWeight: '400', marginBottom: 24 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 14 },
  statItem: { flex: 1, alignItems: 'center' },
  statSep: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center' },
  statNum: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontWeight: '500' },
  statNumAccent: { color: '#C4B5FD' },
  statLabelAccent: { color: 'rgba(196,181,253,0.7)' },

  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
    minHeight: 300,
  },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  infoBannerText: { flex: 1, fontSize: 12, color: colors.primaryDark, lineHeight: 17 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1.2, textTransform: 'uppercase' },

  bottomPad: { height: 40 },
});
