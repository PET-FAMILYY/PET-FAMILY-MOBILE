import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from '../services/dashboardApi';
import { queryKeys } from './queryKeys';

export const useDashboardQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => dashboardApi.getDashboardResumo(),
    enabled,
  });
