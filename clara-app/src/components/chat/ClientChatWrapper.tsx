'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled to avoid hydration issues with date objects
const ChatInterface = dynamic(() => import('./ChatInterface'), { ssr: false });

export default function ClientChatWrapper() {
  return <ChatInterface />;
}
