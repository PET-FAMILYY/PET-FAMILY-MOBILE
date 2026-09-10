import { api } from './api';
import type { LoginRequest, LoginResponse, RegistroRequest, UsuarioResponse } from '../types/api';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', data);
  return res.data;
};

export const registrar = async (data: RegistroRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/registrar', data);
  return res.data;
};

export const me = async (): Promise<UsuarioResponse> => {
  const res = await api.get<UsuarioResponse>('/auth/me');
  return res.data;
};
