import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { isValidEmail } from '../../src/utils/validators';
import { useRegisterMutation } from '../../src/hooks/useAuthMutations';
import { ApiError } from '../../src/services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string; email?: string; password?: string; confirm?: string; general?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Nome obrigatório';
    if (!email.trim()) e.email = 'E-mail obrigatório';
    else if (!isValidEmail(email)) e.email = 'E-mail inválido';
    if (!password) e.password = 'Senha obrigatória';
    else if (password.length < 6) e.password = 'Mínimo de 6 caracteres';
    if (!confirm) e.confirm = 'Confirmação obrigatória';
    else if (confirm !== password) e.confirm = 'As senhas não coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = () => {
    if (!validate() || registerMutation.isPending) return;
    registerMutation.mutate(
      {
        nome: name.trim(),
        email: email.trim().toLowerCase(),
        senha: password,
        telefone: phone.trim() || undefined,
      },
      {
        onError: (err) => {
          const message = err instanceof ApiError ? err.message : 'Não foi possível concluir o cadastro.';
          setErrors({ general: message });
        },
      }
    );
  };

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    icon: string,
    placeholder: string,
    error?: string,
    extra?: {
      secure?: boolean;
      show?: boolean;
      toggleShow?: () => void;
      keyboardType?: any;
    }
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error ? styles.inputError : null]}>
        <Ionicons name={icon as any} size={20} color={Colors.textLight} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          value={value}
          onChangeText={v => {
            onChange(v);
            setErrors(p => ({ ...p, general: undefined }));
          }}
          secureTextEntry={extra?.secure && !extra?.show}
          keyboardType={extra?.keyboardType ?? 'default'}
          autoCapitalize={extra?.keyboardType === 'email-address' ? 'none' : 'words'}
          autoCorrect={false}
        />
        {extra?.toggleShow && (
          <TouchableOpacity onPress={extra.toggleShow} style={styles.eyeBtn}>
            <Ionicons
              name={extra.show ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para começar a cuidar do seu pet</Text>

          {errors.general && (
            <View style={styles.generalError}>
              <Ionicons name="alert-circle" size={16} color={Colors.errorRed} />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          )}

          {field('Nome completo', name, setName, 'person-outline', 'Seu nome', errors.name)}
          {field('E-mail', email, setEmail, 'mail-outline', 'seu@email.com', errors.email, {
            keyboardType: 'email-address',
          })}
          {field('Telefone (opcional)', phone, setPhone, 'call-outline', '(11) 99999-0000', undefined, {
            keyboardType: 'phone-pad',
          })}
          {field('Senha', password, setPassword, 'lock-closed-outline', 'Mínimo 6 caracteres', errors.password, {
            secure: true,
            show: showPassword,
            toggleShow: () => setShowPassword(p => !p),
          })}
          {field('Confirmar senha', confirm, setConfirm, 'lock-closed-outline', 'Repita a senha', errors.confirm, {
            secure: true,
            show: showConfirm,
            toggleShow: () => setShowConfirm(p => !p),
          })}

          <Text style={styles.hint}>
            O cadastro público cria uma conta do tipo Tutor. Contas de veterinário são provisionadas pela clínica.
          </Text>

          <TouchableOpacity
            style={[styles.btn, registerMutation.isPending && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={registerMutation.isPending}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>{registerMutation.isPending ? 'Cadastrando...' : 'Cadastrar'}</Text>
          </TouchableOpacity>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.link}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40 },

  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  logo: { width: 100, height: 100 },

  title: { fontSize: 26, fontWeight: '900', color: Colors.text, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: 28 },

  generalError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
  },
  generalErrorText: { fontSize: 13, color: Colors.errorRed, flex: 1 },

  label: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8, marginTop: 8 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 4,
  },
  inputError: { borderColor: Colors.errorRed },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  eyeBtn: { padding: 4 },
  errorText: { fontSize: 12, color: Colors.errorRed, marginBottom: 4, marginLeft: 4 },

  hint: { fontSize: 12, color: Colors.textLight, marginTop: 8, lineHeight: 17 },

  btn: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 17, fontWeight: '800', color: Colors.white },

  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  linkText: { fontSize: 14, color: Colors.textSecondary },
  link: { fontSize: 14, fontWeight: '800', color: Colors.primary },
});
