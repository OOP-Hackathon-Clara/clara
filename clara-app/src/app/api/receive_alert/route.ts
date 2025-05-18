import { NextRequest, NextResponse } from 'next/server';

// Keep track of the last alert time
let lastAlertTime = new Date();

export async function POST(request: NextRequest) {
  // Log a test message to the console
  console.log('TEST: Received alert notification');
  process.stdout.write('TEST: This is a direct write to stdout\n');
  
  // Log the timestamp
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Alert endpoint was called via POST`);
  
  // Update last alert time
  lastAlertTime = new Date();
  
  // Return a success response
  return NextResponse.json({ 
    success: true, 
    message: 'Alert received',
    timestamp
  });
}

export async function GET(request: NextRequest) {
  // Return the last alert time
  return NextResponse.json({
    lastAlert: lastAlertTime.toISOString()
  });
}
