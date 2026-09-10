import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/colors';
import { LembreteForm } from '../../../src/components/LembreteForm';
import { useCreateLembreteMutation } from '../../../src/hooks/useLembretes';
import { useAuth } from '../../../src/providers/AuthProvider';
import { EmptyState } from '../../../src/components/StateViews';
import { ApiError } from '../../../src/services/api';
import type { LembreteRequest } from '../../../src/types/api';

export default function NewLembreteScreen() {
  const router = useRouter();
  const { isVeterinario } = useAuth();
  const createMutation = useCreateLembreteMutation();

  const handleSubmit = (data: LembreteRequest) => {
    createMutation.mutate(data, {
      onSuccess: (lembrete) => {
        Alert.alert('Cuidado criado!', `"${lembrete.titulo}" foi agendado para ${lembrete.petNome}.`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: (err) => {
        const message = err instanceof ApiError ? err.message : 'Não foi possível criar o cuidado.';
        Alert.alert('Erro', message);
      },
    });
  };

  if (!isVeterinario) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#3B0F8C" />
        <EmptyState icon="lock-closed-outline" title="Área exclusiva do Veterinário" subtitle="Criar cuidados (POST /lembretes) é restrito ao perfil Veterinário na API." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#3B0F8C" />
      <LinearGradient colors={['#3B0F8C', '#6D28D9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Novo Cuidado</Text>
            <Text style={styles.headerSub}>Cadastre um lembrete preventivo</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <LembreteForm onSubmit={handleSubmit} submitting={createMutation.isPending} submitLabel="Criar cuidado" />
          <View style={{ height: 28 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#3B0F8C' },
  scroll: { flex: 1, backgroundColor: '#F7F7F9' },
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
});
