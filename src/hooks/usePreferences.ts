import { useCallback, useEffect, useState } from 'react';
import { PreferencesRepository } from '@/repositories';
import type { UserPreferences } from '@/models';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const prefs = await PreferencesRepository.get();
    setPreferences(prefs);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(async (changes: Partial<UserPreferences>) => {
    const updated = await PreferencesRepository.update(changes);
    setPreferences(updated);
    return updated;
  }, []);

  return { preferences, isLoading, refresh, update };
}
