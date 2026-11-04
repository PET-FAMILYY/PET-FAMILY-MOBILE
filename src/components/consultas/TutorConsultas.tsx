import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GradientHeader } from '../GradientHeader';
import { ConsultaCard } from '../ConsultaCard';
import { LoadingState, ErrorState, EmptyState } from '../StateViews';
import { ThemedRefreshControl } from '../ThemedRefreshControl';
import type { ThemeColors } from '../../constants/colors';
import { useTheme } from '../../providers/ThemeProvider';
import { usePetsQuery } from '../../hooks/usePets';
import { useConsultasQuery } from '../../hooks/useConsultas';
import { useConsultaActions } from '../../hooks/useConsultaActions';
import { useAgendamentoForm } from '../../hooks/useAgendamentoForm';
import { useRefresh } from '../../hooks/useRefresh';
import { createConsultasBaseStyles } from './consultasStyles';

const getTipos = (colors: ThemeColors): { label: string; emoji: string; color: string }[] => [
  { label: 'Preventiva', emoji: '🛡️', color: colors.primary },
  { label: 'Vacinação', emoji: '💉', color: colors.blue },
  { label: 'Retorno', emoji: '🔄', color: colors.teal },
  { label: 'Emergência', emoji: '🚨', color: colors.errorRed },
  { label: 'Check-up', emoji: '🔬', color: colors.green },
];

// Visao do Tutor: formulario de agendamento e lista das proprias consultas.
export function TutorConsultas() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const petsQuery = usePetsQuery({ size: 50 });
  const consultasQuery = useConsultasQuery({ size: 20 });
  const { busy, cancelar } = useConsultaActions();
  const form = useAgendamentoForm();
  const { refreshing, onRefresh } = useRefresh(consultasQuery.refetch, petsQuery.refetch);

  const pets = petsQuery.data?.content ?? [];
  const consultas = consultasQuery.data?.content ?? [];
  const { values, errors, petId, confirmed, isFilled, isSubmitting } = form;

  const TIPOS = getTipos(colors);
  const selectedType = TIPOS.find(t => t.label === values.tipo)!;
  const selectedPet = pets.find(p => p.id === petId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradientEnd} />

      <GradientHeader style={styles.headerGrad}>
        <Text style={styles.headerTitle}>Agendar Consulta</Text>
        <Text style={styles.headerSub}>Marque com seu veterinário preferido</Text>

        {isFilled && (
          <View style={styles.summaryPill}>
            <Text style={styles.summaryEmoji}>{selectedType.emoji}</Text>
            <View style={styles.summaryTexts}>
              <Text style={styles.summaryPet}>{selectedPet?.nome}</Text>
              <Text style={styles.summaryDate}>{values.data} às {values.horario} · {selectedType.label}</Text>
            </View>
            {confirmed && <Ionicons name="checkmark-circle" size={20} color={colors.green} />}
          </View>
        )}
      </GradientHeader>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={<ThemedRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.sectionLabel}>Tipo de consulta</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
            {TIPOS.map(t => (
              <TouchableOpacity
                key={t.label}
                style={[styles.typeChip, values.tipo === t.label && { backgroundColor: t.color, borderColor: t.color }]}
                onPress={() => form.setField('tipo')(t.label)}
                activeOpacity={0.8}
              >
                <Text style={styles.typeChipEmoji}>{t.emoji}</Text>
                <Text style={[styles.typeChipLabel, values.tipo === t.label && styles.typeChipLabelActive]}>{t.label}</Text>
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
                  onPress={() => form.selectPet(p.id)}
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
                <Ionicons name="calendar-outline" size={18} color={colors.textLight} style={styles.icon} />
                <TextInput style={styles.inputInner} value={values.data} onChangeText={form.setField('data')} placeholder="DD/MM/AAAA" placeholderTextColor={colors.textLight} keyboardType="numeric" />
              </View>
              {errors.data && <Text style={styles.errorText}>{errors.data}</Text>}
            </View>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Horário *</Text>
              <View style={[styles.inputWrap, errors.horario ? styles.inputError : null]}>
                <Ionicons name="time-outline" size={18} color={colors.textLight} style={styles.icon} />
                <TextInput style={styles.inputInner} value={values.horario} onChangeText={form.setField('horario')} placeholder="HH:MM" placeholderTextColor={colors.textLight} keyboardType="numeric" />
              </View>
              {errors.horario && <Text style={styles.errorText}>{errors.horario}</Text>}
            </View>
          </View>

          <Text style={styles.fieldLabel}>Observações</Text>
          <View style={[styles.inputWrap, styles.textareaWrap]}>
            <TextInput style={[styles.inputInner, styles.textareaInner]} value={values.observacoes} onChangeText={form.setField('observacoes')} placeholder="Sintomas, dúvidas..." placeholderTextColor={colors.textLight} multiline numberOfLines={3} textAlignVertical="top" />
          </View>

          <TouchableOpacity style={[styles.saveBtn, isSubmitting && styles.saveBtnOff]} onPress={form.submit} disabled={isSubmitting} activeOpacity={0.85}>
            <LinearGradient colors={[colors.primaryDark, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtnGrad}>
              <Ionicons name={confirmed ? 'calendar' : 'calendar-outline'} size={20} color={colors.white} />
              <Text style={styles.saveBtnText}>{isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {confirmed && (
            <View style={styles.confirmCard}>
              <View style={styles.confirmIconBox}>
                <Ionicons name="checkmark-circle" size={28} color={colors.green} />
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
              <ConsultaCard key={c.id} consulta={c} onCancelar={c.status === 'AGENDADA' ? () => cancelar(c.id) : undefined} busy={busy} />
            ))
          )}

          <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => ({
  ...createConsultasBaseStyles(colors),
  ...StyleSheet.create({
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
    summaryPet: { fontSize: 14, fontWeight: '800', color: colors.white },
    summaryDate: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1 },

    sectionLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textSecondary,
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
      backgroundColor: colors.surface,
      borderRadius: 24,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginHorizontal: 4,
      borderWidth: 2,
      borderColor: colors.border,
    },
    typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    typeChipEmoji: { fontSize: 16 },
    typeChipLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    typeChipLabelActive: { color: colors.white },

    hint: { fontSize: 13, color: colors.textLight, marginBottom: 8 },

    fieldWrap: { marginBottom: 12, flex: 1 },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 7, marginTop: 12 },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 14,
      minHeight: 52,
    },
    inputError: { borderColor: colors.errorRed },
    icon: { marginRight: 10 },
    inputInner: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 12 },
    textareaWrap: { alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 },
    textareaInner: { minHeight: 72, paddingVertical: 0 },
    rowFields: { flexDirection: 'row', gap: 12 },
    errorText: { fontSize: 12, color: colors.errorRed, marginTop: 4, marginLeft: 2 },

    saveBtn: { marginTop: 20, borderRadius: 16, overflow: 'hidden' },
    saveBtnOff: { opacity: 0.7 },
    saveBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
    saveBtnText: { fontSize: 16, fontWeight: '800', color: colors.white, letterSpacing: 0.3 },

    confirmCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.greenLight,
      borderRadius: 16,
      padding: 14,
      marginTop: 14,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.green + '44',
    },
    confirmIconBox: { marginTop: 2 },
    confirmInfo: { flex: 1 },
    confirmTitle: { fontSize: 14, fontWeight: '700', color: colors.greenDark },
    confirmSub: { fontSize: 13, color: colors.greenDark, marginTop: 3, lineHeight: 18, opacity: 0.85 },
  }),
});
