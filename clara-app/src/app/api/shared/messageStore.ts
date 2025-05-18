// Define the message interface to match what AIChat.tsx expects
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'agent' | 'contact' | 'caregiver';
  timestamp: Date;
}

// In a real application, you would use a database to store messages
// This is a simple in-memory store for demonstration purposes
// Note: This will reset when the server restarts
export const messageStore: Message[] = [];

// Helper function to add a message to the store
export function addMessage(message: Message): Message {
  messageStore.push(message);
  return message;
}

// Helper function to get all messages
export function getAllMessages(): Message[] {
  return messageStore;
}