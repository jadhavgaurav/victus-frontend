import React from 'react';

export type SettingsTabId = 'voice' | 'privacy' | 'tools' | 'ui';

interface SettingsTabsProps {
  activeTab: SettingsTabId;
  onChange: (tab: SettingsTabId) => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onChange }) => {
  const tabs: { id: SettingsTabId; label: string }[] = [
    { id: 'voice', label: 'Voice' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'tools', label: 'Tools & Permissions' },
    { id: 'ui', label: 'Session & UI' },
  ];

  return (
    <div className="flex border-b border-white/10 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === tab.id
              ? 'text-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          )}
        </button>
      ))}
    </div>
  );
};
