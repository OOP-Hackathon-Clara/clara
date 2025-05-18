'use client';

// Define interfaces for our audio streaming service
export interface AudioStreamOptions {
  languageCode?: string;
  interimResults?: boolean;
}

export interface TranscriptionResult {
  transcript: string;
  isFinal: boolean;
}

/**
 * AudioStreamer class that handles microphone input and Web Speech API for speech recognition
 */
export class AudioStreamer {
  private recognition: SpeechRecognition | null = null;
  private options: AudioStreamOptions;
  private isListening: boolean = false;
  private onTranscriptionCallback: ((result: TranscriptionResult) => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;

  constructor(options: AudioStreamOptions = {}) {
    // Default options
    this.options = {
      languageCode: 'en-US',
      interimResults: true,
      ...options
    };

    // Check if browser supports SpeechRecognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported in this browser');
      }
    }
  }

  /**
   * Start listening to microphone input using Web Speech API
   * @param onTranscription Callback function that receives transcription results
   * @param onError Callback function that receives errors
   */
  public async startListening(
    onTranscription: (result: TranscriptionResult) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (this.isListening) {
      return;
    }

    this.onTranscriptionCallback = onTranscription;
    this.onErrorCallback = onError;

    try {
      // Check if browser supports SpeechRecognition
      if (typeof window === 'undefined') {
        throw new Error('Speech recognition is only available in browser environments');
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }

      // Create a new SpeechRecognition instance
      this.recognition = new SpeechRecognition();
      
      // Configure the recognition
      this.recognition.lang = this.options.languageCode || 'en-US';
      this.recognition.continuous = true;
      this.recognition.interimResults = this.options.interimResults || false;
      
      // Set up event handlers
      this.recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        const isFinal = result.isFinal;
        
        if (this.onTranscriptionCallback) {
          this.onTranscriptionCallback({
            transcript,
            isFinal
          });
        }
      };
      
      this.recognition.onerror = (event) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(new Error(`Speech recognition error: ${event.error}`));
        }
      };
      
      this.recognition.onend = () => {
        // If we're still supposed to be listening, restart the recognition
        if (this.isListening && this.recognition) {
          this.recognition.start();
        }
      };
      
      // Start recognition
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      if (this.onErrorCallback) {
        this.onErrorCallback(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  /**
   * Stop listening to microphone input
   */
  public stopListening(): void {
    if (!this.isListening) {
      return;
    }

    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }

    this.isListening = false;
  }
}

// Create a singleton instance for use throughout the application
let audioStreamerInstance: AudioStreamer | null = null;

/**
 * Get the singleton instance of AudioStreamer
 */
export function getAudioStreamer(options?: AudioStreamOptions): AudioStreamer {
  if (!audioStreamerInstance) {
    audioStreamerInstance = new AudioStreamer(options);
  }
  return audioStreamerInstance;
}
