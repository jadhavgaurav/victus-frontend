import { apiFetch, withCsrf, getCookie } from './http';

export interface User {
  id: string;
  email?: string;
  name?: string;
  is_superuser: boolean;
}

export interface SessionInfo {
  id: string;
  expires_at: string; // ISO date string
}

export interface AuthResponse {
  user: User;
  session: SessionInfo;
}

export async function refreshCsrf(): Promise<void> {
  await apiFetch('/auth/csrf', { method: 'GET' });
}

export async function getMe(): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/me');
}

export async function login(payload: { email?: string; password?: string }): Promise<{ ok: boolean }> {
  // Ensure CSRF token exists before login POST
  if (!getCookie('csrf_token')) {
    await refreshCsrf();
  }
  
  return apiFetch<{ ok: boolean }>('/auth/login', withCsrf({
    method: 'POST',
    body: JSON.stringify(payload),
  }));
}

export async function logout(): Promise<{ ok: boolean }> {
  if (!getCookie('csrf_token')) {
     try {
        await refreshCsrf();
     } catch (e) {
        // If refresh fails, we might already be logged out or server issue, 
        // strictly speaking we should try to post anyway or just accept it.
        // But the common pattern is to just try.
        console.warn("CSRF refresh failed during logout, attempting anyway", e);
     }
  }

  return apiFetch<{ ok: boolean }>('/auth/logout', withCsrf({
    method: 'POST',
  }));
}

// Dev-only bootstrap
export async function bootstrapDevSession(): Promise<AuthResponse> {
  if (!import.meta.env.DEV) {
    throw new Error("Dev tools only available in development mode");
  }
  
  // Ensure CSRF
  if (!getCookie('csrf_token')) {
    await refreshCsrf();
  }

  return apiFetch<AuthResponse>('/dev/bootstrap', withCsrf({
    method: 'POST'
  }));
}
