import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as lembretesApi from '../services/lembretesApi';
import type { ListLembretesParams } from '../services/lembretesApi';
import type { LembreteRequest } from '../types/api';
import { queryKeys } from './queryKeys';

export const useLembretesQuery = (params: ListLembretesParams = {}, enabled = true) =>
  useQuery({
    queryKey: queryKeys.lembretes.list(params),
    queryFn: () => lembretesApi.listLembretes(params),
    enabled,
  });

export const useMeusLembretesQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.lembretes.meus,
    queryFn: () => lembretesApi.listMeusLembretes(),
    enabled,
  });

export const useLembreteQuery = (id: number | undefined) =>
  useQuery({
    queryKey: queryKeys.lembretes.detail(id ?? -1),
    queryFn: () => lembretesApi.getLembrete(id as number),
    enabled: id != null && !Number.isNaN(id),
  });

export const useLembretesPendentesDoPetQuery = (petId: number | undefined) =>
  useQuery({
    queryKey: queryKeys.lembretes.pendentesDoPet(petId ?? -1),
    queryFn: () => lembretesApi.listPendentesDoPet(petId as number),
    enabled: petId != null,
  });

const invalidateLembretes = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.lembretes.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
};

export const useCreateLembreteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LembreteRequest) => lembretesApi.createLembrete(data),
    onSuccess: () => invalidateLembretes(queryClient),
  });
};

export const useUpdateLembreteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LembreteRequest }) => lembretesApi.updateLembrete(id, data),
    onSuccess: (updated) => {
      invalidateLembretes(queryClient);
      queryClient.setQueryData(queryKeys.lembretes.detail(updated.id), updated);
    },
  });
};

export const useDeleteLembreteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lembretesApi.deleteLembrete(id),
    onSuccess: (_data, id) => {
      invalidateLembretes(queryClient);
      queryClient.removeQueries({ queryKey: queryKeys.lembretes.detail(id) });
    },
  });
};

export const useConcluirLembreteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lembretesApi.concluirLembrete(id),
    onSuccess: () => invalidateLembretes(queryClient),
  });
};

export const useCancelarLembreteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lembretesApi.cancelarLembrete(id),
    onSuccess: () => invalidateLembretes(queryClient),
  });
};
