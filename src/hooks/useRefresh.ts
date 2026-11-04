import { useCallback, useRef, useState } from 'react';

type Refetch = () => Promise<unknown>;

// Estado do pull-to-refresh para telas que precisam recarregar mais de uma query de uma vez.
export const useRefresh = (...refetchers: Refetch[]) => {
  const [refreshing, setRefreshing] = useState(false);
  const refetchersRef = useRef(refetchers);
  refetchersRef.current = refetchers;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(refetchersRef.current.map((refetch) => refetch()));
    } finally {
      setRefreshing(false);
    }
  }, []);

  return { refreshing, onRefresh };
};
