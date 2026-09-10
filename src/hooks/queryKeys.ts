import type { ListConsultasParams } from '../services/consultasApi';
import type { ListLembretesParams } from '../services/lembretesApi';
import type { ListPetsParams } from '../services/petsApi';

export const queryKeys = {
  pets: {
    all: ['pets'] as const,
    list: (params: ListPetsParams = {}) => ['pets', 'list', params] as const,
    detail: (id: number) => ['pets', 'detail', id] as const,
  },
  lembretes: {
    all: ['lembretes'] as const,
    list: (params: ListLembretesParams = {}) => ['lembretes', 'list', params] as const,
    meus: ['lembretes', 'meus'] as const,
    pendentesDoPet: (petId: number) => ['lembretes', 'pendentes', petId] as const,
    detail: (id: number) => ['lembretes', 'detail', id] as const,
  },
  consultas: {
    all: ['consultas'] as const,
    list: (params: ListConsultasParams = {}) => ['consultas', 'list', params] as const,
    futuras: ['consultas', 'futuras'] as const,
    detail: (id: number) => ['consultas', 'detail', id] as const,
  },
  tutores: {
    all: ['tutores'] as const,
    detail: (id: number) => ['tutores', 'detail', id] as const,
  },
  dashboard: ['dashboard'] as const,
  interacoesIA: {
    doPet: (petId: number) => ['interacoesIA', 'pet', petId] as const,
  },
};
