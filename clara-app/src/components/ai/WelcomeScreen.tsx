'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAudioStreamer, TranscriptionResult } from '@/app/api/shared/audioStreamer';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Handle transcription results
  const handleTranscription = useCallback((result: TranscriptionResult) => {
    setTranscript(result.transcript);
    
    // If this is a final result, keep it displayed for a moment before proceeding
    if (result.isFinal) {
      setIsListening(false);
      setShowTranscript(true);
      
      // After a short delay, proceed to the chat
      setTimeout(() => {
        onGetStarted();
      }, 2000);
    }
  }, [onGetStarted]);
  
  // Handle errors
  const handleError = useCallback((error: Error) => {
    console.error('Speech recognition error:', error);
    setError(error.message);
    setIsListening(false);
  }, []);
  
  // Start listening when the button is clicked
  const startListening = async () => {
    try {
      setError(null);
      setTranscript('');
      setShowTranscript(true);
      
      const audioStreamer = getAudioStreamer();
      await audioStreamer.startListening(handleTranscription, handleError);
      setIsListening(true);
    } catch (err) {
      console.error('Error starting microphone:', err);
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
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-6 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to Clara</h3>
        <p className="text-gray-600 mb-4">
          This app helps caregivers like you support loved ones with dementia by providing an AI-powered chat companion that can engage patients through familiar messaging platforms.
        </p>
        <p className="text-gray-600 mb-4">
          When a patient enters a memory loop or you are unavailable, you can opt into the AI agent to gently take over the conversation, offering comfort, routine, and connection.
        </p>
        
        {showTranscript && (
          <div className={`mb-4 p-3 rounded-lg ${isListening ? 'bg-blue-50 animate-pulse' : 'bg-gray-50'}`}>
            {transcript ? (
              <p className="text-gray-700">"{transcript}"</p>
            ) : isListening ? (
              <p className="text-gray-500">Listening...</p>
            ) : (
              <p className="text-gray-500">Tap the microphone to say something</p>
            )}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            <p>Error: {error}</p>
            <p className="text-sm mt-1">Please try again or click Get Started to continue.</p>
          </div>
        )}
        
        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={startListening}
            disabled={isListening}
            className={`inline-flex items-center px-4 py-2 rounded-full transition-colors shadow-md ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
            aria-label="Start voice input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors shadow-md"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
} 