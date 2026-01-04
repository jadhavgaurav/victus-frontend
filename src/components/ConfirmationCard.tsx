import React, { useState } from 'react';

interface ConfirmationCardProps {
  type: 'ALLOW_WITH_CONFIRMATION' | 'ESCALATE';
  requiredPhrase?: string;
  onConfirm: (phrase?: string) => void;
  onCancel: () => void;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({ type, requiredPhrase, onConfirm, onCancel }) => {
  const [phraseInput, setPhraseInput] = useState('');

  const handleEscalateConfirm = () => {
    if (phraseInput === requiredPhrase) {
      onConfirm(phraseInput);
    }
  };

  return (
    <div className="bg-orange-950/40 border border-orange-500/50 rounded-lg p-4 mb-4 backdrop-blur-sm shadow-lg shadow-orange-900/20 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-orange-400 font-bold font-mono flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          {type === 'ALLOW_WITH_CONFIRMATION' ? 'CONFIRMATION REQUIRED' : 'ESCALATION REQUIRED'}
        </h3>
      </div>
      
      <p className="text-orange-100/80 mb-4 text-sm">
        {type === 'ALLOW_WITH_CONFIRMATION' 
          ? 'The assistant requires your approval to proceed with this sensitive action.'
          : `High-risk action detected. Please type "${requiredPhrase}" to confirm.`}
      </p>

      {type === 'ESCALATE' && (
        <div className="mb-4">
          <input 
            type="text" 
            value={phraseInput}
            onChange={(e) => setPhraseInput(e.target.value)}
            placeholder={`Type "${requiredPhrase}"`}
            className="w-full bg-black/30 border border-orange-500/30 rounded p-2 text-white placeholder-gray-500 focus:border-orange-500 outline-none font-mono text-sm"
          />
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button 
          onClick={onCancel}
          className="px-4 py-2 rounded text-sm font-medium text-orange-200 hover:text-white hover:bg-orange-900/30 transition-colors"
        >
          Cancel
        </button>
        
        {type === 'ALLOW_WITH_CONFIRMATION' ? (
          <button 
            onClick={() => onConfirm('confirm')}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded text-sm font-bold transition-colors shadow-lg shadow-orange-700/20"
          >
            Confirm
          </button>
        ) : (
          <button 
            onClick={handleEscalateConfirm}
            disabled={phraseInput !== requiredPhrase}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded text-sm font-bold transition-colors shadow-lg shadow-red-700/20"
          >
            Authorize
          </button>
        )}
      </div>
    </div>
  );
};
