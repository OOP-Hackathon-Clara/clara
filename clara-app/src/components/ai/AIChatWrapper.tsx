'use client';

import { useState, useEffect } from 'react';
import { AIChat, WelcomeScreen, PopupAlert } from '.';
import { onAlert, startAlertPolling, simulateAlert } from '@/services/alertService';

export default function AIChatWrapper() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  
  // Set up alert listener
  useEffect(() => {
    // Start polling for alerts
    const stopPolling = startAlertPolling(10000); // Check every 10 seconds
    
    // Register alert listener
    const removeListener = onAlert(() => {
      console.log('Alert received in AIChatWrapper');
      setShowAlert(true);
    });
    
    // Clean up on unmount
    return () => {
      stopPolling();
      removeListener();
    };
  }, []);
  
  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  
  // For testing - add a button to simulate an alert
  const handleTestAlert = () => {
    simulateAlert();
  };

  return (
    <>
      {showWelcome ? (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      ) : (
        <>
          <AIChat />
          
          {/* Hidden test button in corner */}
          <button 
            onClick={handleTestAlert}
            className="fixed bottom-4 right-4 bg-gray-200 p-2 rounded-full opacity-50 hover:opacity-100"
            title="Test Alert"
          >
            🔔
          </button>
        </>
      )}
      
      {/* Alert popup */}
      <PopupAlert isOpen={showAlert} onClose={handleCloseAlert} />
    </>
  );
} 