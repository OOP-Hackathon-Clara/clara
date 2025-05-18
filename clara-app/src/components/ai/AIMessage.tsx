'use client';

interface MessageProps {
  message: {
    id: string;
    role: 'user' | 'agent' | 'contact';
    content: string;
    timestamp: Date;
  };
}

export default function AIMessage({ message }: MessageProps) {
  // Determine the role type
  const isCaregiver = message.role === 'user';
  const isPatient = message.role === 'contact';
  const isAgent = message.role === 'agent';
  
  // Format the timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={`flex items-end ${isCaregiver || isAgent ? 'justify-end' : 'justify-start'} mb-4`}
      data-message-id={message.id}
      data-role={message.role}
    >
      {/* Avatar for patient messages only */}
      {isPatient && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden mr-2 mb-1">
          <div className="bg-green-100 h-full w-full flex items-center justify-center">
            <span className="text-green-500 font-semibold text-xs">D</span>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <div
          className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl ${
            isCaregiver
              ? 'bg-blue-500 text-white rounded-br-none shadow-md'
              : isPatient
                ? 'bg-green-500 text-white rounded-bl-none shadow-md'
                : 'bg-gray-200 text-gray-800 rounded-bl-none shadow-md' // Agent messages (gray)
          }`}
        >
          <div className={`whitespace-pre-wrap text-sm ${isAgent ? 'italic' : ''}`}>{message.content}</div>
        </div>
        
        <div
          className={`text-xs mt-1 ${
            isCaregiver ? 'text-right mr-2' : 'ml-2'
          } text-gray-500`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>

      {/* Avatar for caregiver messages */}
      {isCaregiver && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden ml-2 mb-1">
          <div className="bg-blue-100 h-full w-full flex items-center justify-center">
            <span className="text-blue-500 font-semibold text-xs">C</span>
          </div>
        </div>
      )}
      
      {/* Avatar for agent messages */}
      {isAgent && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden ml-2 mb-1">
          <div className="bg-gray-100 h-full w-full flex items-center justify-center">
            <span className="text-gray-500 font-semibold text-xs">AI</span>
          </div>
        </div>
      )}
    </div>
  );
} 