
import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const VoiceSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  if (!settings) return null;

  const { voice } = settings;

  const handleChange = (key: keyof typeof voice, value: any) => {
    updateSettings({
      voice: { [key]: value },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-medium text-white mb-1">Voice & Input Preferences</h3>
        <p className="text-sm text-gray-400">Configure how you interact with VICTUS.</p>
      </div>

      {/* Preferred Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-300">Preferred Input Mode</label>
        <div className="flex gap-4">
          <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
            voice.preferred_input === 'text' 
              ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-100' 
              : 'bg-gray-800/30 border-white/5 text-gray-400 hover:bg-gray-800/50'
          }`}>
            <input
              type="radio"
              name="preferred_input"
              value="text"
              checked={voice.preferred_input === 'text'}
              onChange={() => handleChange('preferred_input', 'text')}
              className="hidden"
            />
            <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                {voice.preferred_input === 'text' && <div className="w-2 h-2 rounded-full bg-current" />}
            </div>
            <span>Text Interface</span>
          </label>
          <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
            voice.preferred_input === 'voice' 
              ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-100' 
              : 'bg-gray-800/30 border-white/5 text-gray-400 hover:bg-gray-800/50'
          }`}>
            <input
              type="radio"
              name="preferred_input"
              value="voice"
              checked={voice.preferred_input === 'voice'}
              onChange={() => handleChange('preferred_input', 'voice')}
              className="hidden"
            />
             <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                {voice.preferred_input === 'voice' && <div className="w-2 h-2 rounded-full bg-current" />}
            </div>
            <span>Voice Interface</span>
          </label>
        </div>
      </div>

      {/* Mic Default */}
      <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-white/5">
        <div>
          <h4 className="font-medium text-white">Default Microphone State</h4>
          <p className="text-xs text-gray-400 mt-1">Start microphone automatically when entering voice mode?</p>
        </div>
        <button
          onClick={() => handleChange('mic_default', !voice.mic_default)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            voice.mic_default ? 'bg-cyan-600' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              voice.mic_default ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Auto EOU */}
      <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-white/5">
        <div>
          <h4 className="font-medium text-white">Auto End-of-Utterance</h4>
          <p className="text-xs text-gray-400 mt-1">Automatically send message when you stop speaking (VAD).</p>
        </div>
        <button
          onClick={() => handleChange('auto_end_of_utterance', !voice.auto_end_of_utterance)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            voice.auto_end_of_utterance ? 'bg-cyan-600' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              voice.auto_end_of_utterance ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* VAD Sensitivity */}
        <div className="space-y-3">
            <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">VAD Sensitivity: {voice.vad_sensitivity}</label>
                <span className="text-xs text-gray-500">
                    {voice.vad_sensitivity < 0.4 ? 'Low (Needs louder speech)' : voice.vad_sensitivity > 0.7 ? 'High (Detects whispers)' : 'Balanced'}
                </span>
            </div>
            <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={voice.vad_sensitivity}
                onChange={(e) => handleChange('vad_sensitivity', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-gray-500 uppercase tracking-widest">
                <span>Passsive</span>
                <span>Responsive</span>
            </div>
        </div>

        {/* Chunk Size */}
        <div className="space-y-3">
             <label className="text-sm font-medium text-gray-300">Audio Chunk Size</label>
             <select
                value={voice.chunk_ms}
                onChange={(e) => handleChange('chunk_ms', parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
             >
                 <option value="100">100ms (Low Latency)</option>
                 <option value="200">200ms (Standard)</option>
                 <option value="300">300ms (High Stability)</option>
                 <option value="500">500ms (Network Friendly)</option>
             </select>
             <p className="text-xs text-gray-500">Smaller chunks reduce latency but require stable connection.</p>
        </div>
      </div>
    </div>
  );
};
