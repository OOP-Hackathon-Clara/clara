'use client';

import { useState } from 'react';
import AIChat from './AIChat';

export default function AIChatWrapper() {
  // This wrapper component is used to handle client-side functionality
  // and avoid hydration issues with server components
  return <AIChat />;
} 