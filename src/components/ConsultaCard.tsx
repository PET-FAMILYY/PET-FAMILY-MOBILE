import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemeColors } from '../constants/colors';
import { useTheme } from '../providers/ThemeProvider';
import { apiTimeToDisplay, isoDateToBR } from '../utils/validators';
import type { ConsultaResponse } from '../types/api';

const getStatusConfig = (colors: ThemeColors): Record<string, { label: string; color: string; bg: string }> => ({
  AGENDADA: { label: 'Agendada', color: colors.blueDark, bg: colors.blueLight },
  REALIZADA: { label: 'Realizada', color: colors.greenDark, bg: colors.greenLight },
  CANCELADA: { label: 'Cancelada', color: colors.textSecondary, bg: colors.border },
});

interface ConsultaCardProps {
  consulta: ConsultaResponse;
  showTutorName?: boolean;
  onCancelar?: () => void;
  onRealizar?: (observacoes: string) => void;
  busy?: boolean;
}

export const ConsultaCard: React.FC<ConsultaCardProps> = ({ consulta, showTutorName, onCancelar, onRealizar, busy }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const cfg = getStatusConfig(colors)[consulta.status];
  const [realizando, setRealizando] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pet}>{consulta.petNome}</Text>
          {showTutorName && <Text style={styles.tutor}>Tutor: {consulta.tutorNome}</Text>}
        </View>
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      <Text style={styles.tipo}>{consulta.tipoConsulta}</Text>
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={13} color={colors.textLight} />
        <Text style={styles.date}>{isoDateToBR(consulta.data)} às {apiTimeToDisplay(consulta.horario)}</Text>
      </View>
      {!!consulta.observacoes && <Text style={styles.obs} numberOfLines={2}>{consulta.observacoes}</Text>}

      {consulta.status === 'AGENDADA' && (onCancelar || onRealizar) && (
        <View style={styles.actions}>
          {onCancelar && (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnGhost]} onPress={onCancelar} disabled={busy}>
              <Text style={[styles.actionBtnText, styles.actionBtnTextGhost]}>Cancelar</Text>
            </TouchableOpacity>
          )}
          {onRealizar && !realizando && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => setRealizando(true)} disabled={busy}>
              <Text style={styles.actionBtnText}>Realizar consulta</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {realizando && (
        <View style={styles.realizarBox}>
          <TextInput
            style={styles.realizarInput}
            placeholder="Observações da consulta (obrigatório)"
            placeholderTextColor={colors.textLight}
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
          />
          <View style={styles.realizarActions}>
            <TouchableOpacity onPress={() => setRealizando(false)} style={styles.realizarCancel}>
              <Text style={styles.realizarCancelText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.realizarConfirm, !observacoes.trim() && styles.realizarConfirmDisabled]}
              disabled={!observacoes.trim() || busy}
              onPress={() => onRealizar?.(observacoes.trim())}
            >
              <Text style={styles.realizarConfirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, gap: 8 },
  pet: { fontSize: 15, fontWeight: '800', color: colors.text },
  tutor: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  tipo: { fontSize: 13, color: colors.textSecondary, marginTop: 2, fontWeight: '600' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  date: { fontSize: 12, color: colors.primary, fontWeight: '700' },
  obs: { fontSize: 12, color: colors.textLight, marginTop: 6, lineHeight: 16 },

  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: colors.primaryLight },
  actionBtnGhost: { backgroundColor: colors.errorLight },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  actionBtnTextGhost: { color: colors.errorRed },

  realizarBox: { marginTop: 10, backgroundColor: colors.background, borderRadius: 12, padding: 10 },
  realizarInput: { fontSize: 13, color: colors.text, minHeight: 50, textAlignVertical: 'top' },
  realizarActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  realizarCancel: { paddingVertical: 6, paddingHorizontal: 12 },
  realizarCancelText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  realizarConfirm: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: colors.green },
  realizarConfirmDisabled: { opacity: 0.5 },
  realizarConfirmText: { fontSize: 12, color: colors.white, fontWeight: '700' },
});
