'use client';

// Event emitter for alert notifications
type AlertListener = () => void;
const listeners: AlertListener[] = [];

// Last check timestamp to avoid duplicate alerts
let lastCheckTime = new Date();

/**
 * Add a listener for alert notifications
 * @param listener Function to call when an alert is received
 * @returns Function to remove the listener
 */
export function onAlert(listener: AlertListener): () => void {
  listeners.push(listener);
  
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

/**
 * Notify all listeners of a new alert
 */
function notifyListeners(): void {
  console.log(`Notifying ${listeners.length} listeners of new alert`);
  listeners.forEach(listener => listener());
}

/**
 * Check for new alerts
 */
async function checkForAlerts(): Promise<void> {
  try {
    const response = await fetch('/api/receive_alert', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Check if there's a new alert based on timestamp
      if (data.lastAlert) {
        const lastAlertTime = new Date(data.lastAlert);
        
        // If the last alert is newer than our last check, notify listeners
        if (lastAlertTime > lastCheckTime) {
          console.log('New alert detected!', { lastAlertTime, lastCheckTime });
          notifyListeners();
          lastCheckTime = new Date(); // Update our last check time
        }
      }
    }
  } catch (error) {
    console.error('Error checking for alerts:', error);
  }
}

/**
 * Start polling for alerts
 * @param intervalMs Polling interval in milliseconds
 * @returns Function to stop polling
 */
export function startAlertPolling(intervalMs: number = 5000): () => void {
  // Set initial check time
  lastCheckTime = new Date();
  
  const intervalId = setInterval(checkForAlerts, intervalMs);
  return () => clearInterval(intervalId);
}

/**
 * Simulate receiving an alert (for testing)
 */
export async function simulateAlert(): Promise<void> {
  try {
    console.log('Simulating alert via API call...');
    const response = await fetch('/api/receive_alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('Alert API call successful, notifying listeners');
      // Notify listeners immediately without waiting for the next poll
      notifyListeners();
    } else {
      console.error('Alert API call failed:', await response.text());
    }
  } catch (error) {
    console.error('Error simulating alert:', error);
  }
}

// Export a function to manually trigger the alert (for testing)
export function triggerAlert(): void {
  console.log('Manually triggering alert notification');
  notifyListeners();
} 