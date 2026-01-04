import React, { useState, useEffect } from 'react';
import { bootstrapDevSession } from '../api/auth';
import { getCookie } from '../api/http';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DevPanel: React.FC = () => {
    const { user, refresh } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Debug info state
    const [cookies, setCookies] = useState<{ session: boolean, csrf: boolean }>({
        session: !!user, // Inferred from auth state since cookie is HttpOnly
        csrf: !!getCookie('csrf_token'),
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCookies({
                session: !!user,
                csrf: !!getCookie('csrf_token'),
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [user]);

    const handleBootstrap = async () => {
        setLoading(true);
        try {
            const response = await bootstrapDevSession();
            localStorage.setItem('last_session_id', response.session.id);
            await refresh(); // Refresh auth context
            navigate('/');
        } catch (e) {
            console.error("Bootstrap failed", e);
            alert("Bootstrap failed. Is backend running in DEV_MODE?");
        } finally {
            setLoading(false);
        }
    };

    if (!import.meta.env.DEV) return null;

    return (
        <div className="p-4 bg-gray-900 border border-gray-800 rounded mt-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Dev Tools</h3>
            
            <div className="mb-4 space-y-2 text-xs font-mono text-gray-400">
                <div className="flex justify-between">
                    <span>victus_session cookie:</span>
                    <span className={cookies.session ? "text-green-500" : "text-red-500"}>
                        {cookies.session ? "PRESENT (HttpOnly)" : "MISSING"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>csrf_token cookie:</span>
                    <span className={cookies.csrf ? "text-green-500" : "text-red-500"}>
                        {cookies.csrf ? "PRESENT" : "MISSING"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>API URL:</span>
                    <span className="text-white">{import.meta.env.VITE_API_BASE_URL || '/api'}</span>
                </div>
            </div>

            <button 
                onClick={handleBootstrap}
                disabled={loading}
                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs font-bold uppercase tracking-wider transition-colors border border-gray-700 hover:border-gray-500"
            >
                {loading ? 'Bootstrapping...' : 'Bootstrap Dev Session'}
            </button>
        </div>
    );
};
