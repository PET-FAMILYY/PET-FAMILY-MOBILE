import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/colors';
import { PetForm, SPECIES, emptyPetForm, type PetFormValues } from '../../../src/components/PetForm';
import { useCreatePetMutation } from '../../../src/hooks/usePets';
import { ApiError } from '../../../src/services/api';
import type { PetRequest } from '../../../src/types/api';

export default function NewPetScreen() {
  const router = useRouter();
  const createMutation = useCreatePetMutation();
  const [preview, setPreview] = useState<PetFormValues>(emptyPetForm);

  const handleSubmit = (data: PetRequest) => {
    createMutation.mutate(data, {
      onSuccess: (pet) => {
        Alert.alert('Pet cadastrado!', `${pet.nome} foi cadastrado com sucesso.`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: (err) => {
        const message = err instanceof ApiError ? err.message : 'Não foi possível cadastrar o pet.';
        Alert.alert('Erro', message);
      },
    });
  };

  const speciesObj = SPECIES.find(s => s.value === preview.especie) ?? SPECIES[0];

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
            <Text style={styles.headerTitle}>Novo Pet</Text>
            <Text style={styles.headerSub}>Cadastre um novo companheiro</Text>
          </View>
        </View>

        {preview.nome.length > 0 && (
          <View style={styles.previewPill}>
            <MaterialCommunityIcons name={speciesObj.icon as any} size={16} color={Colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.previewName}>{preview.nome}</Text>
            {preview.raca ? <Text style={styles.previewBreed}> · {preview.raca}</Text> : null}
          </View>
        )}
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <PetForm onSubmit={handleSubmit} submitting={createMutation.isPending} submitLabel="Cadastrar Pet" onValuesChange={setPreview} />
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
});
