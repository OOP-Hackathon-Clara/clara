import AIChatWrapper from '@/components/ai/AIChatWrapper';

export const metadata = {
  title: 'Chat with Dad - Clara App',
  description: 'Chat with Dad using AI',
};

export default function AIPage() {
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
      {/* Simple header bar with just the name "Dad" */}
      <div className="bg-white p-4 shadow-sm text-center">
        <h1 className="text-lg font-medium">Dad</h1>
      </div>
      
      {/* Chat wrapper taking up the rest of the space */}
      <div className="flex-1">
        <AIChatWrapper />
      </div>
    </div>
  );
} 