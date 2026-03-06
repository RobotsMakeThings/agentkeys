// Push Notification Hook for AgentKeys
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface NotificationPermissionState {
  permission: NotificationPermission;
  supported: boolean;
  subscription: PushSubscription | null;
  isLoading: boolean;
  error: string | null;
}

interface PushNotificationHook extends NotificationPermissionState {
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<PushSubscription | null>;
  unsubscribe: () => Promise<boolean>;
  sendTestNotification: () => void;
  showNotification: (title: string, options?: NotificationOptions) => void;
}

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'demo-key';

export function usePushNotifications(): PushNotificationHook {
  const { publicKey } = useWallet();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if push notifications are supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSupported = 'Notification' in window && 
                         'serviceWorker' in navigator && 
                         'PushManager' in window;
      setSupported(isSupported);
      
      if (isSupported) {
        setPermission(Notification.permission);
        loadExistingSubscription();
      }
    }
  }, []);

  // Load existing push subscription
  const loadExistingSubscription = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const existingSub = await registration.pushManager.getSubscription();
        setSubscription(existingSub);
      }
    } catch (err) {
      console.error('Failed to load existing subscription:', err);
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!supported) {
      setError('Push notifications not supported');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        await subscribe();
        return true;
      } else {
        setError('Notification permission denied');
        return false;
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to request permission';
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [supported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!supported || permission !== 'granted') {
      setError('Notifications not permitted');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      setSubscription(pushSubscription);

      // Send subscription to server
      if (publicKey) {
        await sendSubscriptionToServer(pushSubscription, publicKey.toString());
      }

      return pushSubscription;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [supported, permission, publicKey]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) return true;

    setIsLoading(true);
    setError(null);

    try {
      const success = await subscription.unsubscribe();
      
      if (success) {
        setSubscription(null);
        
        // Remove subscription from server
        if (publicKey) {
          await removeSubscriptionFromServer(publicKey.toString());
        }
      }

      return success;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription, publicKey]);

  // Send test notification
  const sendTestNotification = useCallback(() => {
    if (permission === 'granted') {
      showNotification('AgentKeys Test', {
        body: 'Push notifications are working! 🎉',
        icon: '/agentkeys-logo.png',
        tag: 'test-notification',
        requireInteraction: false,
        data: {
          url: '/',
          timestamp: Date.now()
        }
      });
    }
  }, [permission]);

  // Show notification
  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      const defaultOptions: NotificationOptions = {
        icon: '/agentkeys-logo.png',
        requireInteraction: false,
        ...options
      };

      new Notification(title, defaultOptions);
    }
  }, [permission]);

  return {
    permission,
    supported,
    subscription,
    isLoading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    showNotification,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

// Send subscription to server
async function sendSubscriptionToServer(subscription: PushSubscription, walletAddress: string) {
  try {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        walletAddress,
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send subscription to server');
    }

    console.log('Subscription sent to server successfully');
  } catch (error) {
    console.error('Error sending subscription to server:', error);
    throw error;
  }
}

// Remove subscription from server
async function removeSubscriptionFromServer(walletAddress: string) {
  try {
    const response = await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove subscription from server');
    }

    console.log('Subscription removed from server successfully');
  } catch (error) {
    console.error('Error removing subscription from server:', error);
    throw error;
  }
}

// Predefined notification types for AgentKeys
export const NotificationTypes = {
  KEY_PURCHASE: 'key_purchase',
  KEY_SALE: 'key_sale', 
  PRICE_ALERT: 'price_alert',
  NEW_CONTENT: 'new_content',
  AGENT_UPDATE: 'agent_update',
  COMMUNITY_MESSAGE: 'community_message',
  SYSTEM_UPDATE: 'system_update',
} as const;

export type NotificationType = typeof NotificationTypes[keyof typeof NotificationTypes];

// Helper function for creating AgentKeys-specific notifications
export function createAgentKeysNotification(
  type: NotificationType, 
  data: {
    agentName?: string;
    message: string;
    url?: string;
    amount?: number;
    percentage?: number;
  }
) {
  const { agentName, message, url = '/', amount, percentage } = data;
  
  const notificationConfigs = {
    [NotificationTypes.KEY_PURCHASE]: {
      title: `🔑 Key Purchase${agentName ? ` - ${agentName}` : ''}`,
      body: message,
      tag: 'key-purchase',
      requireInteraction: true,
    },
    [NotificationTypes.KEY_SALE]: {
      title: `💰 Key Sale${agentName ? ` - ${agentName}` : ''}`,
      body: message,
      tag: 'key-sale',
      requireInteraction: true,
    },
    [NotificationTypes.PRICE_ALERT]: {
      title: `📈 Price Alert${agentName ? ` - ${agentName}` : ''}`,
      body: `${message}${percentage ? ` (${percentage > 0 ? '+' : ''}${percentage}%)` : ''}`,
      tag: `price-${agentName?.toLowerCase().replace(/\s+/g, '-') || 'alert'}`,
      requireInteraction: false,
    },
    [NotificationTypes.NEW_CONTENT]: {
      title: `📄 New Content${agentName ? ` - ${agentName}` : ''}`,
      body: message,
      tag: 'new-content',
      requireInteraction: false,
    },
    [NotificationTypes.AGENT_UPDATE]: {
      title: `🤖 Agent Update${agentName ? ` - ${agentName}` : ''}`,
      body: message,
      tag: 'agent-update',
      requireInteraction: false,
    },
    [NotificationTypes.COMMUNITY_MESSAGE]: {
      title: `💬 New Message${agentName ? ` - ${agentName}` : ''}`,
      body: message,
      tag: 'community-message',
      requireInteraction: false,
    },
    [NotificationTypes.SYSTEM_UPDATE]: {
      title: '⚙️ AgentKeys Update',
      body: message,
      tag: 'system-update',
      requireInteraction: true,
    },
  };

  return {
    ...notificationConfigs[type],
    icon: '/agentkeys-logo.png',
    data: { url, timestamp: Date.now(), type, agentName }
  };
}