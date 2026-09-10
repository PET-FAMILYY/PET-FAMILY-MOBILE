import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ChatBubble } from '../../src/components/ChatBubble';
import { EmptyState, LoadingState } from '../../src/components/StateViews';
import { usePetsQuery } from '../../src/hooks/usePets';
import { useInteracoesDoPetQuery, useCreateInteracaoIAMutation } from '../../src/hooks/useInteracoesIA';
import { useAuth } from '../../src/providers/AuthProvider';
import { ApiError } from '../../src/services/api';
import { Colors } from '../../src/constants/colors';
import type { ChatMessage } from '../../src/types';

const QUICK_REPLIES = [
  { label: 'Vacina', key: 'Quais vacinas meu pet precisa?' },
  { label: 'Vermífugo', key: 'Com que frequência devo vermifugar?' },
  { label: 'Check-up', key: 'Quando fazer o check-up anual?' },
  { label: 'Sintomas', key: 'Meu pet está passando mal, o que fazer?' },
  { label: 'Agendar', key: 'Como agendar uma consulta?' },
];

export default function ChatScreen() {
  const { isVeterinario } = useAuth();
  const { data: petsPage } = usePetsQuery({ size: 50 });
  const pets = petsPage?.content ?? [];
  const [petId, setPetId] = useState<number | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!petId && pets.length > 0) setPetId(pets[0].id);
  }, [pets, petId]);

  const { data: historico, isLoading } = useInteracoesDoPetQuery(petId ?? undefined);
  const createMutation = useCreateInteracaoIAMutation();

  const messages: ChatMessage[] = useMemo(() => {
    const items = [...(historico ?? [])].reverse();
    return items.flatMap((i): ChatMessage[] => [
      { id: `${i.id}-q`, text: i.pergunta, sender: 'user', timestamp: new Date(i.dataHora) },
      { id: `${i.id}-a`, text: i.resposta, sender: 'ai', timestamp: new Date(i.dataHora) },
    ]);
  }, [historico]);

  const selectedPet = pets.find(p => p.id === petId);

  const send = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || !petId || createMutation.isPending) return;
    setInput('');
    createMutation.mutate(
      { pergunta: msg, petId },
      {
        onError: (err) => {
          const message = err instanceof ApiError ? err.message : 'Não foi possível enviar sua pergunta.';
          Alert.alert('Erro', message);
        },
      }
    );
  };

  if (isVeterinario) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.gradientEnd} />
        <EmptyState icon="lock-closed-outline" title="Área exclusiva do Tutor" subtitle="O assistente (POST /interacoes-ia) é restrito ao perfil Tutor na API." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.gradientEnd} />

      <LinearGradient colors={[Colors.gradientEnd, Colors.gradientStart]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerCenter}>
          <View style={styles.aiAvatar}>
            <Image source={require('../../assets/logo.png')} style={styles.aiAvatarImg} resizeMode="contain" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Assistente Pet Family</Text>
            <Text style={styles.headerNote}>Respostas geradas pela API (regras do backend)</Text>
          </View>
        </View>

        {pets.length > 1 && (
          <FlatList
            horizontal
            data={pets}
            keyExtractor={p => String(p.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.petPicker}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.petChip, petId === item.id && styles.petChipActive]}
                onPress={() => setPetId(item.id)}
              >
                <Text style={[styles.petChipText, petId === item.id && styles.petChipTextActive]}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {pets.length === 0 ? (
          <EmptyState icon="paw-outline" title="Cadastre um pet" subtitle="É preciso ter um pet cadastrado para conversar com o assistente." />
        ) : isLoading ? (
          <LoadingState label="Carregando conversa..." />
        ) : (
          <ImageBackground source={require('../../assets/Papel_de_parede.png')} style={styles.list} resizeMode="cover">
            {messages.length === 0 ? (
              <EmptyState
                icon="chatbubbles-outline"
                title={`Pergunte sobre ${selectedPet?.nome ?? 'seu pet'}`}
                subtitle="Vacinas, vermifugação, check-ups e mais."
              />
            ) : (
              <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ChatBubble message={item} />}
                style={{ flex: 1 }}
                contentContainerStyle={styles.listContent}
              />
            )}
          </ImageBackground>
        )}

        <View style={styles.quickWrap}>
          <FlatList
            horizontal
            data={QUICK_REPLIES}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.quickBtn} onPress={() => send(item.key)} activeOpacity={0.75}>
                <Text style={styles.quickText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickList}
          />
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Digite sua dúvida..."
            placeholderTextColor={Colors.textLight}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => send()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || createMutation.isPending) && styles.sendBtnOff]}
            onPress={() => send()}
            disabled={!input.trim() || createMutation.isPending}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={input.trim() ? [Colors.primaryDark, Colors.primary] : [Colors.border, Colors.border]}
              style={styles.sendBtnGrad}
            >
              <Ionicons name="send" size={18} color={input.trim() ? Colors.white : Colors.textLight} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.gradientEnd },

  header: { paddingHorizontal: 16, paddingVertical: 12 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  aiAvatarImg: { width: 38, height: 38 },
  headerTitle: { fontSize: 15, fontWeight: '800', color: Colors.white },
  headerNote: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  petPicker: { gap: 8, marginTop: 12 },
  petChip: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  petChipActive: { backgroundColor: Colors.white },
  petChipText: { fontSize: 12, fontWeight: '700', color: Colors.white },
  petChipTextActive: { color: Colors.primary },

  list: { flex: 1, backgroundColor: '#EDE8F5' },
  listContent: { paddingVertical: 16 },

  quickWrap: { backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border, paddingVertical: 8 },
  quickList: { paddingHorizontal: 12, gap: 8 },
  quickBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
  },
  quickText: { fontSize: 12, color: Colors.primary, fontWeight: '700' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sendBtn: { borderRadius: 24, overflow: 'hidden' },
  sendBtnOff: { opacity: 0.5 },
  sendBtnGrad: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
});
