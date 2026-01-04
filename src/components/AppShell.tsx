import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { parseISO, differenceInSeconds } from 'date-fns';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, session, logout } = useAuth();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!session?.expires_at) return;

        const checkExpiry = () => {
            const expires = parseISO(session.expires_at);
            const diff = differenceInSeconds(expires, new Date());
            
            if (diff <= 0) {
                // Expired
                logout().then(() => navigate('/login'));
            } else if (diff < 600) { // Less than 10 mins
                setTimeLeft(diff);
            } else {
                setTimeLeft(null);
            }
        };

        checkExpiry();
        const interval = setInterval(checkExpiry, 1000); // Check every second to be accurate on logout
        return () => clearInterval(interval);
    }, [session?.expires_at, logout, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col h-screen bg-black text-gray-200 font-sans">
            {/* Top Bar */}
            <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="font-mono font-bold text-cyan-500 tracking-tighter text-lg">VICTUS</div>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest hidden sm:block">Console</div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Session Warning */}
                    {timeLeft !== null && (
                        <div className="text-xs font-bold text-yellow-500 px-3 py-1 bg-yellow-950/30 border border-yellow-900/50 rounded animate-pulse">
                            SESSION EXPIRING IN {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
                        </div>
                    )}

                    {/* User Profile */}
                    <div className="flex items-center gap-2">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-bold text-gray-300">{user?.email || 'User'}</div>
                            {user?.is_superuser && (
                                <div className="text-[10px] text-purple-400 font-mono uppercase">Superuser</div>
                            )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">
                           {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>

                    {/* Logout */}
                    <button 
                        onClick={handleLogout}
                        className="text-xs text-gray-400 hover:text-white uppercase tracking-wider font-bold hover:underline ml-2"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative">
                {children}
            </main>
        </div>
    );
};
