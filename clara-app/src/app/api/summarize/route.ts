import { NextRequest, NextResponse } from 'next/server';

// Define your request and response types
interface SummarizeRequest {
  messages: Array<{
    text: string;
    role: string;
  }>;
}

interface SummarizeResponse {
  success: boolean;
  summary?: string;
  error?: string;
}

// The specific endpoint URL
const SUMMARIZE_ENDPOINT = 'http://clara.loca.lt/summarize';

export async function POST(req: NextRequest) {
    process.stdout.write(`Test\n`);

    try {
    // Parse the request body
    const requestData: SummarizeRequest = await req.json();

    // Validate the request data
    if (!requestData.messages || !Array.isArray(requestData.messages) || requestData.messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Valid messages array is required' },
        { status: 400 }
      );
    }

    process.stdout.write(`Sending messages to summarize: ${JSON.stringify(requestData.messages, null, 2)}\n`);

    // Prepare headers for the external service request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Make the POST request to the summarize endpoint
    const response = await fetch(SUMMARIZE_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
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
      
      process.stderr.write(`Summarize API error: ${errorMessage}\n`);
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: response.status }
      );
    }

    // Parse the response from the external service
    const responseText = await response.text();
    process.stdout.write(`Summarize API response: ${responseText}\n`);

    // Return the successful response
    return NextResponse.json({
      success: true,
      summary: responseText
    });
    
  } catch (error) {
    process.stderr.write(`Summarize API error: ${error}\n`);
    
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 