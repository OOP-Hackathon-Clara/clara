import { NextRequest, NextResponse } from 'next/server';
import { Message, messageStore, addMessage } from '../shared/messageStore';

// In a real application, you would use a database to store messages
// This is a simple in-memory store for demonstration purposes
// Note: This will reset when the server restarts

export async function POST(req: NextRequest) {
  try {
    const { text, role = 'contact' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Message text is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'contact' && role !== 'agent' && role !== 'user') {
      return NextResponse.json(
        { error: 'Role must be either "contact", "agent", or "user"' },
        { status: 400 }
      );
    }

    // Create a new message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: role as 'user' | 'agent' | 'contact',
      timestamp: new Date(),
    };

    // Add to our shared message store
    addMessage(newMessage);

    return NextResponse.json({
      success: true,
      message: 'Message received and added to chat',
      messageId: newMessage.id,
    });
  } catch (error) {
    console.error('Message API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all messages from the shared store
  return NextResponse.json({
    messages: messageStore,
  });
}