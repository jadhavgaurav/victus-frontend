import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { DevPanel } from '../dev/DevPanel';

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch (err: any) {
             console.error("Login failed", err);
             // Simple fallback error
             const msg = err.data?.detail || "Invalid email or password.";
             setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-black text-white p-4 font-sans">
            <div className="w-full max-w-md bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-2xl">
                 <div className="flex justify-center mb-6">
                     <h1 className="text-2xl font-bold font-mono tracking-tight text-cyan-400">VICTUS<span className="text-gray-600">AUTH</span></h1>
                 </div>
                 
                 {error && (
                     <div className="bg-red-950/30 border border-red-900/50 text-red-400 px-4 py-3 rounded mb-6 text-sm">
                         {error}
                     </div>
                 )}

                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                         <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            placeholder="user@example.com"
                            required
                         />
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                         <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            placeholder="••••••••"
                            required // Backend might not strictly require it for some auth types, but usually yes
                         />
                     </div>
                     
                     <div className="pt-4">
                         <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-3 rounded font-bold uppercase tracking-widest transition-all ${
                                loading 
                                ? 'bg-gray-800 text-gray-500 cursor-wait' 
                                : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.3)]'
                            }`}
                         >
                             {loading ? 'Authenticating...' : 'Sign In'}
                         </button>
                     </div>
                 </form>

                 {import.meta.env.DEV && (
                     <div className="mt-8 pt-6 border-t border-gray-800">
                         <DevPanel />
                     </div>
                 )}
            </div>
        </div>
    );
};
