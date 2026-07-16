'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { defaultSiteSettings, normalizeSettings } from '@/lib/siteSettings';

const SiteSettingsContext = createContext(null);

const noopSetSettings = () => {};
const noopRefresh = async () => {};

export function SiteSettingsProvider({ children, initialSettings }) {
  const [settings, setSettings] = useState(initialSettings || defaultSiteSettings);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getSettings();
      setSettings(normalizeSettings(data.settings));
    } catch {
      // keep current settings on failure
    }
  }, []);

  const value = useMemo(
    () => ({ settings, setSettings, refresh }),
    [settings, refresh]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    return {
      settings: defaultSiteSettings,
      setSettings: noopSetSettings,
      refresh: noopRefresh,
    };
  }
  return ctx;
}
