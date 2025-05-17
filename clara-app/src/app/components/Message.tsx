'use client';

import { Message as MessageType } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const isSentByMe = message.senderId === 'me';
  
  const renderStatusIcon = () => {
    if (!isSentByMe) return null;
    
    switch (message.status) {
      case 'sent':
        return (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'read':
        return (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
      data-message-id={message.id}
      data-sender-id={message.senderId}
      data-timestamp={message.timestamp}
      data-status={message.status}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isSentByMe
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white border border-gray-200 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <div
          className={`text-xs mt-1 ${
            isSentByMe ? 'text-blue-100' : 'text-gray-500'
          } flex items-center justify-end`}
        >
          <span>{formatDistanceToNow(new Date(message.timestamp))}</span>
          {isSentByMe && (
            <span className="ml-1">
              {renderStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 