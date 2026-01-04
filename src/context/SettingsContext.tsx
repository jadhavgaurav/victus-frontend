
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { settingsApi } from '../api/settings';
import type { UserSettings, PatchUserSettings } from '../api/settings';
import { useAuth } from '../auth/AuthContext'; // Assuming AuthContext exists

interface SettingsContextType {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: PatchUserSettings) => Promise<void>;
  resetSettings: (section?: keyof UserSettings) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  voice: {
    mic_default: false,
    auto_end_of_utterance: true,
    vad_sensitivity: 0.6,
    chunk_ms: 200,
    preferred_input: 'text',
  },
  privacy: {
    store_transcripts: true,
    store_audio: false,
    retention_days: 30,
    show_redaction_markers: true,
  },
  tools: {
    scopes: {},
    confirmation_policy: {},
  },
  ui: {
    history_poll_interval_ms: 2000,
    show_observability_panel: false,
    compact_mode: false,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use auth context to only fetch when logged in
  const { user } = useAuth(); // Assuming generic auth hook
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await settingsApi.getSettings();
      setSettings(data);
    } catch (err: any) {
      console.error('Failed to fetch settings:', err);
      // Fallback to defaults or keep null, but don't block app?
      // For now, set error
      setError('Failed to load settings');
      // If we failed to load, maybe set default?
      setSettings(defaultSettings); 
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSettings();
    } else {
      setSettings(null);
    }
  }, [user, fetchSettings]);

  const updateSettings = async (updates: PatchUserSettings) => {
    if (!settings) return;
    
    // Optimistic update
    const previousSettings = { ...settings };
    
    // Deep merge for optimistic state
    const newSettings = JSON.parse(JSON.stringify(settings)) as UserSettings;
    if (updates.voice) Object.assign(newSettings.voice, updates.voice);
    if (updates.privacy) Object.assign(newSettings.privacy, updates.privacy);
    if (updates.tools) Object.assign(newSettings.tools, updates.tools);
    if (updates.ui) Object.assign(newSettings.ui, updates.ui);
    
    setSettings(newSettings);
    
    try {
      const updatedServerSettings = await settingsApi.updateSettings(updates);
      setSettings(updatedServerSettings);
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      setError('Failed to update settings');
      setSettings(previousSettings); // Rollback
      throw err; // Re-throw so UI can show specific error if needed
    }
  };

  const resetSettings = async (section?: keyof UserSettings) => {
    if (!settings) return;
    
    // revert locally to defaults
    const defaults = { ...defaultSettings };
    const current = { ...settings };
    
    let newSettings: UserSettings;
    
    if (section) {
        newSettings = { ...current, [section]: defaults[section] };
    } else {
        newSettings = { ...defaults };
    }
    
    setSettings(newSettings); // Optimistic

    // We need to send this to backend. 
    // Backend PATCH merges, so we need to send the full default object for that section.
    try {
        const updatePayload: PatchUserSettings = {};
        if (section) {
            updatePayload[section] = defaults[section];
        } else {
             updatePayload.voice = defaults.voice;
             updatePayload.privacy = defaults.privacy;
             updatePayload.tools = defaults.tools;
             updatePayload.ui = defaults.ui;
        }
        
        await settingsApi.updateSettings(updatePayload);
    } catch (err) {
        console.error('Failed to reset settings:', err);
        setError('Failed to reset settings');
        setSettings(current); // Rollback
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, error, updateSettings, refreshSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
