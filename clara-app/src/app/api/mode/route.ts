import { NextRequest, NextResponse } from 'next/server';

// Define the request body type
interface SetModeRequest {
  agent: boolean;
}

// Simple in-memory storage for the mode
// In a production app, this would be stored in a database
let currentMode = { agent: false };

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json() as SetModeRequest;
    
    // Validate the request body
    if (typeof body.agent !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body. "agent" field must be a boolean.' },
        { status: 400 }
      );
    }
    
    // Update the current mode
    currentMode = { agent: body.agent };
    
    // Return the updated mode
    return NextResponse.json({ 
      success: true, 
      mode: currentMode 
    });
    
  } catch (error) {
    console.error('Error setting mode:', error);
    return NextResponse.json(
      { error: 'Failed to set mode' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve the current mode
export async function GET() {
  return NextResponse.json({ mode: currentMode });
} 