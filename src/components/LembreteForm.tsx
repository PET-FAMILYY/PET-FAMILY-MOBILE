import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { usePetsQuery } from '../hooks/usePets';
import { brDateToIso, isFutureDateTime, isoDateToBR } from '../utils/validators';
import { LoadingState, ErrorState } from './StateViews';
import type { LembreteRequest } from '../types/api';

export interface LembreteFormValues {
  petId: number | null;
  titulo: string;
  descricao: string;
  dataLembrete: string;
  tipo: string;
  recorrenciaDias: string;
}

export const emptyLembreteForm: LembreteFormValues = {
  petId: null,
  titulo: '',
  descricao: '',
  dataLembrete: '',
  tipo: '',
  recorrenciaDias: '',
};

interface LembreteFormProps {
  initialValues?: LembreteFormValues;
  onSubmit: (data: LembreteRequest) => void;
  submitting: boolean;
  submitLabel: string;
}

export const LembreteForm: React.FC<LembreteFormProps> = ({ initialValues, onSubmit, submitting, submitLabel }) => {
  const [form, setForm] = useState<LembreteFormValues>(initialValues ?? emptyLembreteForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LembreteFormValues, string>>>({});
  const { data: petsPage, isLoading: petsLoading, isError: petsError, refetch: refetchPets } = usePetsQuery({ size: 100 });

  const update = (field: keyof LembreteFormValues, value: string | number | null) => {
    setForm(prev => ({ ...prev, [field]: value } as LembreteFormValues));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.petId) e.petId = 'Selecione um pet.';
    if (!form.titulo.trim()) e.titulo = 'Informe um título.';
    if (!form.tipo.trim()) e.tipo = 'Informe o tipo de cuidado.';
    if (!form.dataLembrete.trim()) e.dataLembrete = 'Informe a data.';
    else if (!brDateToIso(form.dataLembrete)) e.dataLembrete = 'Data inválida (use DD/MM/AAAA).';
    else if (!isFutureDateTime(form.dataLembrete)) e.dataLembrete = 'A data precisa ser futura.';
    if (form.recorrenciaDias.trim() && (!/^\d+$/.test(form.recorrenciaDias.trim()) || Number(form.recorrenciaDias) <= 0)) {
      e.recorrenciaDias = 'Deve ser um número de dias positivo.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (submitting || !validate()) return;
    const iso = brDateToIso(form.dataLembrete)!;
    onSubmit({
      petId: form.petId as number,
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim() || undefined,
      dataLembrete: iso,
      tipo: form.tipo.trim(),
      recorrenciaDias: form.recorrenciaDias.trim() ? Number(form.recorrenciaDias) : undefined,
    });
  };

  const pets = petsPage?.content ?? [];

  return (
    <View>
      <Text style={styles.sectionLabel}>Pet</Text>
      {petsLoading ? (
        <LoadingState label="Carregando pets..." />
      ) : petsError ? (
        <ErrorState message="Não foi possível carregar os pets." onRetry={refetchPets} />
      ) : pets.length === 0 ? (
        <Text style={styles.emptyPets}>Nenhum pet cadastrado no sistema ainda.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petScroll}>
          {pets.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.petChip, form.petId === p.id && styles.petChipActive]}
              onPress={() => update('petId', p.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.petChipText, form.petId === p.id && styles.petChipTextActive]}>
                {p.nome} · {p.tutorNome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {errors.petId && <Text style={styles.errorText}>{errors.petId}</Text>}

      <Field label="Título *" icon="bookmark-outline" value={form.titulo} onChangeText={v => update('titulo', v)} placeholder="Ex: Vacina V10" error={errors.titulo} />
      <Field label="Tipo *" icon="pricetag-outline" value={form.tipo} onChangeText={v => update('tipo', v)} placeholder="Ex: Vacinação, Vermifugação..." error={errors.tipo} />

      <View style={styles.rowFields}>
        <View style={{ flex: 1 }}>
          <Field label="Data *" icon="calendar-outline" value={form.dataLembrete} onChangeText={v => update('dataLembrete', v)} placeholder="DD/MM/AAAA" keyboardType="numeric" error={errors.dataLembrete} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Recorrência (dias)" icon="repeat-outline" value={form.recorrenciaDias} onChangeText={v => update('recorrenciaDias', v)} placeholder="Ex: 365" keyboardType="numeric" error={errors.recorrenciaDias} />
        </View>
      </View>

      <Text style={styles.fieldLabel}>Descrição</Text>
      <View style={[styles.inputWrap, styles.textareaWrap]}>
        <TextInput
          style={[styles.inputInner, styles.textareaInner]}
          value={form.descricao}
          onChangeText={v => update('descricao', v)}
          placeholder="Detalhes sobre o cuidado..."
          placeholderTextColor={Colors.textLight}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={[styles.saveBtn, submitting && styles.saveBtnLoading]} onPress={handleSubmit} disabled={submitting} activeOpacity={0.85}>
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtnGrad}>
          <Text style={styles.saveBtnText}>{submitting ? 'Salvando...' : submitLabel}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const Field: React.FC<{
  label: string;
  icon: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: any;
}> = ({ label, icon, value, onChangeText, placeholder, error, keyboardType }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.inputWrap, error ? styles.inputError : null]}>
      <Ionicons name={icon as any} size={18} color={Colors.textLight} style={styles.inputIcon} />
      <TextInput
        style={styles.inputInner}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        keyboardType={keyboardType}
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  petScroll: { marginBottom: 4 },
  petChip: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  petChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  petChipText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  petChipTextActive: { color: Colors.primary },
  emptyPets: { fontSize: 13, color: Colors.textLight, marginBottom: 8 },

  fieldWrap: { marginBottom: 12, marginTop: 12 },
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
  inputIcon: { marginRight: 10 },
  inputInner: { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: 12 },
  textareaWrap: { alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 },
  textareaInner: { minHeight: 72, paddingVertical: 0 },
  rowFields: { flexDirection: 'row', gap: 12 },
  errorText: { fontSize: 12, color: Colors.errorRed, marginTop: 6, marginLeft: 2 },

  saveBtn: { marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  saveBtnLoading: { opacity: 0.7 },
  saveBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },
});
