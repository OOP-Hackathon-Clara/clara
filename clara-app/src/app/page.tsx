import { Suspense } from 'react';
import ChatUI from './components/ChatUI';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Suspense fallback={<div className="flex items-center justify-center w-full">Loading...</div>}>
        <ChatUI />
      </Suspense>
    </div>
  );
}
