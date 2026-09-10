import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as consultasApi from '../services/consultasApi';
import type { ListConsultasParams } from '../services/consultasApi';
import type { AgendarConsultaRequest, RealizarConsultaRequest } from '../types/api';
import { queryKeys } from './queryKeys';

export const useConsultasQuery = (params: ListConsultasParams = {}) =>
  useQuery({
    queryKey: queryKeys.consultas.list(params),
    queryFn: () => consultasApi.listConsultas(params),
  });

export const useConsultasFuturasQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.consultas.futuras,
    queryFn: () => consultasApi.listConsultasFuturas(),
    enabled,
  });

const invalidateConsultas = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.consultas.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
};

export const useAgendarConsultaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AgendarConsultaRequest) => consultasApi.agendarConsulta(data),
    onSuccess: () => invalidateConsultas(queryClient),
  });
};

export const useCancelarConsultaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => consultasApi.cancelarConsulta(id),
    onSuccess: () => invalidateConsultas(queryClient),
  });
};

export const useRealizarConsultaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RealizarConsultaRequest }) => consultasApi.realizarConsulta(id, data),
    onSuccess: () => invalidateConsultas(queryClient),
  });
};
