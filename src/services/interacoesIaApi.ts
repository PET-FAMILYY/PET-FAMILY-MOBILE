import { api } from './api';
import type { InteracaoIARequest, InteracaoIAResponse } from '../types/api';

export const criarInteracaoIA = async (data: InteracaoIARequest): Promise<InteracaoIAResponse> => {
  const res = await api.post<InteracaoIAResponse>('/interacoes-ia', data);
  return res.data;
};

export const listInteracoesDoPet = async (petId: number): Promise<InteracaoIAResponse[]> => {
  const res = await api.get<InteracaoIAResponse[]>(`/interacoes-ia/pet/${petId}`);
  return res.data;
};
