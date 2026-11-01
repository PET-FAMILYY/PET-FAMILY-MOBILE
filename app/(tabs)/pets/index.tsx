import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import type { MaterialIconName } from '../../../src/types/icons';
import { GradientHeader } from '../../../src/components/GradientHeader';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ThemeColors } from '../../../src/constants/colors';
import { useTheme } from '../../../src/providers/ThemeProvider';
import { usePetsQuery, useDeletePetMutation } from '../../../src/hooks/usePets';
import { LoadingState, ErrorState, EmptyState } from '../../../src/components/StateViews';
import { ApiError } from '../../../src/services/api';
import type { PetResponse } from '../../../src/types/api';

const speciesIcon = (especie: string): MaterialIconName => {
  const lower = especie.toLowerCase();
  if (lower.includes('cachorro') || lower.includes('cão') || lower.includes('cao')) return 'dog';
  if (lower.includes('gato')) return 'cat';
  return 'paw';
};

export default function PetsListScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = usePetsQuery({ size: 50 });
  const deleteMutation = useDeletePetMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const pets = data?.content ?? [];

  const confirmDelete = (pet: PetResponse) => {
    const deps: string[] = [];
    if (pet.totalConsultas > 0) deps.push(`${pet.totalConsultas} consulta(s)`);
    if (pet.totalLembretesPendentes > 0) deps.push(`${pet.totalLembretesPendentes} lembrete(s) pendente(s)`);
    const depsText = deps.length > 0 ? `\n\nAtenção: ${pet.nome} possui ${deps.join(' e ')} vinculados, que também serão removidos.` : '';

    Alert.alert(
      'Remover pet',
      `Tem certeza que deseja remover ${pet.nome}? Essa ação não pode ser desfeita.${depsText}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setDeletingId(pet.id);
            deleteMutation.mutate(pet.id, {
              onError: (err) => {
                const message = err instanceof ApiError ? err.message : 'Não foi possível remover o pet.';
                Alert.alert('Erro', message);
              },
              onSettled: () => setDeletingId(null),
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradientEnd} />

      <GradientHeader style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Meus Pets</Text>
            <Text style={styles.headerSub}>{pets.length} pet(s) cadastrado(s)</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/pets/new')} activeOpacity={0.85}>
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </GradientHeader>

      <View style={styles.content}>
        {isLoading ? (
          <LoadingState label="Carregando pets..." />
        ) : isError ? (
          <ErrorState message="Não foi possível carregar seus pets." onRetry={refetch} />
        ) : pets.length === 0 ? (
          <EmptyState
            icon="paw-outline"
            title="Nenhum pet cadastrado"
            subtitle="Toque em + para cadastrar o primeiro pet."
          />
        ) : (
          <FlatList
            data={pets}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary]} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => router.push(`/pets/${item.id}`)}
              >
                <View style={styles.petAvatar}>
                  <MaterialCommunityIcons name={speciesIcon(item.especie)} size={26} color={colors.primary} />
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{item.nome}</Text>
                  <Text style={styles.petSub}>
                    {item.especie}{item.raca ? ` · ${item.raca}` : ''}{item.idade ? ` · ${item.idade} anos` : ''}
                  </Text>
                  <View style={styles.badgeRow}>
                    {item.totalLembretesPendentes > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.totalLembretesPendentes} lembrete(s)</Text>
                      </View>
                    )}
                    {item.totalConsultas > 0 && (
                      <View style={[styles.badge, styles.badgeBlue]}>
                        <Text style={[styles.badgeText, styles.badgeTextBlue]}>{item.totalConsultas} consulta(s)</Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => confirmDelete(item)}
                  disabled={deletingId === item.id}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.errorRed} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gradientEnd },
  headerGrad: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  petAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  petInfo: { flex: 1 },
  petName: { fontSize: 16, fontWeight: '800', color: colors.text },
  petSub: { fontSize: 12, color: colors.textSecondary, marginTop: 3 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  badge: {
    backgroundColor: colors.yellowLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#B45309' },
  badgeBlue: { backgroundColor: colors.blueLight },
  badgeTextBlue: { color: colors.blueDark },
  deleteBtn: { padding: 8 },
});
