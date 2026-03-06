'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Palette } from 'lucide-react';

export default function UIEnhancementToggle() {
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ui-enhanced');
    if (saved === 'true') {
      setIsEnhanced(true);
      document.body.classList.add('ui-enhanced');
    }
  }, []);

  const toggleEnhancement = () => {
    const newState = !isEnhanced;
    setIsEnhanced(newState);
    
    if (newState) {
      document.body.classList.add('ui-enhanced');
      localStorage.setItem('ui-enhanced', 'true');
    } else {
      document.body.classList.remove('ui-enhanced');
      localStorage.setItem('ui-enhanced', 'false');
    }
  };

  return (
    <div className="fixed top-20 right-4 z-40 no-print">
      <button
        onClick={toggleEnhancement}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
          isEnhanced
            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
            : 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white'
        } backdrop-blur-sm border border-gray-700/50`}
        title={isEnhanced ? 'Disable Enhanced UI' : 'Enable Enhanced UI'}
      >
        {isEnhanced ? <Sparkles className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
        <span className="text-sm font-medium">
          {isEnhanced ? 'Enhanced' : 'Classic'}
        </span>
      </button>
    </div>
  );
}