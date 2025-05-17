'use client';

import { useState } from 'react';

interface SendIMessageProps {
  defaultRecipient?: string;
}

type Role = 'caregiver' | 'patient' | 'chat';

export default function SendIMessage({ defaultRecipient = '' }: SendIMessageProps) {
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [message, setMessage] = useState('');
  const [role, setRole] = useState<Role>('caregiver');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !message) {
      alert('Please provide both recipient and message');
      return;
    }
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/imessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient,
          message,
          role: role === 'chat' ? 'agent' : role,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setResponse(data);
      setStatus('success');
      setMessage(''); // Clear message input on success
    } catch (error) {
      console.error('Error sending iMessage:', error);
      setStatus('error');
      setResponse(error instanceof Error ? { error: error.message } : { error: 'An unknown error occurred' });
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Send iMessage</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Phone Number
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="+1234567890"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setRole('caregiver')}
              className={`px-3 py-1 text-xs rounded-full ${
                role === 'caregiver'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Caregiver
            </button>
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`px-3 py-1 text-xs rounded-full ${
                role === 'patient'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('chat')}
              className={`px-3 py-1 text-xs rounded-full ${
                role === 'chat'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Chat
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-2 px-4 rounded-md ${
            status === 'loading'
              ? 'bg-gray-400 cursor-not-allowed'
              : role === 'caregiver'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : role === 'patient'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      
      {status === 'success' && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          Message sent successfully!
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          Error: {response?.error || 'Failed to send message'}
        </div>
      )}
    </div>
  );
} 