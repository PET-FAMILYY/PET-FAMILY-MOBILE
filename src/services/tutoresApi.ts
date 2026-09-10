import { api } from './api';
import type { Page, TutorRequest, TutorResponse } from '../types/api';

export const listTutores = async (params: { nome?: string; page?: number; size?: number } = {}): Promise<Page<TutorResponse>> => {
  const res = await api.get<Page<TutorResponse>>('/tutores', { params });
  return res.data;
};

export const getTutor = async (id: number): Promise<TutorResponse> => {
  const res = await api.get<TutorResponse>(`/tutores/${id}`);
  return res.data;
};

export const updateTutor = async (id: number, data: TutorRequest): Promise<TutorResponse> => {
  const res = await api.put<TutorResponse>(`/tutores/${id}`, data);
  return res.data;
};

export const deleteTutor = async (id: number): Promise<void> => {
  await api.delete(`/tutores/${id}`);
};
