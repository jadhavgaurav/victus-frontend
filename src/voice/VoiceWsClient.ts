export type VoiceState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface VoiceEvents {
  onTranscriptFinal: (text: string, confidence?: number) => void;
  onAssistantResponse: (text: string) => void;
  onError: (message: string) => void;
  onStateChange: (state: VoiceState) => void;
}

export class VoiceWsClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private shouldReconnect = true;
  private events: VoiceEvents;
  
  constructor(events: VoiceEvents) {
    this.events = events;
    this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/voice';
  }

  connect() {
    this.shouldReconnect = true;
    this.events.onStateChange('connecting');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.events.onStateChange('connected');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      this.ws.onclose = () => {
        this.events.onStateChange('disconnected');
        this.ws = null;
        if (this.shouldReconnect) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WS Error:', error);
        this.events.onError('Connection error');
      };

    } catch (e) {
      this.events.onError('Failed to create WebSocket connection');
      this.events.onStateChange('error');
    }
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.events.onStateChange('disconnected');
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.events.onError('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(10000, this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts));
    
    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'transcript_final':
        this.events.onTranscriptFinal(data.text, data.confidence);
        break;
      case 'assistant_response':
        this.events.onAssistantResponse(data.text);
        break;
      case 'error':
        this.events.onError(data.message);
        break;
      default:
        // potential other internal messages
        break;
    }
  }

  // --- Actions ---

  wake(sessionId: string) {
    this.send({
      type: 'wake',
      session_id: sessionId,
      wake_word: 'hey_victus'
    });
  }

  sendAudioChunk(chunkBase64: string) {
    this.send({
      type: 'audio',
      data: chunkBase64
    });
  }

  endOfUtterance() {
    this.send({ type: 'eou' });
  }

  cancel() {
    this.send({ type: 'cancel' });
  }

  updateConfig(config: any) {
    this.send({
        type: 'config',
        config
    });
  }

  private send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }
}
