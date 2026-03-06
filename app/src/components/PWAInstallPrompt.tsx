'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isPWA = isStandalone || isInWebAppiOS;
    
    if (isPWA) {
      setIsInstalled(true);
      return;
    }

    // Detect platform
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroidDevice = /Android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Handle beforeinstallprompt for Android/Chrome
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay (don't interrupt immediately)
      setTimeout(() => {
        setShowPrompt(true);
      }, 10000); // Show after 10 seconds
    };

    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (!dismissed) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
      
      // For iOS, show instructions after delay if not installed
      if (isIOSDevice) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 15000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setShowPrompt(false);
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Install prompt failed:', error);
      }
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    
    // Allow showing again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  const resetDismissal = () => {
    localStorage.removeItem('pwa-install-dismissed');
    setShowPrompt(true);
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt) {
    return (
      <div className="hidden">
        {/* Hidden trigger for re-showing install prompt */}
        <button
          onClick={resetDismissal}
          className="text-xs text-gray-500 hover:text-gray-400"
          title="Show install prompt"
        >
          Install App
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Main install prompt */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-900/95 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-4 shadow-2xl z-50 animate-slideUp">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
              {isIOS ? <Smartphone className="h-6 w-6 text-cyan-400" /> : <Download className="h-6 w-6 text-cyan-400" />}
            </div>
            <div>
              <h3 className="font-semibold text-white">Install AgentKeys</h3>
              <p className="text-sm text-gray-400">Get the full app experience</p>
            </div>
          </div>
          <button 
            onClick={dismissPrompt}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-green-400">✓</span>
            Offline access to your agent hubs
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-green-400">✓</span>
            Push notifications for key updates
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-green-400">✓</span>
            Faster loading and better performance
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 gradient-agentkeys hover:opacity-90 px-4 py-2 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
          >
            {isIOS ? <Share className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {isIOS ? 'Install Guide' : 'Install App'}
          </button>
          <button
            onClick={dismissPrompt}
            className="px-4 py-2 border border-gray-600 hover:bg-gray-800 rounded-xl font-medium text-gray-300 transition-colors"
          >
            Later
          </button>
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-cyan-400/30 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold gradient-agentkeys-text">Install on iOS</h3>
              <button 
                onClick={() => setShowIOSInstructions(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <p className="text-white font-medium">Tap the Share button</p>
                  <p className="text-gray-400 text-sm">Look for <Share className="inline h-4 w-4 mx-1" /> in Safari's toolbar</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <p className="text-white font-medium">Select "Add to Home Screen"</p>
                  <p className="text-gray-400 text-sm">Scroll down in the share menu to find this option</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <p className="text-white font-medium">Tap "Add" to install</p>
                  <p className="text-gray-400 text-sm">AgentKeys will appear on your home screen</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-center text-gray-400 text-sm">
                Once installed, you'll get offline access and push notifications!
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}