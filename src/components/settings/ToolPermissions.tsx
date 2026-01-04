
import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { toolCatalog, categoryLabels } from './toolCatalog';
import type { ToolDefinition } from './toolCatalog';
import { Shield } from 'lucide-react';

export const ToolPermissions: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  if (!settings) return null;

  const { tools } = settings;

  const handleScopeChange = (toolId: string, enabled: boolean) => {
    // If enabling a high risk tool, we could show a warning here too, but distinct from store audio logic.
    // Backend can reject this. Optimistic update handles the switch toggle visually.
    updateSettings({
      tools: {
        scopes: { ...tools.scopes, [toolId]: enabled }
      }
    });
  };

  const handlePolicyChange = (toolId: string, policy: 'allow' | 'confirm' | 'deny') => {
    updateSettings({
      tools: {
        confirmation_policy: { ...tools.confirmation_policy, [toolId]: policy }
      }
    });
  };

  // Group tools
  const groupedTools = toolCatalog.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, ToolDefinition[]>);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-medium text-white mb-1">Tool Permissions</h3>
        <p className="text-sm text-gray-400">Manage what capabilities the assistant can access.</p>
      </div>

      {/* Permissions Table */}
      <div className="space-y-6">
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category} className="bg-gray-800/20 rounded-lg border border-white/5 overflow-hidden">
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Shield size={16} className="text-cyan-500" />
                <h4 className="font-medium text-white text-sm">{categoryLabels[category]}</h4>
            </div>
            
            <div className="divide-y divide-white/5">
                {categoryTools.map(tool => {
                    // Improved Logic:
                    // We render toggle state based on `tools.scopes[tool.id]`.
                    // If it's undefined, we default to TRUE for UI render, unless we know it's strict.
                    const isScopeActive = tools.scopes[tool.id] !== false;
                    
                    const currentPolicy = tools.confirmation_policy[tool.id] || 'confirm';

                    return (
                        <div key={tool.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-white">{tool.name}</span>
                                    {tool.riskLevel === 'high' && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/20">
                                            HIGH RISK
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{tool.description}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Confirmation Policy Dropdown */}
                                <select
                                    disabled={!isScopeActive}
                                    value={currentPolicy}
                                    onChange={(e) => handlePolicyChange(tool.id, e.target.value as any)}
                                    className="bg-gray-900 border border-gray-700 text-xs text-white rounded px-2 py-1.5 focus:border-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <option value="allow">Always Allow</option>
                                    <option value="confirm">Ask Confirmation</option>
                                    <option value="deny">Always Deny</option>
                                </select>

                                {/* Scope Toggle */}
                                <button
                                    onClick={() => handleScopeChange(tool.id, !isScopeActive)}
                                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                                        isScopeActive ? 'bg-cyan-600' : 'bg-gray-700'
                                    }`}
                                >
                                     <span
                                        className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                            isScopeActive ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
