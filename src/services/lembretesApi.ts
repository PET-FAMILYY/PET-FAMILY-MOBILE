import { api } from './api';
import type { LembreteRequest, LembreteResponse, Page, StatusLembrete } from '../types/api';

export interface ListLembretesParams {
  status?: StatusLembrete;
  page?: number;
  size?: number;
}

export const listLembretes = async (params: ListLembretesParams = {}): Promise<Page<LembreteResponse>> => {
  const res = await api.get<Page<LembreteResponse>>('/lembretes', { params });
  return res.data;
};

export const listMeusLembretes = async (): Promise<LembreteResponse[]> => {
  const res = await api.get<LembreteResponse[]>('/lembretes/meus');
  return res.data;
};

export const listPendentesDoPet = async (petId: number): Promise<LembreteResponse[]> => {
  const res = await api.get<LembreteResponse[]>(`/lembretes/pet/${petId}/pendentes`);
  return res.data;
};

export const getLembrete = async (id: number): Promise<LembreteResponse> => {
  const res = await api.get<LembreteResponse>(`/lembretes/${id}`);
  return res.data;
};

export const createLembrete = async (data: LembreteRequest): Promise<LembreteResponse> => {
  const res = await api.post<LembreteResponse>('/lembretes', data);
  return res.data;
};

export const updateLembrete = async (id: number, data: LembreteRequest): Promise<LembreteResponse> => {
  const res = await api.put<LembreteResponse>(`/lembretes/${id}`, data);
  return res.data;
};

export const deleteLembrete = async (id: number): Promise<void> => {
  await api.delete(`/lembretes/${id}`);
};

export const concluirLembrete = async (id: number): Promise<LembreteResponse> => {
  const res = await api.post<LembreteResponse>(`/lembretes/${id}/concluir`);
  return res.data;
};

export const cancelarLembrete = async (id: number): Promise<LembreteResponse> => {
  const res = await api.post<LembreteResponse>(`/lembretes/${id}/cancelar`);
  return res.data;
};
