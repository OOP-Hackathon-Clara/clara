'use client';

import { useState, useEffect } from 'react';
import ContactBar from './ContactBar';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'other',
      timestamp: new Date(),
    },
  ]);

  // Fetch messages from our API
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/message');
      const data = await response.json();
      
      if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
        // Convert string timestamps back to Date objects
        const formattedMessages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };
  
  // Poll for new messages every 3 seconds
  useEffect(() => {
    // Initial fetch
    fetchMessages();
    
    // Set up polling
    const intervalId = setInterval(fetchMessages, 3000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = async (text: string) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Optimistically update UI
    setMessages((prev) => [...prev, userMessage]);
    
    try {
      // Send user message to our API
      await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sender: 'user',
        }),
      });
      
      // Send to GPT Chat API
      const gptResponse = await fetch('/api/gptchat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: text,
            },
          ],
        }),
      });
      
      const gptData = await gptResponse.json();
      
      if (gptData.content) {
        // Add GPT response to our message store
        await fetch('/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: gptData.content,
            sender: 'other',
          }),
        });
        
        // Fetch updated messages
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ContactBar name="Support" status="Online" />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            text={message.text}
            sender={message.sender}
            timestamp={message.timestamp}
          />
        ))}
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
