import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import type { PetRequest } from '../types/api';

export const SPECIES: { value: string; label: string; icon: string }[] = [
  { value: 'Cachorro', label: 'Cão', icon: 'dog' },
  { value: 'Gato', label: 'Gato', icon: 'cat' },
  { value: 'Outro', label: 'Outro', icon: 'paw' },
];

export interface PetFormValues {
  nome: string;
  especie: string;
  raca: string;
  idade: string;
  peso: string;
  observacoesSaude: string;
}

export const emptyPetForm: PetFormValues = {
  nome: '',
  especie: 'Cachorro',
  raca: '',
  idade: '',
  peso: '',
  observacoesSaude: '',
};

interface PetFormProps {
  initialValues?: PetFormValues;
  onSubmit: (data: PetRequest) => void;
  submitting: boolean;
  submitLabel: string;
  onValuesChange?: (values: PetFormValues) => void;
}

export const PetForm: React.FC<PetFormProps> = ({ initialValues, onSubmit, submitting, submitLabel, onValuesChange }) => {
  const [form, setForm] = useState<PetFormValues>(initialValues ?? emptyPetForm);
  const [errors, setErrors] = useState<Partial<Record<keyof PetFormValues, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    onValuesChange?.(form);
  }, [form]);

  const update = (field: keyof PetFormValues, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.nome.trim()) e.nome = 'Informe o nome do pet.';
    if (!form.especie.trim()) e.especie = 'Selecione ou informe a espécie.';
    if (form.idade.trim() && (!/^\d+$/.test(form.idade.trim()) || Number(form.idade) <= 0)) {
      e.idade = 'Idade deve ser um número positivo.';
    }
    if (form.peso.trim() && (Number.isNaN(Number(form.peso.replace(',', '.'))) || Number(form.peso.replace(',', '.')) <= 0)) {
      e.peso = 'Peso deve ser um número positivo.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (submitting) return;
    if (!validate()) return;
    onSubmit({
      nome: form.nome.trim(),
      especie: form.especie.trim(),
      raca: form.raca.trim() || undefined,
      idade: form.idade.trim() ? Number(form.idade) : undefined,
      peso: form.peso.trim() ? Number(form.peso.replace(',', '.')) : undefined,
      observacoesSaude: form.observacoesSaude.trim() || undefined,
    });
  };

  return (
    <View>
      <Text style={styles.sectionLabel}>Tipo de animal</Text>
      <View style={styles.speciesRow}>
        {SPECIES.map(s => (
          <TouchableOpacity
            key={s.value}
            style={[styles.speciesBtn, form.especie === s.value && styles.speciesBtnActive]}
            onPress={() => update('especie', s.value)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={s.icon as any}
              size={28}
              color={form.especie === s.value ? Colors.primary : Colors.textLight}
              style={styles.speciesIcon}
            />
            <Text style={[styles.speciesLabel, form.especie === s.value && styles.speciesLabelActive]}>
              {s.label}
            </Text>
            {form.especie === s.value && (
              <View style={styles.speciesCheck}>
                <Ionicons name="checkmark" size={12} color={Colors.white} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {errors.especie && <Text style={styles.errorText}>{errors.especie}</Text>}

      <Text style={styles.sectionLabel}>Informações básicas</Text>

      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>Nome do pet *</Text>
        <View style={[styles.inputWrap, focusedField === 'nome' && styles.inputWrapFocused, errors.nome ? styles.inputError : null]}>
          <Ionicons name="paw-outline" size={18} color={focusedField === 'nome' ? Colors.primary : Colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.inputInner}
            value={form.nome}
            onChangeText={v => update('nome', v)}
            placeholder="Ex: Rex, Luna, Mimi..."
            placeholderTextColor={Colors.textLight}
            onFocus={() => setFocusedField('nome')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
      </View>

      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>Raça</Text>
        <View style={[styles.inputWrap, focusedField === 'raca' && styles.inputWrapFocused]}>
          <Ionicons name="ribbon-outline" size={18} color={focusedField === 'raca' ? Colors.primary : Colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.inputInner}
            value={form.raca}
            onChangeText={v => update('raca', v)}
            placeholder="Ex: Golden Retriever, SRD..."
            placeholderTextColor={Colors.textLight}
            onFocus={() => setFocusedField('raca')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      <View style={styles.rowFields}>
        <View style={[styles.fieldWrap, { flex: 1 }]}>
          <Text style={styles.fieldLabel}>Idade (anos)</Text>
          <View style={[styles.inputWrap, focusedField === 'idade' && styles.inputWrapFocused, errors.idade ? styles.inputError : null]}>
            <Ionicons name="calendar-outline" size={18} color={focusedField === 'idade' ? Colors.primary : Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.inputInner}
              value={form.idade}
              onChangeText={v => update('idade', v)}
              placeholder="Ex: 3"
              placeholderTextColor={Colors.textLight}
              keyboardType="numeric"
              onFocus={() => setFocusedField('idade')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          {errors.idade && <Text style={styles.errorText}>{errors.idade}</Text>}
        </View>
        <View style={[styles.fieldWrap, { flex: 1 }]}>
          <Text style={styles.fieldLabel}>Peso (kg)</Text>
          <View style={[styles.inputWrap, focusedField === 'peso' && styles.inputWrapFocused, errors.peso ? styles.inputError : null]}>
            <Ionicons name="barbell-outline" size={18} color={focusedField === 'peso' ? Colors.primary : Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.inputInner}
              value={form.peso}
              onChangeText={v => update('peso', v)}
              placeholder="Ex: 12.5"
              placeholderTextColor={Colors.textLight}
              keyboardType="decimal-pad"
              onFocus={() => setFocusedField('peso')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
          {errors.peso && <Text style={styles.errorText}>{errors.peso}</Text>}
        </View>
      </View>

      <Text style={styles.sectionLabel}>Saúde</Text>

      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>Observações de saúde</Text>
        <View style={[styles.inputWrap, styles.textareaWrap, focusedField === 'obs' && styles.inputWrapFocused]}>
          <TextInput
            style={[styles.inputInner, styles.textareaInner]}
            value={form.observacoesSaude}
            onChangeText={v => update('observacoesSaude', v)}
            placeholder="Alergias, medicamentos, cirurgias..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            onFocus={() => setFocusedField('obs')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, submitting && styles.saveBtnLoading]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveBtnGrad}
        >
          <Text style={styles.saveBtnText}>{submitting ? 'Salvando...' : submitLabel}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 20,
  },

  speciesRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  speciesBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  speciesBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  speciesIcon: { marginBottom: 6 },
  speciesLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  speciesLabelActive: { color: Colors.primary },
  speciesCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fieldWrap: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 7 },
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
  inputWrapFocused: { borderColor: Colors.primary },
  inputError: { borderColor: Colors.errorRed },
  inputIcon: { marginRight: 10 },
  inputInner: { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: 12 },
  textareaWrap: { alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 },
  textareaInner: { minHeight: 72, paddingVertical: 0 },
  rowFields: { flexDirection: 'row', gap: 12 },
  errorText: { fontSize: 12, color: Colors.errorRed, marginTop: 6, marginLeft: 2 },

  saveBtn: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  saveBtnLoading: { opacity: 0.7 },
  saveBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },
});
