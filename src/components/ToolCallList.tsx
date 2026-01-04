import React from 'react';
import type { ToolCall } from '../api/sessions';
import { redactDeep } from '../security/redact';

interface ToolCallListProps {
  toolCalls: ToolCall[];
}

export const ToolCallList: React.FC<ToolCallListProps> = ({ toolCalls }) => {
  if (!toolCalls || toolCalls.length === 0) {
    return <div className="text-gray-500 italic text-sm">No tool calls recorded.</div>;
  }

  return (
    <div className="space-y-4">
      {toolCalls.map((call) => (
        <div key={call.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-xs font-mono">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-cyan-400">{call.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                call.status === 'success' ? 'bg-green-900/50 text-green-400' :
                call.status === 'failed' ? 'bg-red-900/50 text-red-400' :
                'bg-yellow-900/50 text-yellow-400'
            }`}>
                {call.status}
            </span>
          </div>
          
          <div className="mb-2">
            <div className="text-gray-500 mb-1">ARGS:</div>
            <pre className="bg-black/30 p-2 rounded text-gray-300 overflow-x-auto">
              {JSON.stringify(redactDeep(call.args), null, 2)}
            </pre>
          </div>

          {call.result && (
            <div>
                <div className="text-gray-500 mb-1">RESULT:</div>
                <pre className="bg-black/30 p-2 rounded text-gray-300 overflow-x-auto max-h-40">
                {JSON.stringify(redactDeep(call.result), null, 2)}
                </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
