import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { CompanySettings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  return settings;
}
