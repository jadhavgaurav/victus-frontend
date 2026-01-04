export class Microphone {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private input: MediaStreamAudioSourceNode | null = null;
  private onData: (base64: string) => void;
  private onLevel?: (level: number) => void;
  private isRecording = false;

  private buffer: Float32Array = new Float32Array(0);
  private chunkMs: number = 200; // Default

  constructor(onData: (base64: string) => void, onLevel?: (level: number) => void) {
    this.onData = onData;
    this.onLevel = onLevel;
  }

  setChunkSize(ms: number) {
      if (ms >= 50 && ms <= 2000) {
          this.chunkMs = ms;
      }
  }

  async start() {
    if (this.isRecording) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000, 
      });

      this.input = this.audioContext.createMediaStreamSource(this.stream);
      
      // Use standard buffer size for processing, but we will aggregate manually
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        if (!this.isRecording) return;
        const inputData = e.inputBuffer.getChannelData(0);
        
        // 1. Calculate Level (RMS) for visualization
        if (this.onLevel) {
            let sum = 0;
            const step = Math.ceil(inputData.length / 100); // Verify subset for perf
            for (let i = 0; i < inputData.length; i+=step) {
                sum += inputData[i] * inputData[i];
            }
            const rms = Math.sqrt(sum / (inputData.length / step));
            this.onLevel(Math.min(1, rms * 10)); 
        }

        // 2. Buffer data
        const newBuffer = new Float32Array(this.buffer.length + inputData.length);
        newBuffer.set(this.buffer);
        newBuffer.set(inputData, this.buffer.length);
        this.buffer = newBuffer;

        // 3. Process chunks based on chunkMs
        const samplesPerChunk = Math.floor(16000 * (this.chunkMs / 1000));
        
        while (this.buffer.length >= samplesPerChunk) {
            const chunk = this.buffer.slice(0, samplesPerChunk);
            this.buffer = this.buffer.slice(samplesPerChunk);
            
            const pcm16 = this.floatTo16BitPCM(chunk);
            const base64 = this.arrayBufferToBase64(pcm16);
            this.onData(base64);
        }
      };

      this.input.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      this.isRecording = true;
    } catch (e) {
      console.error('Microphone start error:', e);
      this.stop();
      throw e;
    }
  }

  stop() {
    this.isRecording = false;
    this.buffer = new Float32Array(0); // Clear buffer
    
    if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
    }
    
    if (this.processor) {
        this.processor.disconnect();
        this.processor = null;
    }
    
    if (this.input) {
        this.input.disconnect();
        this.input = null;
    }
    
    if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
    }
  }

  // Convert Float32Array to Int16Array
  private floatTo16BitPCM(input: Float32Array): ArrayBuffer {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
