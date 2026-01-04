import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { DevPanel } from '../../dev/DevPanel';
import { AuthTabs } from './AuthTabs';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import '../../styles/auth.css';

export const AuthFormCard: React.FC = () => {
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
             const msg = err.data?.detail || "Invalid email or password.";
             setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-black tracking-tighter text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400">Enter your credentials to access the system.</p>
            </div>

            <AuthTabs />

            {error && (
                <div role="alert" className="flex items-center gap-2 bg-red-950/30 border border-red-900/50 text-red-400 px-4 py-3 rounded mb-6 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600 group-focus-within:text-cyan-500 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="auth-input w-full bg-black/50 border border-gray-800 rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-700 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                            placeholder="user@victus.ai"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Password</label>
                     <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-600 group-focus-within:text-cyan-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="auth-input w-full bg-black/50 border border-gray-800 rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-700 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>
                
                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3.5 rounded-lg font-bold uppercase tracking-widest text-sm transition-all relative overflow-hidden group ${
                            loading 
                            ? 'bg-gray-900 text-gray-500 cursor-wait border border-gray-800' 
                            : 'bg-cyan-600 text-white hover:bg-cyan-500 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(8,145,178,0.4)]'
                        }`}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </div>
            </form>

            {import.meta.env.DEV && (
                <div className="mt-8 pt-6 border-t border-gray-900/50">
                    <DevPanel />
                </div>
            )}
        </motion.div>
    );
};
