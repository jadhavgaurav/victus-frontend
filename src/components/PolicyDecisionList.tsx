import React from 'react';
import type { PolicyDecision } from '../api/sessions';

interface PolicyDecisionListProps {
  decisions: PolicyDecision[];
}

export const PolicyDecisionList: React.FC<PolicyDecisionListProps> = ({ decisions }) => {
  if (!decisions || decisions.length === 0) {
     return <div className="text-gray-500 italic text-sm">No policy decisions recorded.</div>;
  }

  return (
    <div className="space-y-2">
      {decisions.map((decision, idx) => (
        <div key={idx} className={`p-2 rounded border flex items-center justify-between ${
            decision.allow 
            ? 'bg-green-950/20 border-green-800/30' 
            : 'bg-red-950/20 border-red-800/30'
        }`}>
           <div>
             <div className={`font-mono font-bold ${decision.allow ? 'text-green-400' : 'text-red-400'}`}>
                {decision.allow ? 'ALLOWED' : 'BLOCKED'}
             </div>
             <div className="text-xs text-gray-400">Code: {decision.reason_code}</div>
           </div>
           <div className="text-right">
             <div className="text-xs text-gray-500">Risk Score</div>
             <div className={`font-bold ${decision.risk_score > 0.7 ? 'text-red-400' : 'text-gray-300'}`}>
                {decision.risk_score.toFixed(2)}
             </div>
           </div>
        </div>
      ))}
    </div>
  );
};
