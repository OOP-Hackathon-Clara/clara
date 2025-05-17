import { NextRequest, NextResponse } from 'next/server';

// Define your request and response types
interface IMessageRequest {
  recipient: string;
  message: string;
  role?: 'caregiver' | 'patient' | 'system';
  // Add any other fields needed for your request
}

interface IMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  // Add any other fields expected in the response
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const requestData: IMessageRequest = await req.json();

    // Validate the request data
    if (!requestData.recipient || !requestData.message) {
      return NextResponse.json(
        { success: false, error: 'Recipient and message are required' },
        { status: 400 }
      );
    }

    // Get the external service URL and any API keys from environment variables
    const serviceUrl = process.env.IMESSAGE_SERVICE_URL;
    const apiKey = process.env.IMESSAGE_API_KEY;

    if (!serviceUrl) {
      return NextResponse.json(
        { success: false, error: 'iMessage service URL is not configured on the server' },
        { status: 500 }
      );
    }

    // Prepare headers for the external service request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add API key to headers if available
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Make the POST request to the external service
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: requestData.recipient,
        body: requestData.message,
        role: requestData.role || 'system',
        // Add any other fields needed by the external service
      }),
    });

    // Parse the response from the external service
    const responseData: IMessageResponse = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: responseData.error || `Error: ${response.status} ${response.statusText}` 
        },
        { status: response.status }
      );
    }

    // Return the successful response
    return NextResponse.json({
      success: true,
      messageId: responseData.messageId,
      // Include any other relevant response data
    });
    
  } catch (error) {
    console.error('iMessage API error:', error);
    
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
