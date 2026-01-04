import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { apiFetch } from '../api/http';

interface AdminSessionData {
  session_id: string;
  user_email: string;
  message_count: number;
  tool_call_count: number;
  // Intentionally minimal for now as per minimal prompt requirement
  created_at?: string;
}

export const AdminSessionSummary: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [data, setData] = useState<AdminSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    
    apiFetch<AdminSessionData>(`/admin/sessions/${sessionId}/summary`)
      .then(setData)
      .catch((err) => {
          console.error("Admin fetch failed", err);
          if (err.status === 404) {
              setError("Admin debug disabled or session not found.");
          } else if (err.status === 403) {
              setError("Access denied: Superuser only.");
          } else {
              setError("Failed to load admin summary.");
          }
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div className="p-8 text-gray-500">Loading admin summary...</div>;

  if (error) {
    return (
        <div className="p-8">
            <h1 className="text-xl font-bold text-red-500 mb-2">Admin Error</h1>
            <p className="text-gray-400">{error}</p>
            <NavLink to="/" className="text-cyan-500 underline mt-4 block">Back</NavLink>
        </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white font-mono">
       <div className="max-w-3xl mx-auto">
         <header className="mb-8 border-b border-gray-800 pb-4">
             <h1 className="text-2xl font-bold text-purple-400 mb-2">ADMIN DEBUG VIEW</h1>
             <div className="text-xs text-gray-500">SESSION: {sessionId}</div>
         </header>

         <div className="grid grid-cols-2 gap-4">
             <div className="bg-black/50 p-4 rounded border border-gray-800">
                 <div className="text-xs text-gray-500 uppercase">User</div>
                 <div className="text-lg">{data.user_email}</div>
             </div>
             <div className="bg-black/50 p-4 rounded border border-gray-800">
                 <div className="text-xs text-gray-500 uppercase">Messages</div>
                 <div className="text-lg">{data.message_count}</div>
             </div>
             <div className="bg-black/50 p-4 rounded border border-gray-800">
                 <div className="text-xs text-gray-500 uppercase">Tool Calls</div>
                 <div className="text-lg">{data.tool_call_count}</div>
             </div>
             {/* Expansion area */}
         </div>

         <div className="mt-8">
             <NavLink to={`/sessions/${sessionId}`} className="text-cyan-500 hover:text-cyan-400 underline">
                 View User Timeline &rarr;
             </NavLink>
         </div>
       </div>
    </div>
  );
};
