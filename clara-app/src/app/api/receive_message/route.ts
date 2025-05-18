import { NextRequest, NextResponse } from 'next/server';

// In a real application, you would use a database to store messages
// This is a simple in-memory store for demonstration purposes
// Note: This will reset when the server restarts
let messageStore: {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}[] = [];

export async function POST(req: NextRequest) {
  try {
    const { text, sender = 'other' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Message text is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate sender
    if (sender !== 'user' && sender !== 'other') {
      return NextResponse.json(
        { error: 'Sender must be either "user" or "other"' },
        { status: 400 }
      );
    }

    // Create a new message
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };

    // Add to our message store
    messageStore.push(newMessage);

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
  // Return all messages
  return NextResponse.json({
    messages: messageStore,
  });
}