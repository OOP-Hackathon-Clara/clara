import { NextRequest, NextResponse } from 'next/server';
import { getMode, setMode } from '@/lib/mode';

// Define the request body type
interface SetModeRequest {
  agent: boolean;
}

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
    
    // Update the current mode using the shared manager
    setMode({ agent: body.agent });
    
    // Return the updated mode
    return NextResponse.json({ 
      success: true, 
      mode: getMode() 
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
  return NextResponse.json({ mode: getMode() });
} 