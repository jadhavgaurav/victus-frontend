import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { status } = useAuth();
    const location = useLocation();

    if (status === 'unknown') {
        // Loading skeleton
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                     <div className="w-12 h-12 rounded-full border-4 border-gray-800 border-t-cyan-500 animate-spin"></div>
                     <div className="text-gray-600 font-mono text-xs uppercase tracking-widest">Verifying Session...</div>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
