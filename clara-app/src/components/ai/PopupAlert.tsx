'use client';

import { useState, useEffect } from 'react';

interface PopupAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PopupAlert({ isOpen, onClose }: PopupAlertProps) {
  if (!isOpen) return null;

  const handleStepBackIn = () => {
    // Find and click the "I want to talk to Mom" button
    const talkToMomButton = document.querySelector('button[type="button"]:not([disabled])') as HTMLButtonElement | null;
    
    if (talkToMomButton && talkToMomButton.textContent?.includes('I want to talk to Mom')) {
      talkToMomButton.click();
    }
    
    // Close the popup and set showAlert to false in the parent component
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg p-6 shadow-xl max-w-md w-full m-4 z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-red-500">Alert: Your loved one seems agitated.</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="py-4">
          <p className="text-gray-600">
          I've noticed signs of distress in their recent messages. When you're available, please consider joining the conversation to offer comfort or reassurance.
          </p>
        </div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            onClick={handleStepBackIn}
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
          >
            Step back in
          </button>
        </div>
      </div>
    </div>
  );
} 