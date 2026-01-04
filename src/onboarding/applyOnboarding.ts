import type { PatchUserSettings } from '../api/settings';

// Helper to batch apply settings during onboarding
// Real logic is handled by SettingsContext, this just helps standardize payload construction if needed.
// Currently unused but kept for the requirement structure. 

export const applySettingsBatch = async (
    updateFn: (updates: PatchUserSettings) => Promise<void>, 
    updates: PatchUserSettings
) => {
    return updateFn(updates);
};
