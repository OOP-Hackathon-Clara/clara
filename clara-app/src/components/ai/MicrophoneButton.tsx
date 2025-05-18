'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAudioStreamer, TranscriptionResult } from '@/app/api/shared/audioStreamer';

interface MicrophoneButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export default function MicrophoneButton({ onTranscription, disabled = false }: MicrophoneButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Handle transcription results
  const handleTranscription = useCallback((result: TranscriptionResult) => {
    setTranscript(result.transcript);
    
    // If this is a final result, send it to the parent component
    if (result.isFinal) {
      onTranscription(result.transcript);
      // Reset the transcript if it's final
      setTranscript('');
      // Stop listening after receiving final result
      setIsListening(false);
    }
  }, [onTranscription]);

  // Handle errors
  const handleError = useCallback((error: Error) => {
    console.error('Speech recognition error:', error);
    setError(error.message);
    setIsListening(false);
  }, []);

  // Toggle listening state
  const toggleListening = async () => {
    try {
      if (isListening) {
        // Stop listening
        const audioStreamer = getAudioStreamer();
        audioStreamer.stopListening();
        setIsListening(false);
      } else {
        // Start listening
        setError(null);
        const audioStreamer = getAudioStreamer();
        await audioStreamer.startListening(handleTranscription, handleError);
        setIsListening(true);
      }
    } catch (err) {
      console.error('Error toggling microphone:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsListening(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        const audioStreamer = getAudioStreamer();
        audioStreamer.stopListening();
      }
    };
  }, [isListening]);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`p-3 rounded-full flex items-center justify-center ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : disabled 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title={isListening ? 'Stop listening' : 'Start listening'}
      >
        {/* Microphone icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </button>
      
      {transcript && (
        <div className="mt-2 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">
          {transcript}
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
