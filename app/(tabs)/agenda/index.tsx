import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LembreteCard } from '../../../src/components/LembreteCard';
import { LoadingState, ErrorState, EmptyState } from '../../../src/components/StateViews';
import { useAuth } from '../../../src/providers/AuthProvider';
import {
  useMeusLembretesQuery,
  useLembretesQuery,
  useConcluirLembreteMutation,
  useCancelarLembreteMutation,
  useDeleteLembreteMutation,
} from '../../../src/hooks/useLembretes';
import { ApiError } from '../../../src/services/api';
import { Colors } from '../../../src/constants/colors';
import type { LembreteResponse } from '../../../src/types/api';

export default function AgendaScreen() {
  const router = useRouter();
  const { isVeterinario } = useAuth();

  const tutorQuery = useMeusLembretesQuery(!isVeterinario);
  const vetQuery = useLembretesQuery({ size: 50 }, isVeterinario);

  const isLoading = isVeterinario ? vetQuery.isLoading : tutorQuery.isLoading;
  const isError = isVeterinario ? vetQuery.isError : tutorQuery.isError;
  const isRefetching = isVeterinario ? vetQuery.isRefetching : tutorQuery.isRefetching;
  const refetch = isVeterinario ? vetQuery.refetch : tutorQuery.refetch;
  const lembretes: LembreteResponse[] = isVeterinario ? (vetQuery.data?.content ?? []) : (tutorQuery.data ?? []);

  const concluirMutation = useConcluirLembreteMutation();
  const cancelarMutation = useCancelarLembreteMutation();
  const deleteMutation = useDeleteLembreteMutation();
  const busy = concluirMutation.isPending || cancelarMutation.isPending || deleteMutation.isPending;

  const handleError = (err: unknown, fallback: string) => {
    const message = err instanceof ApiError ? err.message : fallback;
    Alert.alert('Erro', message);
  };

  const handleConcluir = (lembrete: LembreteResponse) => {
    Alert.alert('Concluir cuidado', `Confirmar que "${lembrete.titulo}" foi realizado?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => concluirMutation.mutate(lembrete.id, { onError: (e) => handleError(e, 'Não foi possível concluir.') }),
      },
    ]);
  };

  const handleCancelar = (lembrete: LembreteResponse) => {
    Alert.alert('Cancelar cuidado', `Cancelar "${lembrete.titulo}"?`, [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar cuidado',
        style: 'destructive',
        onPress: () => cancelarMutation.mutate(lembrete.id, { onError: (e) => handleError(e, 'Não foi possível cancelar.') }),
      },
    ]);
  };

  const handleDelete = (lembrete: LembreteResponse) => {
    Alert.alert('Remover cuidado', `Remover "${lembrete.titulo}" definitivamente?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(lembrete.id, { onError: (e) => handleError(e, 'Não foi possível remover.') }),
      },
    ]);
  };

  const pending = lembretes.filter(r => r.status === 'PENDENTE');
  const done = lembretes.filter(r => r.status === 'CONCLUIDO');
  const cancelled = lembretes.filter(r => r.status === 'CANCELADO');
  const total = lembretes.length;
  const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;

  const renderCard = (item: LembreteResponse) => (
    <LembreteCard
      key={item.id}
      lembrete={item}
      showPetName={isVeterinario}
      busy={busy}
      onConcluir={!isVeterinario ? () => handleConcluir(item) : undefined}
      onCancelar={isVeterinario ? () => handleCancelar(item) : undefined}
      onEdit={isVeterinario ? () => router.push(`/agenda/${item.id}`) : undefined}
      onDelete={isVeterinario ? () => handleDelete(item) : undefined}
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[Colors.primary]} />}
      >
        <LinearGradient colors={['#3B0F8C', '#6D28D9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
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
                <Ionicons name="add" size={24} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>

          {total > 0 && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{pending.length}</Text>
                <Text style={styles.statLabel}>Pendentes</Text>
              </View>
              <View style={styles.statSep} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{done.length}</Text>
                <Text style={styles.statLabel}>Concluídos</Text>
              </View>
              <View style={styles.statSep} />
              <View style={styles.statItem}>
                <Text style={[styles.statNum, styles.statNumAccent]}>{pct}%</Text>
                <Text style={[styles.statLabel, styles.statLabelAccent]}>Progresso</Text>
              </View>
            </View>
          )}
        </LinearGradient>

        <View style={styles.sheet}>
          {!isVeterinario && (
            <View style={styles.infoBanner}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
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
              {pending.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.sectionTitle}>Pendentes</Text>
                  </View>
                  {pending.map(renderCard)}
                </View>
              )}
              {done.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionDot, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.sectionTitle}>Concluídos</Text>
                  </View>
                  {done.map(renderCard)}
                </View>
              )}
              {cancelled.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionDot, { backgroundColor: '#9CA3AF' }]} />
                    <Text style={styles.sectionTitle}>Cancelados</Text>
                  </View>
                  {cancelled.map(renderCard)}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#3B0F8C' },
  scroll: { flex: 1, backgroundColor: '#F7F7F9' },
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
    backgroundColor: '#F7F7F9',
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
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  infoBannerText: { flex: 1, fontSize: 12, color: Colors.primaryDark, lineHeight: 17 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#6B7280', letterSpacing: 1.2, textTransform: 'uppercase' },

  bottomPad: { height: 40 },
});
