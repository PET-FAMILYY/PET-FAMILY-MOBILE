import { api } from './api';
import type {
  AgendarConsultaRequest,
  ConsultaResponse,
  Page,
  RealizarConsultaRequest,
  StatusConsulta,
} from '../types/api';

export interface ListConsultasParams {
  status?: StatusConsulta;
  page?: number;
  size?: number;
}

export const listConsultas = async (params: ListConsultasParams = {}): Promise<Page<ConsultaResponse>> => {
  const res = await api.get<Page<ConsultaResponse>>('/consultas', { params });
  return res.data;
};

export const listConsultasFuturas = async (params: { page?: number; size?: number } = {}): Promise<Page<ConsultaResponse>> => {
  const res = await api.get<Page<ConsultaResponse>>('/consultas/futuras', { params });
  return res.data;
};

export const getConsulta = async (id: number): Promise<ConsultaResponse> => {
  const res = await api.get<ConsultaResponse>(`/consultas/${id}`);
  return res.data;
};

export const agendarConsulta = async (data: AgendarConsultaRequest): Promise<ConsultaResponse> => {
  const res = await api.post<ConsultaResponse>('/consultas/agendar', data);
  return res.data;
};

export const cancelarConsulta = async (id: number): Promise<ConsultaResponse> => {
  const res = await api.post<ConsultaResponse>(`/consultas/${id}/cancelar`);
  return res.data;
};

export const realizarConsulta = async (id: number, data: RealizarConsultaRequest): Promise<ConsultaResponse> => {
  const res = await api.post<ConsultaResponse>(`/consultas/${id}/realizar`, data);
  return res.data;
};
