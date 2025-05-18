'use client';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-6 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to Clara</h3>
        <p className="text-gray-600 mb-4">
          This app helps caregivers like you support loved ones with dementia by providing an AI-powered chat companion that can engage patients through familiar messaging platforms.
        </p>
        <p className="text-gray-600 mb-4">
          When a patient enters a memory loop or you are unavailable, you can opt into the AI agent to gently take over the conversation, offering comfort, routine, and connection.
        </p>
        <button
          type="button"
          onClick={onGetStarted}
          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Get Started
        </button>
      </div>
    </div>
  );
} 