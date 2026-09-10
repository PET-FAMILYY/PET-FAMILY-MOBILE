import { api } from './api';
import type { Page, PetRequest, PetResponse } from '../types/api';

export interface ListPetsParams {
  tutorId?: number;
  especie?: string;
  page?: number;
  size?: number;
}

export const listPets = async (params: ListPetsParams = {}): Promise<Page<PetResponse>> => {
  const res = await api.get<Page<PetResponse>>('/pets', { params });
  return res.data;
};

export const getPet = async (id: number): Promise<PetResponse> => {
  const res = await api.get<PetResponse>(`/pets/${id}`);
  return res.data;
};

export const createPet = async (data: PetRequest): Promise<PetResponse> => {
  const res = await api.post<PetResponse>('/pets', data);
  return res.data;
};

export const updatePet = async (id: number, data: PetRequest): Promise<PetResponse> => {
  const res = await api.put<PetResponse>(`/pets/${id}`, data);
  return res.data;
};

export const deletePet = async (id: number): Promise<void> => {
  await api.delete(`/pets/${id}`);
};
