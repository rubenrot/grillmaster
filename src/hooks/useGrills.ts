import { useCallback, useEffect, useState } from 'react';
import { GrillRepository } from '@/repositories';
import type { Grill } from '@/models';

export function useGrills() {
  const [grills, setGrills] = useState<Grill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const all = await GrillRepository.listAll();
    setGrills(all);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { grills, isLoading, refresh };
}
