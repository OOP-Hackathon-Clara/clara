'use client';

import { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import AIMessage from './AIMessage';
import { getAudioStreamer, TranscriptionResult } from '@/app/api/shared/audioStreamer';
import MicrophoneButton from './MicrophoneButton';
import AgentModePopup from './AgentModePopup';

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
  const [showAgentModePopup, setShowAgentModePopup] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
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

  const playAudio = () => {
    try {
      audioRef.current?.play();
    } catch (err) {
      console.error('Playback failed:', err);
    }
  };

  // Set mode function to send requests to set_mode endpoint
  const setMode = async (isAgent: boolean) => {
    setIsSettingMode(true);
    try {
      const newRole = isAgent ? 'agent' : 'user';
      
      // First update the local state for immediate UI feedback
      setActiveRole(newRole);
      
      // If switching to user mode (talking to Dad), call the summarize endpoint
      if (!isAgent && messages.length > 0) {
        // Format messages for the summarize endpoint
        const formattedMessages = messages.map(msg => ({
          text: msg.content,
          role: msg.role
        }));
        
        try {
          // Call the summarize endpoint
          const summaryResponse = await fetch('/api/summarize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: formattedMessages
            }),
          });
          
          if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json();
            console.log(`Conversation summary: ${summaryData.summary}`);
          } else {
            console.error('Failed to get conversation summary');
          }
        } catch (summaryError) {
          console.error(`Error getting conversation summary: ${summaryError}`);
        }
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

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl rounded-lg overflow-hidden">

      {/* Chat Header - Messenger style */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mr-3">
            <span className="text-blue-500 font-semibold text-lg">D</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Dad</h2>
          </div>
        </div>
        <div>
          <audio ref={audioRef} src="/audio/ai_interaction.mp3" />
          <button onClick={playAudio}
                    className={`w-10 h-10 rounded-full ${isPlaying ? 'bg-red-200 text-red-500' : 'bg-gray-200 text-blue-500'} flex items-center justify-center hover:bg-gray-300 transition-colors shadow-md`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
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
            onClick={() => setShowAgentModePopup(true)}
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
      
      {/* Agent Mode Popup */}
      <AgentModePopup 
        isOpen={showAgentModePopup}
        onClose={() => setShowAgentModePopup(false)}
        onSetMode={setMode}
      />
    </div>
  );
}