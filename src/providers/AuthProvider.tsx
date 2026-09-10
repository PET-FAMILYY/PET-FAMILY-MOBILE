import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useQueryClient } from '@tanstack/react-query';
import { setAuthToken, setUnauthorizedHandler } from '../services/api';
import * as authApi from '../services/authApi';
import type { LoginResponse, RegistroRequest, Role, UsuarioResponse } from '../types/api';

const TOKEN_KEY = 'petfamily.token';

interface AuthUser {
  usuarioId: number;
  email: string;
  nome: string;
  role: Role;
  tutorId: number | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVeterinario: boolean;
  isTutor: boolean;
  sessionExpired: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (data: RegistroRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const toAuthUser = (data: LoginResponse | UsuarioResponse): AuthUser => ({
  usuarioId: data.usuarioId,
  email: data.email,
  nome: data.nome,
  role: data.role,
  tutorId: data.tutorId,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const queryClient = useQueryClient();

  const clearSession = useCallback(
    async (expired = false) => {
      setAuthToken(null);
      setUser(null);
      if (expired) setSessionExpired(true);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      queryClient.clear();
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    await queryClient.cancelQueries();
    await clearSession(false);
  }, [clearSession, queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession(true);
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!token) return;
        setAuthToken(token);
        const me = await authApi.me();
        setUser(toAuthUser(me));
      } catch {
        await clearSession(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persistSession = async (data: LoginResponse) => {
    setAuthToken(data.token);
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    setSessionExpired(false);
    setUser(toAuthUser(data));
  };

  const login = useCallback(async (email: string, senha: string) => {
    const data = await authApi.login({ email, senha });
    await persistSession(data);
  }, []);

  const register = useCallback(async (payload: RegistroRequest) => {
    const data = await authApi.registrar(payload);
    await persistSession(data);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isVeterinario: user?.role === 'VETERINARIO',
    isTutor: user?.role === 'TUTOR',
    sessionExpired,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
