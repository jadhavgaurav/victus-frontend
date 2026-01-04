export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data: any;

  constructor(status: number, statusText: string, data: any) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export function withCsrf(options: RequestInit = {}): RequestInit {
  const csrfToken = getCookie('csrf_token');
  const headers = new Headers(options.headers || {});
  
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }
  
  return {
    ...options,
    headers,
  };
}

// Helper to avoid circular dependency with auth.ts
async function refreshCsrfTokenInternal(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/csrf`, { method: 'GET', credentials: 'include' });
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes((mergedOptions.method || 'GET').toUpperCase());

  // 1. If mutation and no CSRF cookie, try to refresh first
  if (isMutation && !getCookie('csrf_token')) {
    try {
      await refreshCsrfTokenInternal();
    } catch (e) {
      console.warn("Failed to pre-refresh CSRF token", e);
    }
  }

  // 2. Attach Token
  if (isMutation) {
    const csrfToken = getCookie('csrf_token');
    if (csrfToken) {
      (mergedOptions.headers as any)['X-CSRF-Token'] = csrfToken;
    }
  }

  // Helper to perform the fetch
  const doFetch = async () => await fetch(url, mergedOptions);

  try {
    let response = await doFetch();

    // 3. Retry on 403 (likely CSRF)
    if (response.status === 403 && isMutation) {
       // Refresh token
       await refreshCsrfTokenInternal();
       // Update header
       const newToken = getCookie('csrf_token');
       if (newToken) {
         (mergedOptions.headers as any)['X-CSRF-Token'] = newToken;
       }
       // Retry once
       response = await doFetch();
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or parsing errors
    throw new Error(error instanceof Error ? error.message : 'Unknown API error');
  }
}
