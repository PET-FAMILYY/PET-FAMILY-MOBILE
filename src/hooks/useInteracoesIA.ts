import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as interacoesIaApi from '../services/interacoesIaApi';
import type { InteracaoIARequest } from '../types/api';
import { interacoesParaMensagens } from '../utils/chat';
import { queryKeys } from './queryKeys';

export const useInteracoesDoPetQuery = (petId: number | undefined) =>
  useQuery({
    queryKey: queryKeys.interacoesIA.doPet(petId ?? -1),
    queryFn: () => interacoesIaApi.listInteracoesDoPet(petId as number),
    enabled: petId != null,
  });

// Historico do pet ja convertido em bolhas de conversa para a tela de chat.
export const useChatMessages = (petId: number | undefined) => {
  const query = useInteracoesDoPetQuery(petId);
  const messages = useMemo(() => interacoesParaMensagens(query.data ?? []), [query.data]);
  return { messages, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
};

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
