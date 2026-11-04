import { useMemo } from 'react';
import { useAuth } from '../providers/AuthProvider';
import type { LembreteResponse } from '../types/api';
import { agruparLembretes } from '../utils/lembretes';
import { useLembretesQuery, useMeusLembretesQuery } from './useLembretes';

// Lembretes da tela de agenda: o veterinario ve os de todos os pets, o tutor so os seus.
export const useAgendaLembretes = () => {
  const { isVeterinario } = useAuth();
  const tutorQuery = useMeusLembretesQuery(!isVeterinario);
  const vetQuery = useLembretesQuery({ size: 50 }, isVeterinario);
  const activeQuery = isVeterinario ? vetQuery : tutorQuery;

  const lembretes: LembreteResponse[] = isVeterinario
    ? (vetQuery.data?.content ?? [])
    : (tutorQuery.data ?? []);
  const grupos = useMemo(() => agruparLembretes(lembretes), [lembretes]);

  return {
    ...grupos,
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    isRefetching: activeQuery.isRefetching,
    refetch: activeQuery.refetch,
  };
};
