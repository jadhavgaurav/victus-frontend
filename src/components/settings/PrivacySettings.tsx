
import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Modal } from '../ui/Modal';
import { AlertTriangle } from 'lucide-react';

export const PrivacySettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [showAudioWarning, setShowAudioWarning] = useState(false);
  const [confirmAudioStorage, setConfirmAudioStorage] = useState(false);

  if (!settings) return null;

  const { privacy } = settings;

  const handleChange = (key: keyof typeof privacy, value: any) => {
    if (key === 'store_audio' && value === true) {
      // Show warning before enabling
      setShowAudioWarning(true);
      setConfirmAudioStorage(false); // Reset confirmation checkbox
      return;
    }

    updateSettings({
      privacy: { [key]: value },
    });
  };

  const confirmEnableAudio = () => {
    if (confirmAudioStorage) {
      updateSettings({
        privacy: { store_audio: true },
      });
      setShowAudioWarning(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-medium text-white mb-1">Privacy & Data Retention</h3>
        <p className="text-sm text-gray-400">Control how your data is stored and displayed.</p>
      </div>

      {/* Store Transcripts */}
      <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-white/5">
        <div>
          <h4 className="font-medium text-white">Store Transcripts</h4>
          <p className="text-xs text-gray-400 mt-1">Keep text logs of conversations for history and search.</p>
        </div>
        <button
          onClick={() => handleChange('store_transcripts', !privacy.store_transcripts)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            privacy.store_transcripts ? 'bg-cyan-600' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              privacy.store_transcripts ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Store Audio */}
      <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-white/5">
        <div>
          <h4 className="font-medium text-white">Store Audio Recordings</h4>
          <p className="text-xs text-gray-400 mt-1">
             {privacy.store_audio 
               ? "Audio is being stored on the server." 
               : "Audio is processed in memory and discarded immediately."}
          </p>
        </div>
        <button
          onClick={() => handleChange('store_audio', !privacy.store_audio)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
             privacy.store_audio ? 'bg-red-600' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
               privacy.store_audio ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Retention Days */}
      <div className="space-y-3">
         <label className="text-sm font-medium text-gray-300">Data Retention Period</label>
         <select
            value={privacy.retention_days}
            onChange={(e) => handleChange('retention_days', parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
         >
             <option value="7">7 Days</option>
             <option value="14">14 Days</option>
             <option value="30">30 Days (Default)</option>
             <option value="90">90 Days</option>
         </select>
         <p className="text-xs text-gray-500">Data older than {privacy.retention_days} days will be deleted automatically.</p>
      </div>

       {/* Redaction Markers */}
       <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-white/5">
        <div>
          <h4 className="font-medium text-white">Show Redaction Markers</h4>
          <p className="text-xs text-gray-400 mt-1">Display placeholders like [PII-REDACTED] in UI.</p>
        </div>
        <button
          onClick={() => handleChange('show_redaction_markers', !privacy.show_redaction_markers)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            privacy.show_redaction_markers ? 'bg-cyan-600' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              privacy.show_redaction_markers ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      
      {/* Warning Modal */}
      <Modal 
        isOpen={showAudioWarning}
        onClose={() => setShowAudioWarning(false)}
        title="Enable Audio Storage?"
      >
        <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={20} />
                <div className="text-sm text-red-100">
                    <p className="font-bold mb-1">High Privacy Risk</p>
                    <p>Storing raw audio recordings significantly increases privacy exposure. Audio may contain background noise, voices of others, or sensitive information.</p>
                </div>
            </div>
            
            <p className="text-sm text-gray-400">
                Only enable this if you are actively debugging voice models or require full audit logs.
            </p>

            <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors">
                <input 
                    type="checkbox" 
                    checked={confirmAudioStorage} 
                    onChange={(e) => setConfirmAudioStorage(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500 bg-gray-700"
                />
                <span className="text-sm text-white select-none">I understand the risks and want to enable audio storage.</span>
            </label>

            <div className="flex justify-end gap-3 mt-6">
                <button 
                    onClick={() => setShowAudioWarning(false)}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={confirmEnableAudio}
                    disabled={!confirmAudioStorage}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Enable Storage
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
