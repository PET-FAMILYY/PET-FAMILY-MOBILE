import React, { useMemo } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientHeader } from '../GradientHeader';
import { ConsultaCard } from '../ConsultaCard';
import { LoadingState, ErrorState, EmptyState } from '../StateViews';
import { ThemedRefreshControl } from '../ThemedRefreshControl';
import { useTheme } from '../../providers/ThemeProvider';
import { useConsultasFuturasQuery } from '../../hooks/useConsultas';
import { useConsultaActions } from '../../hooks/useConsultaActions';
import { createConsultasBaseStyles } from './consultasStyles';

// Agenda clinica: consultas futuras de todos os tutores, com cancelamento e registro de realizacao.
export function VetConsultas() {
  const { colors } = useTheme();
  const styles = useMemo(() => createConsultasBaseStyles(colors), [colors]);
  const futurasQuery = useConsultasFuturasQuery();
  const { busy, cancelar, realizar } = useConsultaActions();
  const consultas = futurasQuery.data?.content ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradientEnd} />
      <GradientHeader style={styles.headerGrad}>
        <Text style={styles.headerTitle}>Agenda Clínica</Text>
        <Text style={styles.headerSub}>Consultas futuras de todos os tutores</Text>
      </GradientHeader>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<ThemedRefreshControl refreshing={futurasQuery.isRefetching} onRefresh={futurasQuery.refetch} />}
      >
        {futurasQuery.isLoading ? (
          <LoadingState label="Carregando agenda..." />
        ) : futurasQuery.isError ? (
          <ErrorState message="Não foi possível carregar a agenda." onRetry={futurasQuery.refetch} />
        ) : consultas.length === 0 ? (
          <EmptyState icon="medical-outline" title="Nenhuma consulta futura agendada" />
        ) : (
          consultas.map(c => (
            <ConsultaCard
              key={c.id}
              consulta={c}
              showTutorName
              busy={busy}
              onCancelar={() => cancelar(c.id)}
              onRealizar={(obs) => realizar(c.id, obs)}
            />
          ))
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}
