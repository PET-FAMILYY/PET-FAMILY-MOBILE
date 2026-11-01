import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientHeader } from '../../../src/components/GradientHeader';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ThemeColors } from '../../../src/constants/colors';
import { useTheme } from '../../../src/providers/ThemeProvider';
import { LembreteForm } from '../../../src/components/LembreteForm';
import { useLembreteQuery, useUpdateLembreteMutation } from '../../../src/hooks/useLembretes';
import { LoadingState, ErrorState, EmptyState } from '../../../src/components/StateViews';
import { useAuth } from '../../../src/providers/AuthProvider';
import { ApiError } from '../../../src/services/api';
import { isoDateToBR } from '../../../src/utils/validators';
import type { LembreteRequest } from '../../../src/types/api';

export default function EditLembreteScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { isVeterinario } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lembreteId = Number(id);
  const { data: lembrete, isLoading, isError, refetch } = useLembreteQuery(lembreteId);
  const updateMutation = useUpdateLembreteMutation();

  if (!isVeterinario) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#3B0F8C" />
        <EmptyState icon="lock-closed-outline" title="Área exclusiva do Veterinário" subtitle="Editar cuidados (PUT /lembretes) é restrito ao perfil Veterinário na API." />
      </SafeAreaView>
    );
  }

  const handleSubmit = (data: LembreteRequest) => {
    updateMutation.mutate(
      { id: lembreteId, data },
      {
        onSuccess: (updated) => {
          Alert.alert('Cuidado atualizado!', `"${updated.titulo}" foi atualizado.`, [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: (err) => {
          const message = err instanceof ApiError ? err.message : 'Não foi possível atualizar o cuidado.';
          Alert.alert('Erro', message);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#3B0F8C" />
      <GradientHeader style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Editar Cuidado</Text>
            <Text style={styles.headerSub}>Atualize os dados do lembrete</Text>
          </View>
        </View>
      </GradientHeader>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <LoadingState label="Carregando cuidado..." />
          ) : isError || !lembrete ? (
            <ErrorState message="Não foi possível carregar este cuidado." onRetry={refetch} />
          ) : lembrete.status !== 'PENDENTE' ? (
            <Text style={styles.lockedText}>
              Este cuidado já está {lembrete.status === 'CONCLUIDO' ? 'concluído' : 'cancelado'} e não pode mais ser editado.
            </Text>
          ) : (
            <LembreteForm
              initialValues={{
                petId: lembrete.petId,
                titulo: lembrete.titulo,
                descricao: lembrete.descricao ?? '',
                dataLembrete: isoDateToBR(lembrete.dataLembrete),
                tipo: lembrete.tipo,
                recorrenciaDias: lembrete.recorrenciaDias != null ? String(lembrete.recorrenciaDias) : '',
              }}
              onSubmit={handleSubmit}
              submitting={updateMutation.isPending}
              submitLabel="Salvar alterações"
            />
          )}
          <View style={{ height: 28 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#3B0F8C' },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  headerGrad: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: colors.white },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  lockedText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 40, lineHeight: 20 },
});
