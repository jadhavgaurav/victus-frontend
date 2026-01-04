import React from 'react';
import { AuthIntroPanel } from './AuthIntroPanel';
import { AuthFormCard } from './AuthFormCard';

export const AuthShell: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-black overflow-hidden">
            
            {/* Right Panel: Auth Form (Order 2 on mobile, Order 2 on desktop) */}
            <div className="w-full lg:w-1/2 flex-shrink-0 bg-black z-20 flex items-center justify-center p-6 md:p-12 border-b lg:border-b-0 lg:border-l border-gray-900 order-2 lg:order-2 relative">
                <AuthFormCard />
                
                {/* Mobile-only background gradient for form area */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-cyan-900/10 to-transparent lg:hidden pointer-events-none" />
            </div>

            {/* Left Panel: Intro (Order 1 on mobile, Order 1 on desktop) */}
            <div className="flex-1 relative bg-gray-950 order-1 lg:order-1 overflow-hidden">
                <AuthIntroPanel />
            </div>

        </div>
    );
};
