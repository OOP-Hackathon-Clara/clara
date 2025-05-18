'use client';

import { useState, useEffect } from 'react';
import { AIChat, WelcomeScreen, PopupAlert } from '.';
import { onAlert, startAlertPolling, simulateAlert, triggerAlert } from '@/services/alertService';

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

  // Direct trigger for popup without API call
  const handleDirectTrigger = () => {
    setShowAlert(true);
  };

  return (
    <>
      {showWelcome ? (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      ) : (
        <>
          <AIChat />
        </>
      )}
      
      {/* Alert popup */}
      <PopupAlert isOpen={showAlert} onClose={handleCloseAlert} />
    </>
  );
} 