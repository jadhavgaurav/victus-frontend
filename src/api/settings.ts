import { apiClient } from './client';

export interface VoiceSettings {
  mic_default: boolean;
  auto_end_of_utterance: boolean;
  vad_sensitivity: number;
  chunk_ms: number;
  preferred_input: 'text' | 'voice';
}

export interface PrivacySettings {
  store_transcripts: boolean;
  store_audio: boolean;
  retention_days: number;
  show_redaction_markers: boolean;
}

export interface ToolSettings {
  scopes: Record<string, boolean>;
  confirmation_policy: Record<string, 'allow' | 'confirm' | 'deny'>;
}

export interface UiSettings {
  history_poll_interval_ms: number;
  show_observability_panel: boolean;
  compact_mode: boolean;
  onboarding_completed?: boolean;
}

export interface UserSettings {
  voice: VoiceSettings;
  privacy: PrivacySettings;
  tools: ToolSettings;
  ui: UiSettings;
}

export interface PatchUserSettings {
  voice?: Partial<VoiceSettings>;
  privacy?: Partial<PrivacySettings>;
  tools?: Partial<ToolSettings>;
  ui?: Partial<UiSettings>;
}

export const settingsApi = {
  getSettings: async (): Promise<UserSettings> => {
    const response = await apiClient.get<UserSettings>('/settings');
    return response.data;
  },

  updateSettings: async (settings: PatchUserSettings): Promise<UserSettings> => {
    const response = await apiClient.patch<UserSettings>('/settings', settings);
    return response.data;
  },
};
