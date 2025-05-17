import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured on the server' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client with the API key from environment variable
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // You can change this to any available model
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides clear and concise responses.',
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract the response content
    const content = response.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('GPT Chat API error:', error);
    
    // Handle different types of errors
    if (error instanceof OpenAI.APIError) {
      const status = error.status || 500;
      const message = error.message || 'OpenAI API error';
      
      return NextResponse.json(
        { error: message },
        { status }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 