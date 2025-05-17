'use client';

interface MessageProps {
  message: {
    id: string;
    role: 'user' | 'agent' | 'patient';
    content: string;
    timestamp: Date;
  };
}

export default function AIMessage({ message }: MessageProps) {
  // Determine the role type
  const isCaregiver = message.role === 'user';
  const isPatient = message.role === 'patient';
  const isChat = message.role === 'agent';
  
  // Format the timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={`flex ${isPatient ? 'justify-start' : 'justify-end'}`}
      data-message-id={message.id}
      data-role={message.role}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isCaregiver
            ? 'bg-blue-500 text-white rounded-br-none'
            : isPatient
              ? 'bg-green-500 text-white rounded-bl-none'
              : 'bg-red-500 text-white rounded-bl-none' // isChat (agent)
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={`text-xs mt-1 ${
            isCaregiver 
              ? 'text-blue-100' 
              : isPatient
                ? 'text-green-100'
                : 'text-red-100' // isChat
          } text-right`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
} 