'use client';

import { useState, useCallback, useEffect } from 'react';
import { getAudioStreamer, TranscriptionResult } from '@/app/api/shared/audioStreamer';

interface AgentModePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSetMode: (isAgent: boolean) => Promise<void>;
}

export default function AgentModePopup({ isOpen, onClose, onSetMode }: AgentModePopupProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when popup opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTranscript('');
      setError(null);
      setIsListening(false);
    }
  }, [isOpen]);

  // Handle transcription results
  const handleTranscription = useCallback((result: TranscriptionResult) => {
    if (result.transcript) {
      setTranscript(prev => (result.isFinal ? prev + ' ' + result.transcript : result.transcript));
      
      // If it's a final result, stop listening
      if (result.isFinal) {
        setIsListening(false);
      }
    }
  }, []);

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

  // Handle start button click
  const handleStart = async () => {
    try {
      setIsSubmitting(true);
      await onSetMode(true); // Set to agent mode
      onClose(); // Close the popup after successful mode change
    } catch (err) {
      console.error('Error setting mode:', err);
      setError(err instanceof Error ? err.message : 'Failed to set agent mode');
    } finally {
      setIsSubmitting(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Agent Mode</h2>
          <p className="text-gray-600 mb-6">
            You're about to enter agent mode. Please provide context about your interactions with Mom today.
          </p>
          
          {/* Microphone Button */}
          <div className="mb-6 flex flex-col items-center">
            <button
              onClick={toggleListening}
              disabled={isSubmitting}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-blue-100 text-blue-500 hover:bg-blue-200'}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40" 
                height="40" 
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
            <span className="mt-2 text-sm text-gray-500">
              {isListening ? 'Listening...' : 'Click to speak'}
            </span>
          </div>
          
          {/* Transcript Display */}
          {transcript && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-left">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Your context:</h3>
              <p className="text-gray-600">{transcript}</p>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-between space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 rounded-md text-white transition-colors ${isSubmitting ? 'bg-blue-400 cursor-wait' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isSubmitting ? 'Starting...' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}