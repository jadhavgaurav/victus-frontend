import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as apiLogin, logout as apiLogout } from '../api/auth';
import type { User, SessionInfo } from '../api/auth';

type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  status: AuthStatus;
  user: User | null;
  session: SessionInfo | null;
  refresh: () => Promise<void>;
  login: (payload: { email?: string; password?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('unknown');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getMe();
      setUser(data.user);
      setSession(data.session);
      setStatus('authenticated');
    } catch (error) {
       // If 401/403, we are unauthenticated
       // Ideally specific error checking but taking any error as unauth for now for simplicity in MVP
       setUser(null);
       setSession(null);
       setStatus('unauthenticated');
    }
  }, []);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (payload: { email?: string; password?: string }) => {
    await apiLogin(payload);
    await refresh(); // Get user details after successful login
  };

  const logout = async () => {
    try {
        await apiLogout();
    } catch (e) {
        console.warn("Logout failed on server, clearing local state anyway", e);
    } finally {
        setUser(null);
        setSession(null);
        setStatus('unauthenticated');
    }
  };

  return (
    <AuthContext.Provider value={{ status, user, session, refresh, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
