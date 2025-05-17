import { NextRequest, NextResponse } from 'next/server';

// Define your request and response types
interface IMessageRequest {
  recipient: string;
  message: string;
  role?: 'caregiver' | 'patient' | 'agent';
}

interface IMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// The specific endpoint URL
const SMS_ENDPOINT = 'https://d8e8-184-23-234-162.ngrok-free.app/sms';

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

    // Prepare headers for the external service request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Make the POST request to the specific endpoint
    const response = await fetch(SMS_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: requestData.recipient,
        message: requestData.message,
        // Include role if provided
        // ...(requestData.role && { role: requestData.role })
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      let errorMessage = `Error: ${response.status} ${response.statusText}`;
      
      try {
        // Try to parse error response if available
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // If we can't parse the error response, use the default error message
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: response.status }
      );
    }

    // Parse the response from the external service
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      // If the response is not JSON, create a simple success response
      responseData = { success: true };
    }

    // Return the successful response
    return NextResponse.json({
      success: true,
      ...responseData
    });
    
  } catch (error) {
    console.error('iMessage API error:', error);
    
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
