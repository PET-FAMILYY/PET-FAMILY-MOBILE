import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as interacoesIaApi from '../services/interacoesIaApi';
import type { InteracaoIARequest } from '../types/api';
import { queryKeys } from './queryKeys';

export const useInteracoesDoPetQuery = (petId: number | undefined) =>
  useQuery({
    queryKey: queryKeys.interacoesIA.doPet(petId ?? -1),
    queryFn: () => interacoesIaApi.listInteracoesDoPet(petId as number),
    enabled: petId != null,
  });

export const useCreateInteracaoIAMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InteracaoIARequest) => interacoesIaApi.criarInteracaoIA(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interacoesIA.doPet(created.petId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};
