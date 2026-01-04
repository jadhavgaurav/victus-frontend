import React, { useEffect, useState } from 'react';
// uuid removed
import { postSessionMessage, createSession } from '../../api/sessions';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle, ArrowRight } from 'lucide-react';


export const Step4FirstSuccess: React.FC = () => {
    const { updateSettings } = useSettings();
    const navigate = useNavigate();
    
    // Create session ID once for this step
    const [sessionId, setSessionId] = useState('');
    
    useEffect(() => {
        const init = async () => {
            try {
                const { session_id } = await createSession();
                setSessionId(session_id);
            } catch (e) {
                console.error("Failed to init session for onboarding", e);
            }
        };
        init();
    }, []);
    const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
    const [assistantResponse, setAssistantResponse] = useState<string>('');
    const [finishing, setFinishing] = useState(false);

    const runSafeCommand = async () => {
        setStatus('running');
        try {
            const response = await postSessionMessage(
                sessionId, 
                "Based on my enabled tools and settings, list 5 things you can help me do right now."
            );
            
            // Just displaying the text response for simplified onboarding
            setAssistantResponse(response.assistant_text);
            setStatus('done');
        } catch (err) {
            console.error("Safe command failed", err);
            setAssistantResponse("Failed to connect to agent. But you can still finish setup.");
            setStatus('done');
        }
    };

    const handleFinish = async () => {
        setFinishing(true);
        try {
            await updateSettings({
                ui: {
                    onboarding_completed: true,
                    // onboarding_version: 1 // Handled by backend schema if strict typed or add to generic map if flexible
                } as any 
            });
            navigate('/');
        } catch (err) {
            // Force navigate even if patch fails? Better to retry.
            console.error("Finish failed", err);
            // Fallback for user stuck
            navigate('/'); 
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Launch</h2>
                <p className="text-gray-400 text-sm">Let's verify your setup with a safe first command.</p>
            </div>

            <div className="bg-black/40 border border-gray-800 rounded-lg p-6 min-h-[200px] flex flex-col items-center justify-center text-center">
                {status === 'idle' && (
                    <div className="space-y-4">
                        <p className="text-gray-300 text-sm max-w-xs mx-auto">
                            Click below to ask the agent what it can do with your current permissions.
                        </p>
                        <button 
                            onClick={runSafeCommand}
                            disabled={!sessionId}
                            className={`flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:scale-105 ${!sessionId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Play size={18} fill="currentColor" />
                            Run Safe Command
                        </button>
                    </div>
                )}

                {status === 'running' && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500"></div>
                        <p className="text-cyan-400 text-sm animate-pulse">Agent is thinking...</p>
                    </div>
                )}

                {status === 'done' && (
                    <div className="w-full text-left space-y-3 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-2 text-green-400 mb-2 justify-center">
                            <CheckCircle size={20} />
                            <span className="font-bold text-sm">Success! Here is the response:</span>
                        </div>
                        <div className="bg-gray-900/80 p-4 rounded border border-gray-700 text-sm text-gray-300 font-mono whitespace-pre-wrap max-h-[150px] overflow-y-auto custom-scrollbar">
                            {assistantResponse}
                        </div>
                    </div>
                )}
            </div>

            {status === 'done' && (
                <button 
                    onClick={handleFinish}
                    disabled={finishing}
                    className="w-full py-3 rounded-lg font-bold text-sm uppercase tracking-widest bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 group"
                >
                    {finishing ? 'Finalizing...' : 'Go to Console'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            )}
            
            {status === 'idle' && (
                 <p className="text-xs text-center text-gray-600">
                    This will create a new session ID: <span className="font-mono">{sessionId.slice(0,8)}...</span>
                 </p>
            )}
        </div>
    );
};
