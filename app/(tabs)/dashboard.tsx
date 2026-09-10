import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/providers/AuthProvider';
import { useDashboardQuery } from '../../src/hooks/useDashboard';
import { LoadingState, ErrorState, EmptyState } from '../../src/components/StateViews';
import { Colors } from '../../src/constants/colors';

export default function DashboardScreen() {
  const { isVeterinario } = useAuth();
  const { data, isLoading, isError, refetch, isRefetching } = useDashboardQuery(isVeterinario);

  if (!isVeterinario) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.gradientEnd} />
        <EmptyState
          icon="lock-closed-outline"
          title="Área exclusiva do Veterinário"
          subtitle="O dashboard clínico consome o endpoint GET /dashboard/resumo, restrito ao perfil Veterinário na API. Entre com uma conta de veterinário para visualizar."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradientEnd} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[Colors.primary]} />}
      >
        <LinearGradient
          colors={[Colors.gradientEnd, Colors.gradientStart, Colors.primaryMid]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Dashboard Clínico</Text>
              <Text style={styles.headerSub}>PetFamily Veterinária</Text>
            </View>
            <View style={styles.clinicBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.clinicBadgeText}>Ao vivo</Text>
            </View>
          </View>

          {data && (
            <View style={styles.miniKpiRow}>
              <View style={styles.miniKpi}>
                <Text style={styles.miniKpiVal}>{data.totalPets}</Text>
                <Text style={styles.miniKpiLabel}>Pets</Text>
              </View>
              <View style={styles.miniDivider} />
              <View style={styles.miniKpi}>
                <Text style={styles.miniKpiVal}>{data.totalTutores}</Text>
                <Text style={styles.miniKpiLabel}>Tutores</Text>
              </View>
              <View style={styles.miniDivider} />
              <View style={styles.miniKpi}>
                <Text style={styles.miniKpiVal}>{data.taxaAdesaoPreventiva}%</Text>
                <Text style={styles.miniKpiLabel}>Adesão</Text>
              </View>
            </View>
          )}
        </LinearGradient>

        <View style={styles.sheet}>
          {isLoading ? (
            <LoadingState label="Carregando indicadores..." />
          ) : isError || !data ? (
            <ErrorState message="Não foi possível carregar o dashboard." onRetry={refetch} />
          ) : (
            <>
              <Text style={styles.sectionTitle}>Cuidados preventivos</Text>
              <View style={styles.statCard}>
                <View style={styles.statRow}>
                  <View style={styles.statIconBox}>
                    <Ionicons name="notifications" size={24} color={Colors.orange} />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statName}>Lembretes pendentes</Text>
                    <Text style={styles.statSub}>Vacinas, retornos e check-ups em aberto</Text>
                  </View>
                  <Text style={[styles.statValue, { color: Colors.orange }]}>{data.totalLembretesPendentes}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Consultas</Text>
              <View style={styles.statCard}>
                <View style={styles.statRow}>
                  <View style={styles.statIconBox}>
                    <Ionicons name="medical" size={24} color={Colors.blue} />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statName}>Total de consultas</Text>
                    <Text style={styles.statSub}>Agendadas, realizadas e canceladas</Text>
                  </View>
                  <Text style={[styles.statValue, { color: Colors.blue }]}>{data.totalConsultas}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Adesão preventiva</Text>
              <LinearGradient
                colors={[Colors.greenDark, Colors.green]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.adhesionCard}
              >
                <View style={styles.adhesionRow}>
                  <View style={styles.adhesionAvatar}><Ionicons name="trending-up" size={22} color={Colors.white} /></View>
                  <View style={styles.adhesionInfo}>
                    <Text style={styles.adhesionTitle}>{data.taxaAdesaoPreventiva}% de consultas realizadas</Text>
                    <Text style={styles.adhesionSub}>Proporção de consultas efetivamente concluídas sobre o total agendado.</Text>
                  </View>
                </View>
              </LinearGradient>

              <Text style={styles.sectionTitle}>Assistente</Text>
              <View style={styles.statCard}>
                <View style={styles.statRow}>
                  <View style={styles.statIconBox}>
                    <Ionicons name="chatbubbles" size={22} color={Colors.primary} />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statName}>Interações com tutores</Text>
                    <Text style={styles.statSub}>Perguntas respondidas pelo assistente</Text>
                  </View>
                  <Text style={[styles.statValue, { color: Colors.primary }]}>{data.totalInteracoesIA}</Text>
                </View>
              </View>
            </>
          )}
          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.gradientEnd },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 0 },

  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  clinicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 5,
  },
  activeDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.green },
  clinicBadgeText: { fontSize: 12, color: Colors.white, fontWeight: '700' },
  miniKpiRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 14,
  },
  miniKpi: { flex: 1, alignItems: 'center' },
  miniKpiVal: { fontSize: 18, fontWeight: '900', color: Colors.white },
  miniKpiLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  miniDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: 8 },

  sheet: { backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, padding: 16 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 12, marginTop: 8, letterSpacing: 0.1 },

  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  statRow: { flexDirection: 'row', alignItems: 'center' },
  statIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statInfo: { flex: 1 },
  statName: { fontSize: 14, fontWeight: '800', color: Colors.text },
  statSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  statValue: { fontSize: 26, fontWeight: '900' },

  adhesionCard: { borderRadius: 20, padding: 16, marginBottom: 20, overflow: 'hidden' },
  adhesionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  adhesionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adhesionInfo: { flex: 1 },
  adhesionTitle: { fontSize: 15, fontWeight: '800', color: Colors.white },
  adhesionSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 6, lineHeight: 17 },

  bottomPad: { height: 28 },
});
