'use client';

import { Conversation } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

interface SidebarProps {
  conversations: Conversation[];
  activeConversation: string;
  onSelectConversation: (id: string) => void;
}

export default function Sidebar({ conversations, activeConversation, onSelectConversation }: SidebarProps) {
  return (
    <div className="w-80 h-full flex flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Chats</h1>
        <div className="mt-2 relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full p-2 pl-8 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-2.5 top-3 h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
              activeConversation === conversation.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
            data-conversation-id={conversation.id}
            data-conversation-name={conversation.name}
            data-conversation-timestamp={conversation.timestamp}
            data-conversation-unread={conversation.unread}
            data-conversation-online={conversation.online}
          >
            <div className="relative w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
              {conversation.name.charAt(0).toUpperCase()}
              {conversation.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-900">{conversation.name}</h3>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(conversation.timestamp))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate max-w-[180px]">
                  {conversation.lastMessage}
                </p>
                {conversation.unread > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 