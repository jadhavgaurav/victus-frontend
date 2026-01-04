import React from 'react';



export const AuthTabs: React.FC = () => {
    return (
        <div className="flex border-b border-gray-800 mb-6 w-full">
            <button 
                className="flex-1 pb-3 text-sm font-bold text-cyan-400 border-b-2 border-cyan-400 transition-colors"
                disabled
            >
                LOGIN
            </button>
            <div className="group relative flex-1">
                <button 
                    className="w-full pb-3 text-sm font-bold text-gray-600 border-b-2 border-transparent hover:text-gray-500 cursor-not-allowed transition-colors"
                    disabled
                >
                    SIGN UP
                </button>
                {/* Tooltip */}
                <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700">
                    Coming Soon
                </div>
            </div>
             <div className="group relative flex-1">
                <button 
                    className="w-full pb-3 text-sm font-bold text-gray-600 border-b-2 border-transparent hover:text-gray-500 cursor-not-allowed transition-colors"
                    disabled
                >
                    FORGOT
                </button>
                 {/* Tooltip */}
                 <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700">
                    Contact Admin
                </div>
            </div>
        </div>
    );
};
