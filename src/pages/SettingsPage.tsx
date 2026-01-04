import React, { useState } from 'react';
import { SettingsTabs } from '../components/settings/SettingsTabs';
import type { SettingsTabId } from '../components/settings/SettingsTabs';
import { VoiceSettings } from '../components/settings/VoiceSettings';
import { PrivacySettings } from '../components/settings/PrivacySettings';
import { ToolPermissions } from '../components/settings/ToolPermissions';
import { UiSettings } from '../components/settings/UiSettings';
import { useSettings } from '../context/SettingsContext';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('voice');
  const { isLoading, error, resetSettings } = useSettings();

  // Parse query param to set initial tab if needed (optional polish)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['voice', 'privacy', 'tools', 'ui'].includes(tab)) {
        setActiveTab(tab as SettingsTabId);
    }
  }, []);

  // Update URL on tab change without reload
  const handleTabChange = (tab: SettingsTabId) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
  };

  const handleReset = async () => {
      if (confirm(`Are you sure you want to reset ${activeTab} settings to default?`)) {
          await resetSettings(activeTab);
      }
  };

  if (error) {
    return (
        <div className="p-8 text-center text-red-400">
            <h2 className="text-xl font-bold mb-2">Error Loading Settings</h2>
            <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-gray-400">Manage your workspace preferences and permissions.</p>
          </div>
          <button 
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors underline"
          >
            Reset {activeTab} defaults
          </button>
        </header>

        <SettingsTabs activeTab={activeTab} onChange={handleTabChange} />

        <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 min-h-[400px]">
           {isLoading && !error ? (
               <div className="flex items-center justify-center h-full">
                   <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
               </div>
           ) : (
               <>
                {activeTab === 'voice' && <VoiceSettings />}
                {activeTab === 'privacy' && <PrivacySettings />}
                {activeTab === 'tools' && <ToolPermissions />}
                {activeTab === 'ui' && <UiSettings />}
               </>
           )}
        </div>
      </div>
    </div>
  );
};
