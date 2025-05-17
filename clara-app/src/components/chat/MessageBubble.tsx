'use client';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

export default function MessageBubble({ text, sender, timestamp }: MessageBubbleProps) {
  const isUser = sender === 'user';
  
  // Format timestamp to show only hours and minutes
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(timestamp);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        <p className="break-words">{text}</p>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'} text-right`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
}
