import { apiFetch, withCsrf } from './http';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  args: any;
  result?: any;
  status: 'pending' | 'success' | 'failed';
}

export interface PolicyDecision {
  risk_score: number;
  reason_code: string;
  allow: boolean;
  requires_confirmation?: boolean;
}

export interface SessionHistory {
  id: string;
  messages: Message[];
  tool_calls: ToolCall[];
  policy_decisions: PolicyDecision[];
  pending_confirmation?: {
    type: 'ALLOW_WITH_CONFIRMATION' | 'ESCALATE';
    required_phrase?: string;
  };
}

export interface SendMessageResponse {
  assistant_text: string;
  session_id: string;
  pending_confirmation?: {
     type: 'ALLOW_WITH_CONFIRMATION' | 'ESCALATE';
     required_phrase?: string;
  };
  request_id?: string;
}

export async function getSessionHistory(sessionId: string): Promise<SessionHistory> {
  return apiFetch<SessionHistory>(`/sessions/${sessionId}/history`);
}

export async function postSessionMessage(sessionId: string, content: string): Promise<SendMessageResponse> {
  return apiFetch<SendMessageResponse>(
    `/sessions/${sessionId}/message`, 
    withCsrf({
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  );
}

export async function createSession(): Promise<{ session_id: string }> {
  return apiFetch<{ session_id: string }>(
    '/sessions/',
    withCsrf({
       method: 'POST',
       body: JSON.stringify({})
    })
  );
}
