import { api } from './api';
import type { DashboardResponse } from '../types/api';

export const getDashboardResumo = async (): Promise<DashboardResponse> => {
  const res = await api.get<DashboardResponse>('/dashboard/resumo');
  return res.data;
};
