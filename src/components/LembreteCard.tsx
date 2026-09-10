import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { LembreteResponse } from '../types/api';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; accent: string }> = {
  PENDENTE: { label: 'Pendente', color: '#D97706', bg: '#FFFBEB', accent: '#F59E0B' },
  CONCLUIDO: { label: 'Concluído', color: '#059669', bg: '#F0FDF4', accent: '#10B981' },
  CANCELADO: { label: 'Cancelado', color: '#6B7280', bg: '#F3F4F6', accent: '#9CA3AF' },
};

interface LembreteCardProps {
  lembrete: LembreteResponse;
  showPetName?: boolean;
  onConcluir?: () => void;
  onCancelar?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  busy?: boolean;
}

export const LembreteCard: React.FC<LembreteCardProps> = ({
  lembrete,
  showPetName,
  onConcluir,
  onCancelar,
  onEdit,
  onDelete,
  busy,
}) => {
  const cfg = STATUS_CONFIG[lembrete.status];
  const isDone = lembrete.status !== 'PENDENTE';

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <View style={[styles.accent, { backgroundColor: cfg.accent }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={[styles.title, isDone && styles.titleDone]} numberOfLines={1}>
            {lembrete.titulo}
          </Text>
          <View style={styles.badgeGroup}>
            {lembrete.atrasado && (
              <View style={styles.lateBadge}>
                <Text style={styles.lateBadgeText}>Atrasado</Text>
              </View>
            )}
            <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          </View>
        </View>

        {showPetName && <Text style={styles.petName}>🐾 {lembrete.petNome}</Text>}
        {!!lembrete.descricao && (
          <Text style={styles.description} numberOfLines={2}>{lembrete.descricao}</Text>
        )}

        <View style={styles.footer}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={11} color="#9CA3AF" />
            <Text style={styles.date}>{lembrete.dataLembrete.split('-').reverse().join('/')}</Text>
            <Text style={styles.tipo}>· {lembrete.tipo}</Text>
          </View>

          <View style={styles.actions}>
            {onConcluir && lembrete.status === 'PENDENTE' && (
              <TouchableOpacity style={styles.actionBtn} onPress={onConcluir} disabled={busy}>
                <Text style={styles.actionBtnText}>Marcar como feito</Text>
              </TouchableOpacity>
            )}
            {onCancelar && lembrete.status === 'PENDENTE' && (
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnGhost]} onPress={onCancelar} disabled={busy}>
                <Text style={[styles.actionBtnText, styles.actionBtnTextGhost]}>Cancelar</Text>
              </TouchableOpacity>
            )}
            {onEdit && (
              <TouchableOpacity style={styles.iconBtn} onPress={onEdit} disabled={busy} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <Ionicons name="create-outline" size={18} color="#6F3CC3" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.iconBtn} onPress={onDelete} disabled={busy} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardDone: { opacity: 0.75 },
  accent: { width: 3, alignSelf: 'stretch' },
  body: { flex: 1, padding: 14, paddingLeft: 16 },

  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, gap: 8 },
  title: { fontSize: 14, fontWeight: '600', color: '#111827', flex: 1, letterSpacing: -0.1 },
  titleDone: { color: '#6B7280' },
  badgeGroup: { flexDirection: 'row', gap: 6, flexShrink: 0 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.1 },
  lateBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  lateBadgeText: { fontSize: 10, fontWeight: '700', color: '#DC2626' },

  petName: { fontSize: 11, color: '#6F3CC3', fontWeight: '600', marginBottom: 4 },
  description: { fontSize: 12, color: '#6B7280', lineHeight: 17, marginBottom: 10 },

  footer: { gap: 8 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  tipo: { fontSize: 11, color: '#9CA3AF' },

  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#F3EDFF' },
  actionBtnGhost: { backgroundColor: '#FEE2E2' },
  actionBtnText: { fontSize: 11, color: '#6F3CC3', fontWeight: '600', letterSpacing: 0.1 },
  actionBtnTextGhost: { color: '#DC2626' },
  iconBtn: { padding: 4 },
});
