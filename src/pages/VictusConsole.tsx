
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// uuid removed
import { ChatFeed } from '../components/ChatFeed';
import { ChatInput } from '../components/ChatInput';
import { ConfirmationCard } from '../components/ConfirmationCard';
import { JarvisIndicator } from '../components/JarvisIndicator';
import type { JarvisState } from '../components/JarvisIndicator';
import { VoiceWsClient } from '../voice/VoiceWsClient';
import type { VoiceState } from '../voice/VoiceWsClient';
import { Microphone } from '../voice/mic';
import { getSessionHistory, postSessionMessage, createSession } from '../api/sessions';
import type { Message, SessionHistory } from '../api/sessions';
import { useSettings } from '../context/SettingsContext';

export const VictusConsole: React.FC = () => {
  const { settings } = useSettings();
  const [sessionId, setSessionId] = useState<string>(() => {
    return localStorage.getItem('last_session_id') || ''; 
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Voice State
  const [wsState, setWsState] = useState<VoiceState>('disconnected');
  const [micActive, setMicActive] = useState(false);
  const [jarvisState, setJarvisState] = useState<JarvisState>('offline');

  // Confirmation State
  const [pendingConfirmation, setPendingConfirmation] = useState<SessionHistory['pending_confirmation']>(undefined);

  // Refs
  const voiceClient = useRef<VoiceWsClient | null>(null);
  const microphone = useRef<Microphone | null>(null);
  const navigate = useNavigate();

  // Initialization
  useEffect(() => {
    const initSession = async () => {
        if (!sessionId) {
            // No session, create one
            try {
                const { session_id } = await createSession();
                setSessionId(session_id);
            } catch (e) {
                console.error("Failed to create session", e);
            }
        } else {
             // Validate existing
             try {
                await getSessionHistory(sessionId);
             } catch (e: any) {
                 if (e.status === 404) {
                     // Invalid, create new
                     try {
                        const { session_id } = await createSession();
                        setSessionId(session_id);
                    } catch (err) {
                        console.error("Failed to recover session", err);
                    }
                 }
             }
        }
    };
    initSession();
  }, [sessionId]); // Dependency on sessionId to run once or when it changes to empty? Actually we just want this on mount logic mainly.
  
  // Persist
  useEffect(() => {
      if (sessionId) {
          localStorage.setItem('last_session_id', sessionId);
          refreshHistory();
      }
  }, [sessionId]);

  // Polling for confirmation & History
  useEffect(() => {
    if (!sessionId) return;

    // Default to 2000 if not yet loaded
    const pollInterval = settings?.ui.history_poll_interval_ms || 2000;
    
    // Poll faster if pending confirmation
    const intervalMs = pendingConfirmation ? 1000 : pollInterval;

    const interval = setInterval(() => {
      refreshHistory(true); 
    }, intervalMs);
    return () => clearInterval(interval);
  }, [sessionId, pendingConfirmation, settings?.ui.history_poll_interval_ms]);

  // Voice Client Setup
  useEffect(() => {
    voiceClient.current ??= new VoiceWsClient({
            onStateChange: (state) => {
                setWsState(state);
                updateJarvisState(state, micActive);
            },
            onTranscriptFinal: (text) => {
                // Optimistically add user message for visual feedback
                addMessage({ role: 'user', content: text });
                voiceClient.current?.endOfUtterance();
                setJarvisState('processing');
            },
            onAssistantResponse: (text) => {
                addMessage({ role: 'assistant', content: text });
                setJarvisState('speaking');
                // Brief speaking animation then revert
                setTimeout(() => {
                     setJarvisState(() => {
                        return micActive ? 'listening' : 'wake_ready';
                     });
                }, 2000);
                refreshHistory();
            },
            onError: (msg) => {
                console.error("Voice Error", msg);
                setJarvisState('error');
                setTimeout(() => updateJarvisState(wsState, micActive), 2000);
            }
        });

    // Apply initial settings if available
    if (settings?.voice) {
        voiceClient.current.updateConfig(settings.voice);
    }

    // Cleanup on unmount
    return () => {
        voiceClient.current?.disconnect();
        microphone.current?.stop();
    };
  }, []);

  // Sync Settings to Voice Components
  useEffect(() => {
      if (settings?.voice) {
          // Update WS Client config
          voiceClient.current?.updateConfig(settings.voice);
          
          // Update Mic Chunk Size
          if (microphone.current) {
              microphone.current.setChunkSize(settings.voice.chunk_ms);
          }
      }
  }, [settings?.voice]);

  // Initial Mic State (Safe Default)
  useEffect(() => {
     // We do NOT auto-start mic on load to avoid browser blocking,
     // but we could respect preferred_input to scroll to chat or show voice UI.
     // If mic_default is true, we might want to toggle it ON if user clicks "Start Voice" once?
     // For now, logic stays manual toggle.
  }, []);


  // Update Jarvis State helper
  const updateJarvisState = (ws: VoiceState, mic: boolean) => {
      if (ws !== 'connected') {
          setJarvisState(ws === 'error' ? 'error' : 'offline');
          return;
      }
      setJarvisState(mic ? 'listening' : 'wake_ready');
  };

  // Handlers
  const refreshHistory = async (silent = false) => {
      if (!sessionId) return;
      try {
          const history = await getSessionHistory(sessionId);
          setMessages(history.messages);
          setPendingConfirmation(history.pending_confirmation);
      } catch (e: any) {
          if (e.status === 404) {
              console.warn("Session not found (404), clearing invalid session.");
              setSessionId('');
              localStorage.removeItem('last_session_id');
          } else {
              if (!silent) console.error("Failed to fetch history", e);
          }
      }
  };

  const addMessage = (msg: Message) => {
      setMessages(prev => [...prev, msg]);
  };

  const handleSendMessage = async (text: string) => {
      if (loading) return;
      setLoading(true);
      
      // Optimistic user message
      addMessage({ role: 'user', content: text });

      try {
          const res = await postSessionMessage(sessionId, text);
          if (res.assistant_text) {
              addMessage({ role: 'assistant', content: res.assistant_text});
          }
          if (res.pending_confirmation) {
              setPendingConfirmation(res.pending_confirmation);
          } else {
            // clear if we resolved it
            setPendingConfirmation(undefined);
          }
      } catch (e) {
          console.error("Send failed", e);
          addMessage({ role: 'system', content: 'Failed to send message.' });
      } finally {
          setLoading(false);
      }
  };

  const toggleVoice = async () => {
      const nextActive = !micActive;
      
      if (nextActive) {
          // Turning ON
          try {
              if (wsState !== 'connected') {
                  voiceClient.current?.connect();
              }
              
              if (!microphone.current) {
                  microphone.current = new Microphone((base64) => {
                      voiceClient.current?.sendAudioChunk(base64);
                  });
              }

              // Apply chunk size setting
              if (settings?.voice.chunk_ms) {
                  microphone.current.setChunkSize(settings.voice.chunk_ms);
              }

              await microphone.current.start();
              // Wake immediately
              voiceClient.current?.wake(sessionId);
              
              setMicActive(true);
              updateJarvisState('connected', true); // Force update state
          } catch (e) {
              console.error("Failed to start voice", e);
              alert("Could not access microphone.");
              setMicActive(false);
          }
      } else {
          // Turning OFF
          microphone.current?.stop();
          setMicActive(false);
          updateJarvisState(wsState, false);
      }
  };

  const handleConfirm = (phrase?: string) => {
      handleSendMessage(phrase || 'confirm');
  };

  const handleCancelConfirm = () => {
      handleSendMessage('cancel');
  };
  
  const handleNewSession = async () => {
      microphone.current?.stop();
      setMicActive(false);
      try {
        const { session_id } = await createSession();
        setSessionId(session_id);
        navigate('/'); 
      } catch (e) {
          console.error("Failed to create new session", e);
          alert("Failed to start new session");
      }
  };

  // Helper to count blocked tools for the "snapshot pill"
  const blockedToolsCount = settings?.tools.scopes 
    ? Object.values(settings.tools.scopes).filter(val => val === false).length 
    : 0;
  

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 font-sans text-sm">
      <header className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl mb-4 border border-gray-800 backdrop-blur">
        <div className="flex items-center gap-4">
           {/* Session Info - Replaces Redundant Title */}
           <div className="flex items-center gap-2">
             <span className="font-mono text-xs text-gray-500">SESSION:</span>
             <code className="text-xs bg-gray-950 px-2 py-1 rounded border border-gray-800 text-cyan-600 select-all">{sessionId}</code>
             <button onClick={handleNewSession} className="text-xs text-gray-400 hover:text-white underline">New</button>
             <NavLink to={`/sessions/${sessionId}`} className="text-xs text-gray-400 hover:text-white underline ml-2">History View</NavLink>
           </div>
        </div>
        <div className="flex gap-6 items-center">
            {/* Permissions Snapshot Pill (F3I) */}
            <NavLink to="/settings?tab=tools" className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-700 rounded-full hover:border-gray-500 transition-colors">
                 <div className={`w-2 h-2 rounded-full ${blockedToolsCount > 0 ? 'bg-orange-500' : 'bg-green-500'}`} />
                 <span className="text-xs text-gray-400">
                     {blockedToolsCount > 0 ? `${blockedToolsCount} Tools Blocked` : 'All Systems Nominal'}
                 </span>
            </NavLink>

             <NavLink to="/settings" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
             </NavLink>

            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${wsState === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}></div>
                <span className="text-xs text-gray-400 uppercase tracking-widest">{wsState}</span>
            </div>
            <div className="text-xs font-mono text-cyan-300/80 border border-cyan-900/40 px-3 py-1 rounded-full bg-cyan-950/20">
                {micActive ? 'LISTENING (MIC ON)' : 'WAKE-READY (MIC OFF)'}
            </div>
        </div>
      </header>
      
      <div className="flex flex-1 gap-4 overflow-hidden">
        <main className="flex-1 bg-gray-900/50 rounded-xl p-0 border border-gray-800 flex flex-col relative overflow-hidden backdrop-blur">
           {/* Chat Feed - Optional Compact Mode */}
           <div className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent ${settings?.ui.compact_mode ? 'text-xs' : ''}`}>
             <ChatFeed messages={messages} />
           </div>
           
           {/* Observability Panel (F3F) */}
           {settings?.ui.show_observability_panel && (
               <div className="absolute top-2 right-2 bg-black/80 p-2 rounded border border-gray-700 text-xs font-mono text-green-400 z-10 pointer-events-none">
                   <p>Session: {sessionId.slice(0, 8)}</p>
                   <p>Messages: {messages.length}</p>
                   <p>Latency: --ms</p>
               </div>
           )}

           {/* Bottom Interaction Area */}
           <div className="p-4 bg-gray-950/50 border-t border-gray-800">
             {pendingConfirmation && (
                 <ConfirmationCard 
                    type={pendingConfirmation.type} 
                    requiredPhrase={pendingConfirmation.required_phrase}
                    onConfirm={handleConfirm}
                    onCancel={handleCancelConfirm}
                 />
             )}
             <ChatInput onSend={handleSendMessage} disabled={loading || !!pendingConfirmation} placeholder={pendingConfirmation ? "Resolving confirmation..." : "Type a message..."} />
           </div>
        </main>
        
        <aside className="w-80 flex flex-col gap-4">
            <div className="flex-1 bg-gray-900/50 rounded-xl p-6 border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur">
                <JarvisIndicator state={jarvisState} />
                
                <div className="mt-8 text-center z-10">
                    <button 
                        onClick={toggleVoice}
                        className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest transition-all duration-300 ${
                            micActive 
                                ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                                : 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/50 hover:bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                        }`}
                    >
                        {micActive ? 'Stop Voice' : 'Start Voice'}
                    </button>
                    <p className="mt-4 text-xs text-gray-500">
                        {micActive ? 'Microphone is active' : 'Click to enable voice mode'}
                    </p>
                </div>
            </div>
            
            <div className="h-40 bg-gray-900/50 rounded-xl p-4 border border-gray-800 backdrop-blur">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Live Transcripts</h3>
                 <div className="text-sm text-gray-300 font-mono italic opacity-70">
                     Waiting for audio...
                 </div>
            </div>
        </aside>
      </div>
    </div>
  );
};
