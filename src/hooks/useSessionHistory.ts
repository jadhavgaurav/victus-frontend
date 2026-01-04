import { useState, useEffect, useCallback, useRef } from 'react';
import { getSessionHistory } from '../api/sessions';
import type { SessionHistory } from '../api/sessions';

interface UseSessionHistoryOptions {
  enabled?: boolean;
  pollIntervalMs?: number;
}

interface UseSessionHistoryResult {
  data: SessionHistory | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useSessionHistory(sessionId: string, options: UseSessionHistoryOptions = {}): UseSessionHistoryResult {
  const { enabled = true, pollIntervalMs = 2000 } = options;
  const [data, setData] = useState<SessionHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!sessionId) return;
    
    if (!silent) setLoading(true);
    try {
      const history = await getSessionHistory(sessionId);
      setData(history);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch session history:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching history'));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [sessionId]);

  // Initial load
  useEffect(() => {
    if (enabled && sessionId) {
      fetchData();
    }
  }, [sessionId, enabled]);

  // Polling logic
  useEffect(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    if (!enabled || !sessionId) return;

    // Determine interval: faster if pending confirmation
    const interval = (data?.pending_confirmation) ? 1000 : pollIntervalMs;

    pollTimerRef.current = setInterval(() => {
      fetchData(true); // silent refresh
    }, interval);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [sessionId, enabled, pollIntervalMs, data?.pending_confirmation]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchData(false)
  };
}
