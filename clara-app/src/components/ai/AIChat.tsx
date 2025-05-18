'use client';

import { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import AIMessage from './AIMessage';
import { getAudioStreamer, TranscriptionResult } from '@/app/api/shared/audioStreamer';
import MicrophoneButton from './MicrophoneButton';
import toast, { Toaster } from 'react-hot-toast';

// Define message types
interface Message {
  id: string;
  role: 'user' | 'agent' | 'contact';
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<'user' | 'agent'>('user');
  const [isSettingMode, setIsSettingMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isToastListening, setIsToastListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef<string | null>(null);
  
  // Handle transcription results from the microphone
  const handleTranscription = useCallback((result: TranscriptionResult) => {
    if (result.transcript) {
      // If it's a final result, append it to the input field
      if (result.isFinal) {
        setInput(prev => prev + (prev ? ' ' : '') + result.transcript);
        setIsListening(false);
      }
    }
  }, []);
  
  // Handle transcription results from the toast microphone
  const handleToastTranscription = useCallback((result: TranscriptionResult) => {
    if (result.transcript) {
      // If it's a final result, append it to the input field
      if (result.isFinal) {
        setInput(prev => prev + (prev ? ' ' : '') + result.transcript);
        setIsToastListening(false);
        if (toastIdRef.current) {
          toast.dismiss(toastIdRef.current);
          toastIdRef.current = null;
        }
      }
    }
  }, []);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/receive_message');
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      
      if (data.messages && Array.isArray(data.messages)) {
        // Convert string timestamps back to Date objects
        const formattedMessages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  // Initial fetch and polling setup
  useEffect(() => {
    // Initial fetch
    fetchMessages();
    
    // Set up polling every 3 seconds
    const intervalId = setInterval(fetchMessages, 3000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Create user message with the selected role
    const userMessage: Message = {
      id: Date.now().toString(),
      role: activeRole,
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    
    try {
      const response = await fetch('/api/send_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            recipient: "6138000000",
            message: userMessage.content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from GPT Chat');
      }
      
      const data = await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Show toast with microphone for agent mode
  const showMicrophoneToast = () => {
    // Dismiss any existing toast
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
    
    // Create a new toast with microphone button
    const id = toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span>Add context about your interactions with Dad</span>
          <button
            onClick={() => {
              setIsToastListening(!isToastListening);
            }}
            className={`p-2 rounded-full ${isToastListening ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toastIdRef.current = null;
            }}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ),
      {
        duration: 60000, // 1 minute
        position: 'top-center',
        style: {
          borderRadius: '10px',
          background: '#fff',
          color: '#333',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      }
    );
    
    toastIdRef.current = id;
  };
  
  // Set mode function to send requests to set_mode endpoint
  const setMode = async (isAgent: boolean) => {
    setIsSettingMode(true);
    try {
      const newRole = isAgent ? 'agent' : 'user';
      
      // First update the local state for immediate UI feedback
      setActiveRole(newRole);
      
      // Show microphone toast if switching to agent mode
      if (isAgent) {
        showMicrophoneToast();
      } else if (toastIdRef.current) {
        // Dismiss toast if switching to user mode
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      
      // Then send the request to the server
      const response = await fetch('/api/set_mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: isAgent
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set mode');
      }
      
      // Optional: You can handle the response data if needed
      const data = await response.json();
      console.log('Mode set successfully:', data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while setting mode');
      console.error('Error setting mode:', err);
    } finally {
      setIsSettingMode(false);
    }
  };

  // Effect to handle toast microphone
  useEffect(() => {
    let audioStreamer: ReturnType<typeof getAudioStreamer> | null = null;
    
    if (isToastListening) {
      audioStreamer = getAudioStreamer();
      audioStreamer.startListening(
        handleToastTranscription,
        (error: Error) => {
          console.error('Speech recognition error:', error);
          setIsToastListening(false);
          if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
          }
        }
      );
    }
    
    return () => {
      if (audioStreamer) {
        audioStreamer.stopListening();
      }
    };
  }, [isToastListening, handleToastTranscription]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl rounded-lg overflow-hidden">
      <Toaster />
      {/* Chat Header - Messenger style */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mr-3">
          <span className="text-blue-500 font-semibold text-lg">D</span>
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Dad</h2>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="rounded-lg p-4 text-center text-gray-500">
              No messages yet. Start a conversation with Dad.
            </div>
          )}
          
          {messages.map((message) => (
            <AIMessage key={message.id} message={message} />
          ))}
                    
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Error: {error}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Role Selection Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-center space-x-3 mb-2">
          <button
            type="button"
            onClick={() => setMode(false)}
            disabled={isSettingMode || activeRole === 'user'}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeRole === 'user'
                ? 'bg-blue-500 text-white shadow-md'
                : isSettingMode 
                  ? 'bg-gray-300 text-gray-500 cursor-wait'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            I want to talk to Dad
          </button>
          <button
            type="button"
            onClick={() => setMode(true)}
            disabled={isSettingMode || activeRole === 'agent'}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeRole === 'agent'
                ? 'bg-red-500 text-white shadow-md'
                : isSettingMode 
                  ? 'bg-gray-300 text-gray-500 cursor-wait'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            I need a break
          </button>
        </div>
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeRole === 'agent' ? "Add more information about your interactions with Dad today..." : "Type a message..."}
              className="w-full p-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <MicrophoneButton 
                onTranscription={handleTranscription}
                disabled={false}
                className="p-1 rounded-full text-gray-400 hover:text-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-3 rounded-full ${
              !input.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : activeRole === 'agent'
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
            } transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}