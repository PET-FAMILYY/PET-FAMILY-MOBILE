import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as petsApi from '../services/petsApi';
import type { ListPetsParams } from '../services/petsApi';
import type { PetRequest } from '../types/api';
import { queryKeys } from './queryKeys';

export const usePetsQuery = (params: ListPetsParams = {}) =>
  useQuery({
    queryKey: queryKeys.pets.list(params),
    queryFn: () => petsApi.listPets(params),
  });

export const usePetQuery = (id: number | undefined) =>
  useQuery({
    queryKey: queryKeys.pets.detail(id ?? -1),
    queryFn: () => petsApi.getPet(id as number),
    enabled: id != null,
  });

export const useCreatePetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PetRequest) => petsApi.createPet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

export const useUpdatePetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PetRequest }) => petsApi.updatePet(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.setQueryData(queryKeys.pets.detail(updated.id), updated);
    },
  });
};

export const useDeletePetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => petsApi.deletePet(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.removeQueries({ queryKey: queryKeys.pets.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.lembretes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultas.all });
    },
  });
};
