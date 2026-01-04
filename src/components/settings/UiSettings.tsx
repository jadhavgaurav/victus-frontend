
import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const UiSettings: React.FC = () => {
    const { settings, updateSettings } = useSettings();

    if (!settings) return null;

    const { ui } = settings;

    const handleChange = (key: keyof typeof ui, value: any) => {
        updateSettings({
            ui: { [key]: value },
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-lg font-medium text-white mb-1">Interface & Performance</h3>
                <p className="text-sm text-gray-400">Customize the VICTUS console appearance and behavior.</p>
            </div>

            {/* History Polling */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Session Refresh Rate</label>
                <select
                    value={ui.history_poll_interval_ms}
                    onChange={(e) => handleChange('history_poll_interval_ms', parseInt(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
                >
                    <option value="1000">1 Second (Fastest)</option>
                    <option value="2000">2 Seconds (Balanced)</option>
                    <option value="5000">5 Seconds (Low Bandwidth)</option>
                    <option value="10000">10 Seconds (Very Slow)</option>
                </select>
                <p className="text-xs text-gray-500">How often the interface checks for new messages and tool updates.</p>
            </div>

             {/* Observability Panel */}
            <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-white/5">
                <div>
                    <h4 className="font-medium text-white">Observability Panel</h4>
                    <p className="text-xs text-gray-400 mt-1">Show session ID, request traces, and latency stats overlay.</p>
                </div>
                <button
                    onClick={() => handleChange('show_observability_panel', !ui.show_observability_panel)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                        ui.show_observability_panel ? 'bg-cyan-600' : 'bg-gray-700'
                    }`}
                >
                    <span
                        className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            ui.show_observability_panel ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-white/5">
                <div>
                    <h4 className="font-medium text-white">Compact Mode</h4>
                    <p className="text-xs text-gray-400 mt-1">Reduce spacing in chat view for higher information density.</p>
                </div>
                 <button
                    onClick={() => handleChange('compact_mode', !ui.compact_mode)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                        ui.compact_mode ? 'bg-cyan-600' : 'bg-gray-700'
                    }`}
                >
                    <span
                        className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            ui.compact_mode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
        </div>
    );
};
