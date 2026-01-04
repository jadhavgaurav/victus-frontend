import React, { useState } from 'react';
import { Mic, Keyboard, Eraser, FileText, Eye } from 'lucide-react';
import { clsx } from 'clsx';
import { useSettings } from '../../context/SettingsContext';

interface Step2Props {
    onNext: () => void;
}

export const Step2Preferences: React.FC<Step2Props> = ({ onNext }) => {
    const { updateSettings } = useSettings();
    const [loading, setLoading] = useState(false);
    
    // Local state for Step 2
    const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
    const [retentionDays, setRetentionDays] = useState(30);
    const [storeTranscripts, setStoreTranscripts] = useState(true);
    const [showRedaction, setShowRedaction] = useState(true);

    const handleNext = async () => {
        setLoading(true);
        try {
            // Apply these specific settings via helper or direct context update
            // Since we established settings context, we can just use that directly
            // but requirements mentioned applyOnboarding.ts helper. We will implement it
            // but for simple sync updates, direct context call is cleaner locally 
            // unless we had intricate mapping. 
            // Mapping:
            // voice.preferred_input
            // privacy.retention_days
            // privacy.store_transcripts
            // privacy.show_redaction_markers
            
            await updateSettings({
                voice: { preferred_input: inputMode },
                privacy: {
                    retention_days: retentionDays,
                    store_transcripts: storeTranscripts,
                    show_redaction_markers: showRedaction
                }
            });

            onNext();
        } catch (err) {
            console.error("Failed to save step 2", err);
            // Ideally show UI error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Configure Privacy & Input</h2>
                <p className="text-gray-400 text-sm">Choose how you interact and how long we keep data.</p>
            </div>

            <div className="space-y-4">
                
                {/* Input Mode */}
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setInputMode('text')}
                        className={clsx(
                            "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                            inputMode === 'text' 
                                ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                                : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700"
                        )}
                    >
                        <Keyboard size={18} />
                        <span className="text-sm font-bold">Text (Default)</span>
                    </button>
                    <button 
                         onClick={() => setInputMode('voice')}
                         className={clsx(
                            "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                            inputMode === 'voice' 
                                ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                                : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700"
                        )}
                    >
                        <Mic size={18} />
                        <span className="text-sm font-bold">Voice</span>
                    </button>
                </div>

                {/* Privacy Settings Group */}
                <div className="bg-gray-900/40 rounded-lg p-5 border border-gray-800 space-y-6">
                    
                    {/* Retention */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-300">
                             <Eraser size={16} className="text-gray-500" />
                             <span className="text-sm font-medium">Data Retention</span>
                        </div>
                        <div className="flex gap-2">
                            {[7, 14, 30, 90].map(days => (
                                <button
                                    key={days}
                                    onClick={() => setRetentionDays(days)}
                                    className={clsx(
                                        "flex-1 py-1.5 rounded text-xs font-bold border transition-colors",
                                        retentionDays === days 
                                            ? "bg-cyan-600 text-white border-cyan-500" 
                                            : "bg-gray-950 text-gray-500 border-gray-800 hover:border-gray-700"
                                    )}
                                >
                                    {days}d
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Transcripts toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText size={18} className="text-gray-500" />
                            <div className="text-sm">
                                <p className="text-gray-300 font-medium">Store Transcripts</p>
                                <p className="text-gray-500 text-xs text-opacity-80">Save chat history for timeline</p>
                            </div>
                        </div>
                        <Toggle checked={storeTranscripts} onChange={setStoreTranscripts} />
                    </div>

                    {/* Redaction toggle */}
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Eye size={18} className="text-gray-500" />
                            <div className="text-sm">
                                <p className="text-gray-300 font-medium">Redaction Markers</p>
                                <p className="text-gray-500 text-xs text-opacity-80">Show where sensitive data was hidden</p>
                            </div>
                        </div>
                        <Toggle checked={showRedaction} onChange={setShowRedaction} />
                    </div>
                </div>

            </div>

            <button 
                onClick={handleNext}
                disabled={loading}
                className="w-full py-3 rounded-lg font-bold text-sm uppercase tracking-widest bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-wait"
            >
                {loading ? 'Saving...' : 'Next Step'}
            </button>
        </div>
    );
};

// Simple Toggle Component
const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
    <button 
        onClick={() => onChange(!checked)}
        className={clsx(
            "w-11 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500/50",
            checked ? "bg-cyan-600" : "bg-gray-700"
        )}
    >
        <span className={clsx(
            "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
        )} />
    </button>
);
