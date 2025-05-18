'use client';

import { useState } from 'react';
import { AIChat, WelcomeScreen } from '.';

export default function AIChatWrapper() {
  const [showWelcome, setShowWelcome] = useState(true);
  
  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }
  
  return <AIChat />;
} 