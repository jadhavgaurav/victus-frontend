import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { getSessionHistory } from '../api/sessions';
import type { SessionHistory } from '../api/sessions';
import { ChatFeed } from '../components/ChatFeed';
import { ToolCallList } from '../components/ToolCallList';
import { PolicyDecisionList } from '../components/PolicyDecisionList';
import { ObservabilityPanel } from '../components/ObservabilityPanel';
import { ConfirmationCard } from '../components/ConfirmationCard';
import { postSessionMessage } from '../api/sessions';

export const SessionTimeline: React.FC = () => {
  // const { user } = useAuth(); // Not used currently
  const { sessionId } = useParams<{ sessionId: string }>();
  const [data, setData] = useState<SessionHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRequestId] = useState<string | undefined>(undefined);

  const fetchData = async () => {
      if (!sessionId) return;
      try {
          const hist = await getSessionHistory(sessionId);
          setData(hist);
      } catch (e) {
          console.error("Failed to load session", e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
    // Poll occasionally to keep updated
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleConfirm = async (phrase?: string) => {
      if (!sessionId) return;
      await postSessionMessage(sessionId, phrase || 'confirm');
      fetchData();
  };
  
  const handleCancel = async () => {
      if (!sessionId) return;
      await postSessionMessage(sessionId, 'cancel');
      fetchData();
  };

  if (loading) {
      return <div className="flex h-screen items-center justify-center bg-black text-gray-500">Loading timeline...</div>;
  }

  if (!data) {
      return <div className="flex h-screen items-center justify-center bg-black text-red-500">Session not found.</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4 font-sans text-sm">
      <header className="flex justify-between items-center bg-gray-900 p-4 rounded-lg mb-4 border border-gray-800">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold font-mono text-cyan-400">SESSION TIMELINE</h1>
            <NavLink to="/" className="text-gray-400 hover:text-white text-xs underline">Back to Console</NavLink>
        </div>
        <div className="text-xs text-gray-500">ID: {sessionId}</div>
      </header>

      <div className="flex flex-1 gap-4 overflow-hidden">
        <main className="flex-1 flex flex-col gap-4 overflow-hidden">
             
             {/* Pending Confirmation Banner */}
             {data.pending_confirmation && (
                 <ConfirmationCard 
                    type={data.pending_confirmation.type}
                    requiredPhrase={data.pending_confirmation.required_phrase}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                 />
             )}

             {/* Split View: Chat | Internals */}
             <div className="flex-1 flex gap-4 overflow-hidden">
                 <div className="flex-1 bg-gray-900 rounded-lg p-4 border border-gray-800 overflow-y-auto flex flex-col">
                    <h2 className="text-lg font-bold mb-4 font-mono text-cyan-500 border-b border-gray-800 pb-2">Transcript</h2>
                    <ChatFeed messages={data.messages} />
                 </div>
                 
                 <div className="w-96 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 bg-gray-900 rounded-lg p-4 border border-gray-800 overflow-y-auto">
                        <h2 className="text-sm font-bold mb-2 font-mono text-purple-400 uppercase">Tool Executions</h2>
                        <ToolCallList toolCalls={data.tool_calls} />
                    </div>
                    
                    <div className="h-1/3 bg-gray-900 rounded-lg p-4 border border-gray-800 overflow-y-auto">
                        <h2 className="text-sm font-bold mb-2 font-mono text-yellow-400 uppercase">Policy Decisions</h2>
                        <PolicyDecisionList decisions={data.policy_decisions} />
                    </div>
                 </div>
             </div>
        </main>

        <aside className="w-60 bg-gray-900 rounded-lg p-4 border border-gray-800 overflow-y-auto">
            <h2 className="text-sm font-bold mb-4 font-mono text-gray-400 uppercase">Metadata</h2>
            <ObservabilityPanel sessionId={sessionId || ''} requestId={lastRequestId} />
        </aside>
      </div>
    </div>
  );
};
