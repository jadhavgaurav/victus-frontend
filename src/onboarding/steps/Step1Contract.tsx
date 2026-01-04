import React, { useState } from 'react';
import { ShieldCheck, Activity, Eye, MicOff } from 'lucide-react';

interface Step1Props {
    onNext: () => void;
}

export const Step1Contract: React.FC<Step1Props> = ({ onNext }) => {
    const [checked, setChecked] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Set up VICTUS</h2>
                <p className="text-gray-400 text-sm">Please review the operating contract before proceeding.</p>
            </div>

            <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="text-cyan-500 mt-1 shrink-0" size={18} />
                    <p className="text-sm text-gray-300">You control all tools via granular permission scopes.</p>
                </div>
                 <div className="flex items-start gap-3">
                    <Activity className="text-cyan-500 mt-1 shrink-0" size={18} />
                    <p className="text-sm text-gray-300">High-risk actions require explicit human confirmation.</p>
                </div>
                <div className="flex items-start gap-3">
                    <Eye className="text-cyan-500 mt-1 shrink-0" size={18} />
                    <p className="text-sm text-gray-300">Everything is visible and logged in the session timeline.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-950/20 border border-blue-900/30 rounded text-blue-400 text-xs">
                <MicOff size={14} />
                <span>Microphone is OFF by default unless you enable it.</span>
            </div>

            <div className="pt-2">
                 <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="relative flex items-center">
                        <input 
                            type="checkbox" 
                            className="peer sr-only"
                            checked={checked} 
                            onChange={(e) => setChecked(e.target.checked)} 
                        />
                        <div className="w-5 h-5 border-2 border-gray-600 rounded peer-checked:bg-cyan-600 peer-checked:border-cyan-600 transition-colors"></div>
                        <div className="absolute inset-0 text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        I understand that permissions control agent actions.
                    </span>
                 </label>
            </div>

            <button 
                onClick={onNext}
                disabled={!checked}
                className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${
                    checked 
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
            >
                Continue
            </button>
        </div>
    );
};
