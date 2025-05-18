import AIChatWrapper from '@/components/ai/AIChatWrapper';

export const metadata = {
  title: 'Chat with Mom - Clara App',
  description: 'Chat with Mom using AI',
};

export default function AIPage() {
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">      
      {/* Chat wrapper taking up the rest of the space */}
      <div className="flex-1">
        <AIChatWrapper />
      </div>
    </div>
  );
} 