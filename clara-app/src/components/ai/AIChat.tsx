'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import AIMessage from './AIMessage';

// Define message types
interface Message {
  id: string;
  role: 'user' | 'agent' | 'patient';
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<'user' | 'agent'>('user');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Toggle between roles
  const toggleRole = () => {
    setActiveRole(prev => prev === 'user' ? 'agent' : 'user');
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Send a message to start a conversation with the AI.
            </div>
          )}
          
          {messages.map((message) => (
            <AIMessage key={message.id} message={message} />
          ))}
                    
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              Error: {error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Role:</span>
              <button
                type="button"
                onClick={toggleRole}
                className={`px-3 py-1 text-xs rounded-full ${
                  activeRole === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                I want to talk to Dad
              </button>
              <button
                type="button"
                onClick={toggleRole}
                className={`px-3 py-1 text-xs rounded-full ${
                  activeRole === 'agent'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                I need a break
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className={`flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeRole === 'agent' 
                  ? 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300'
              }`}
              disabled={activeRole === 'agent'}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-full ${
                !input.trim() || activeRole === 'agent'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : activeRole === 'user'
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              disabled={!input.trim() || activeRole === 'agent'}
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 