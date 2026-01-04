import React from 'react';

interface ObservabilityPanelProps {
  sessionId: string;
  requestId?: string;
}

export const ObservabilityPanel: React.FC<ObservabilityPanelProps> = ({ sessionId, requestId }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 font-mono text-xs">
        <h3 className="text-cyan-500 font-bold mb-3 uppercase tracking-wider">Session Context</h3>
        
        <div className="grid grid-cols-[80px_1fr] gap-2 mb-2">
            <span className="text-gray-500">SESSION_ID</span>
            <span className="text-gray-300 break-all select-all">{sessionId}</span>
        </div>
        
        <div className="grid grid-cols-[80px_1fr] gap-2">
            <span className="text-gray-500">REQUEST_ID</span>
            <span className="text-gray-300 break-all select-all">{requestId || 'N/A'}</span>
        </div>
    </div>
  );
};
