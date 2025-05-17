'use client';

import { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message, Conversation } from '../types';

export default function ChatUI() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Can we talk later?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      unread: 0,
      online: false,
    },
    {
      id: '3',
      name: 'Alex Johnson',
      lastMessage: 'I sent you the files',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      unread: 0,
      online: true,
    },
  ]);

  const [activeConversation, setActiveConversation] = useState<string>('1');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      text: 'Hey, how are you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      status: 'read',
    },
    {
      id: '2',
      senderId: 'me',
      text: 'I\'m good, thanks! How about you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
      status: 'read',
    },
    {
      id: '3',
      senderId: '1',
      text: 'Doing well. Did you get a chance to look at the project?',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      status: 'read',
    },
    {
      id: '4',
      senderId: 'me',
      text: 'Yes, I did! I have some feedback to share.',
      timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
      status: 'read',
    },
    {
      id: '5',
      senderId: '1',
      text: 'Great! What are your thoughts?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'read',
    },
  ]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeConversation,
        text: 'Thanks for your message! I\'ll get back to you soon.',
        timestamp: new Date().toISOString(),
        status: 'delivered',
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    
    // Mark conversation as read when selected
    setConversations(conversations.map(conv => 
      conv.id === id ? { ...conv, unread: 0 } : conv
    ));
  };

  const activeConvo = conversations.find(c => c.id === activeConversation);

  return (
    <div className="flex w-full h-full overflow-hidden">      
      {/* Chat Area */}
      <div className="flex flex-col flex-grow h-full bg-white">
        {activeConvo && <ChatHeader conversation={activeConvo} />}
        <MessageList messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
} 