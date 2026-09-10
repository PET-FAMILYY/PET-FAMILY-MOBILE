import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/colors';
import { PetForm, SPECIES, type PetFormValues } from '../../../src/components/PetForm';
import { usePetQuery, useUpdatePetMutation } from '../../../src/hooks/usePets';
import { LoadingState, ErrorState } from '../../../src/components/StateViews';
import { ApiError } from '../../../src/services/api';
import type { PetRequest } from '../../../src/types/api';

export default function EditPetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const petId = Number(id);
  const { data: pet, isLoading, isError, refetch } = usePetQuery(petId);
  const updateMutation = useUpdatePetMutation();
  const [preview, setPreview] = useState<PetFormValues | null>(null);

  const initialValues = useMemo<PetFormValues | undefined>(() => pet ? ({
    nome: pet.nome,
    especie: pet.especie,
    raca: pet.raca ?? '',
    idade: pet.idade != null ? String(pet.idade) : '',
    peso: pet.peso != null ? String(pet.peso) : '',
    observacoesSaude: pet.observacoesSaude ?? '',
  }) : undefined, [pet]);

  const handleSubmit = (data: PetRequest) => {
    updateMutation.mutate(
      { id: petId, data },
      {
        onSuccess: (updated) => {
          Alert.alert('Pet atualizado!', `${updated.nome} foi atualizado com sucesso.`, [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: (err) => {
          const message = err instanceof ApiError ? err.message : 'Não foi possível atualizar o pet.';
          Alert.alert('Erro', message);
        },
      }
    );
  };

  const current = preview ?? initialValues;
  const speciesObj = SPECIES.find(s => s.value === current?.especie) ?? SPECIES[0];
  const isSaved = !!preview && !!initialValues && JSON.stringify(preview) === JSON.stringify(initialValues);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradientEnd} />
      <LinearGradient
        colors={[Colors.gradientEnd, Colors.gradientStart]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGrad}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{pet ? pet.nome : 'Editar Pet'}</Text>
            <Text style={styles.headerSub}>Atualize as informações</Text>
          </View>
        </View>

        {current && current.nome.length > 0 && (
          <View style={styles.previewPill}>
            <MaterialCommunityIcons name={speciesObj.icon as any} size={16} color={Colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.previewName}>{current.nome}</Text>
            {current.raca ? <Text style={styles.previewBreed}> · {current.raca}</Text> : null}
            {isSaved && (
              <View style={styles.savedDot}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.green} />
              </View>
            )}
          </View>
        )}
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <LoadingState label="Carregando pet..." />
          ) : isError || !pet ? (
            <ErrorState message="Não foi possível carregar este pet." onRetry={refetch} />
          ) : (
            <PetForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              submitting={updateMutation.isPending}
              submitLabel="Salvar alterações"
              onValuesChange={setPreview}
            />
          )}
          <View style={{ height: 28 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.gradientEnd },
  scroll: { flex: 1, backgroundColor: Colors.background },
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
  headerTitle: { fontSize: 22, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  previewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  previewName: { fontSize: 14, fontWeight: '700', color: Colors.white },
  previewBreed: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  savedDot: { marginLeft: 6 },
});
