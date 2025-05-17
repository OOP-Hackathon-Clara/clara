import AIChatWrapper from '@/components/ai/AIChatWrapper';
import Link from 'next/link';

export const metadata = {
  title: 'GPT Chat - Clara App',
  description: 'Chat with GPT models',
};

export default function AIPage() {
  return (
    <div className="w-screen h-screen items-center justify-center bg-gray-100">
      <AIChatWrapper />
    </div>
  );
} 