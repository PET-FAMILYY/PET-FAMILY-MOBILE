import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Colors } from '../../src/constants/colors';
import { useAuth } from '../../src/providers/AuthProvider';
import { usePetsQuery } from '../../src/hooks/usePets';
import { queryKeys } from '../../src/hooks/queryKeys';
import {
  useConsultasQuery,
  useConsultasFuturasQuery,
  useAgendarConsultaMutation,
  useCancelarConsultaMutation,
  useRealizarConsultaMutation,
} from '../../src/hooks/useConsultas';
import { ConsultaCard } from '../../src/components/ConsultaCard';
import { LoadingState, ErrorState, EmptyState } from '../../src/components/StateViews';
import { ApiError } from '../../src/services/api';
import { brDateToIso, isFutureDateTime, timeToApiFormat, isValidTime } from '../../src/utils/validators';

const TIPOS: { label: string; emoji: string; color: string }[] = [
  { label: 'Preventiva', emoji: '🛡️', color: Colors.primary },
  { label: 'Vacinação', emoji: '💉', color: Colors.blue },
  { label: 'Retorno', emoji: '🔄', color: Colors.teal },
  { label: 'Emergência', emoji: '🚨', color: Colors.errorRed },
  { label: 'Check-up', emoji: '🔬', color: Colors.green },
];

function TutorConsultasScreen() {
  const { data: petsPage } = usePetsQuery({ size: 50 });
  const pets = petsPage?.content ?? [];
  const consultasQuery = useConsultasQuery({ size: 20 });
  const agendarMutation = useAgendarConsultaMutation();
  const cancelarMutation = useCancelarConsultaMutation();

  const [petId, setPetId] = useState<number | null>(null);
  const [tipo, setTipo] = useState('Preventiva');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const consultas = consultasQuery.data?.content ?? [];
  const selectedType = TIPOS.find(t => t.label === tipo)!;
  const selectedPet = pets.find(p => p.id === petId);
  const isFilled = !!petId && !!data && !!horario;

  const update = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setConfirmed(false);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!petId) e.petId = 'Selecione um pet.';
    if (!data.trim() || !brDateToIso(data)) e.data = 'Data inválida (DD/MM/AAAA).';
    if (!horario.trim() || !isValidTime(horario)) e.horario = 'Horário inválido (HH:MM).';
    if (!e.data && !e.horario && !isFutureDateTime(data, horario)) e.data = 'Data/horário precisa ser futuro.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAgendar = () => {
    if (agendarMutation.isPending || !validate()) return;
    agendarMutation.mutate(
      {
        petId: petId as number,
        tipoConsulta: tipo,
        data: brDateToIso(data)!,
        horario: timeToApiFormat(horario),
        observacoes: observacoes.trim() || undefined,
      },
      {
        onSuccess: () => setConfirmed(true),
        onError: (err) => {
          const message = err instanceof ApiError ? err.message : 'Não foi possível agendar.';
          Alert.alert('Erro', message);
        },
      }
    );
  };

  const handleCancelar = (id: number) => {
    Alert.alert('Cancelar consulta', 'Deseja realmente cancelar esta consulta?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar consulta',
        style: 'destructive',
        onPress: () => cancelarMutation.mutate(id, {
          onError: (err) => Alert.alert('Erro', err instanceof ApiError ? err.message : 'Não foi possível cancelar.'),
        }),
      },
    ]);
  };

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: queryKeys.consultas.all });
    await queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradientEnd} />

      <LinearGradient
        colors={[Colors.gradientEnd, Colors.gradientStart]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGrad}
      >
        <Text style={styles.headerTitle}>Agendar Consulta</Text>
        <Text style={styles.headerSub}>Marque com seu veterinário preferido</Text>

        {isFilled && (
          <View style={styles.summaryPill}>
            <Text style={styles.summaryEmoji}>{selectedType.emoji}</Text>
            <View style={styles.summaryTexts}>
              <Text style={styles.summaryPet}>{selectedPet?.nome}</Text>
              <Text style={styles.summaryDate}>{data} às {horario} · {selectedType.label}</Text>
            </View>
            {confirmed && <Ionicons name="checkmark-circle" size={20} color={Colors.green} />}
          </View>
        )}
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        >
          <Text style={styles.sectionLabel}>Tipo de consulta</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
            {TIPOS.map(t => (
              <TouchableOpacity
                key={t.label}
                style={[styles.typeChip, tipo === t.label && { backgroundColor: t.color, borderColor: t.color }]}
                onPress={() => update(setTipo)(t.label)}
                activeOpacity={0.8}
              >
                <Text style={styles.typeChipEmoji}>{t.emoji}</Text>
                <Text style={[styles.typeChipLabel, tipo === t.label && styles.typeChipLabelActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionLabel}>Pet</Text>
          {pets.length === 0 ? (
            <Text style={styles.hint}>Cadastre um pet antes de agendar uma consulta.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
              {pets.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.typeChip, petId === p.id && styles.typeChipActive]}
                  onPress={() => { setPetId(p.id); setConfirmed(false); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.typeChipLabel, petId === p.id && styles.typeChipLabelActive]}>{p.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {errors.petId && <Text style={styles.errorText}>{errors.petId}</Text>}

          <View style={styles.rowFields}>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Data *</Text>
              <View style={[styles.inputWrap, errors.data ? styles.inputError : null]}>
                <Ionicons name="calendar-outline" size={18} color={Colors.textLight} style={styles.icon} />
                <TextInput style={styles.inputInner} value={data} onChangeText={update(setData)} placeholder="DD/MM/AAAA" placeholderTextColor={Colors.textLight} keyboardType="numeric" />
              </View>
              {errors.data && <Text style={styles.errorText}>{errors.data}</Text>}
            </View>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Horário *</Text>
              <View style={[styles.inputWrap, errors.horario ? styles.inputError : null]}>
                <Ionicons name="time-outline" size={18} color={Colors.textLight} style={styles.icon} />
                <TextInput style={styles.inputInner} value={horario} onChangeText={update(setHorario)} placeholder="HH:MM" placeholderTextColor={Colors.textLight} keyboardType="numeric" />
              </View>
              {errors.horario && <Text style={styles.errorText}>{errors.horario}</Text>}
            </View>
          </View>

          <Text style={styles.fieldLabel}>Observações</Text>
          <View style={[styles.inputWrap, styles.textareaWrap]}>
            <TextInput style={[styles.inputInner, styles.textareaInner]} value={observacoes} onChangeText={update(setObservacoes)} placeholder="Sintomas, dúvidas..." placeholderTextColor={Colors.textLight} multiline numberOfLines={3} textAlignVertical="top" />
          </View>

          <TouchableOpacity style={[styles.saveBtn, agendarMutation.isPending && styles.saveBtnOff]} onPress={handleAgendar} disabled={agendarMutation.isPending} activeOpacity={0.85}>
            <LinearGradient colors={[Colors.primaryDark, Colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtnGrad}>
              <Ionicons name={confirmed ? 'calendar' : 'calendar-outline'} size={20} color={Colors.white} />
              <Text style={styles.saveBtnText}>{agendarMutation.isPending ? 'Agendando...' : 'Confirmar Agendamento'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {confirmed && (
            <View style={styles.confirmCard}>
              <View style={styles.confirmIconBox}>
                <Ionicons name="checkmark-circle" size={28} color={Colors.green} />
              </View>
              <View style={styles.confirmInfo}>
                <Text style={styles.confirmTitle}>Consulta confirmada!</Text>
                <Text style={styles.confirmSub}>Agendada e salva na API. Leve a carteira de vacinação do seu pet.</Text>
              </View>
            </View>
          )}

          <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Minhas consultas</Text>
          {consultasQuery.isLoading ? (
            <LoadingState label="Carregando consultas..." />
          ) : consultasQuery.isError ? (
            <ErrorState message="Não foi possível carregar suas consultas." onRetry={consultasQuery.refetch} />
          ) : consultas.length === 0 ? (
            <EmptyState icon="medical-outline" title="Nenhuma consulta agendada" />
          ) : (
            consultas.map(c => (
              <ConsultaCard key={c.id} consulta={c} onCancelar={c.status === 'AGENDADA' ? () => handleCancelar(c.id) : undefined} busy={cancelarMutation.isPending} />
            ))
          )}

          <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function VetConsultasScreen() {
  const futurasQuery = useConsultasFuturasQuery();
  const cancelarMutation = useCancelarConsultaMutation();
  const realizarMutation = useRealizarConsultaMutation();
  const consultas = futurasQuery.data?.content ?? [];

  const handleCancelar = (id: number) => {
    Alert.alert('Cancelar consulta', 'Deseja realmente cancelar esta consulta?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar consulta',
        style: 'destructive',
        onPress: () => cancelarMutation.mutate(id, {
          onError: (err) => Alert.alert('Erro', err instanceof ApiError ? err.message : 'Não foi possível cancelar.'),
        }),
      },
    ]);
  };

  const handleRealizar = (id: number, observacoes: string) => {
    realizarMutation.mutate(
      { id, data: { observacoes } },
      {
        onSuccess: () => Alert.alert('Consulta realizada', 'Registro salvo com sucesso.'),
        onError: (err) => Alert.alert('Erro', err instanceof ApiError ? err.message : 'Não foi possível concluir a consulta.'),
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradientEnd} />
      <LinearGradient colors={[Colors.gradientEnd, Colors.gradientStart]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGrad}>
        <Text style={styles.headerTitle}>Agenda Clínica</Text>
        <Text style={styles.headerSub}>Consultas futuras de todos os tutores</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={futurasQuery.isRefetching} onRefresh={futurasQuery.refetch} colors={[Colors.primary]} />}
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
              busy={cancelarMutation.isPending || realizarMutation.isPending}
              onCancelar={() => handleCancelar(c.id)}
              onRealizar={(obs) => handleRealizar(c.id, obs)}
            />
          ))
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function AppointmentScreen() {
  const { isVeterinario } = useAuth();
  return isVeterinario ? <VetConsultasScreen /> : <TutorConsultasScreen />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.gradientEnd },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },

  headerGrad: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
    gap: 10,
  },
  summaryEmoji: { fontSize: 22 },
  summaryTexts: { flex: 1 },
  summaryPet: { fontSize: 14, fontWeight: '800', color: Colors.white },
  summaryDate: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1 },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 20,
  },

  typeScroll: { marginBottom: 4, marginHorizontal: -4 },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeChipEmoji: { fontSize: 16 },
  typeChipLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  typeChipLabelActive: { color: Colors.white },

  hint: { fontSize: 13, color: Colors.textLight, marginBottom: 8 },

  fieldWrap: { marginBottom: 12, flex: 1 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 7, marginTop: 12 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputError: { borderColor: Colors.errorRed },
  icon: { marginRight: 10 },
  inputInner: { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: 12 },
  textareaWrap: { alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 },
  textareaInner: { minHeight: 72, paddingVertical: 0 },
  rowFields: { flexDirection: 'row', gap: 12 },
  errorText: { fontSize: 12, color: Colors.errorRed, marginTop: 4, marginLeft: 2 },

  saveBtn: { marginTop: 20, borderRadius: 16, overflow: 'hidden' },
  saveBtnOff: { opacity: 0.7 },
  saveBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },

  confirmCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.greenLight,
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.green + '44',
  },
  confirmIconBox: { marginTop: 2 },
  confirmInfo: { flex: 1 },
  confirmTitle: { fontSize: 14, fontWeight: '700', color: Colors.greenDark },
  confirmSub: { fontSize: 13, color: Colors.greenDark, marginTop: 3, lineHeight: 18, opacity: 0.85 },

  bottomPad: { height: 28 },
});
