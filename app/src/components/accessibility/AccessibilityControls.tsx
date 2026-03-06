'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Eye, 
  Type, 
  Zap, 
  Focus, 
  Keyboard, 
  Volume2,
  Contrast,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

export function AccessibilityControls() {
  const { settings, updateSettings, announceToScreenReader } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleHighContrast = () => {
    const newValue = !settings.highContrast;
    updateSettings({ highContrast: newValue });
    announceToScreenReader(`High contrast mode ${newValue ? 'enabled' : 'disabled'}`);
  };

  const handleToggleReducedMotion = () => {
    const newValue = !settings.reducedMotion;
    updateSettings({ reducedMotion: newValue });
    announceToScreenReader(`Reduced motion ${newValue ? 'enabled' : 'disabled'}`);
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large' | 'x-large') => {
    updateSettings({ fontSize: size });
    announceToScreenReader(`Font size changed to ${size}`);
  };

  const handleToggleScreenReader = () => {
    const newValue = !settings.screenReader;
    updateSettings({ screenReader: newValue });
    announceToScreenReader(`Screen reader optimizations ${newValue ? 'enabled' : 'disabled'}`);
  };

  const handleToggleFocusVisible = () => {
    const newValue = !settings.focusVisible;
    updateSettings({ focusVisible: newValue });
    announceToScreenReader(`Focus indicators ${newValue ? 'enabled' : 'disabled'}`);
  };

  const handleToggleKeyboardNavigation = () => {
    const newValue = !settings.keyboardNavigation;
    updateSettings({ keyboardNavigation: newValue });
    announceToScreenReader(`Keyboard navigation ${newValue ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`glass-effect rounded-xl transition-all duration-300 ${
        isOpen ? 'p-6 w-80' : 'p-3 w-auto'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            announceToScreenReader(`Accessibility controls ${isOpen ? 'closed' : 'opened'}`);
          }}
          className="flex items-center space-x-2 text-primary hover:text-blue transition-colors"
          aria-label={`${isOpen ? 'Close' : 'Open'} accessibility controls`}
          aria-expanded={isOpen}
          aria-controls="accessibility-controls"
        >
          <Settings className="w-5 h-5" />
          {isOpen ? (
            <>
              <span>Accessibility</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Controls Panel */}
        {isOpen && (
          <div 
            id="accessibility-controls" 
            className="mt-4 space-y-4"
            role="region"
            aria-label="Accessibility settings"
          >
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Contrast className="w-4 h-4 text-secondary" />
                <label 
                  htmlFor="high-contrast-toggle"
                  className="text-sm font-medium"
                >
                  High Contrast
                </label>
              </div>
              <button
                id="high-contrast-toggle"
                onClick={handleToggleHighContrast}
                className={`w-10 h-6 rounded-full transition-colors ${
                  settings.highContrast 
                    ? 'bg-blue' 
                    : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.highContrast}
                aria-label={`High contrast mode ${settings.highContrast ? 'on' : 'off'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.highContrast ? 'translate-x-5' : 'translate-x-1'
                } mt-1`} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-secondary" />
                <label 
                  htmlFor="reduced-motion-toggle"
                  className="text-sm font-medium"
                >
                  Reduce Motion
                </label>
              </div>
              <button
                id="reduced-motion-toggle"
                onClick={handleToggleReducedMotion}
                className={`w-10 h-6 rounded-full transition-colors ${
                  settings.reducedMotion 
                    ? 'bg-blue' 
                    : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.reducedMotion}
                aria-label={`Reduced motion ${settings.reducedMotion ? 'on' : 'off'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-1'
                } mt-1`} />
              </button>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">Font Size</span>
              </div>
              <div 
                className="grid grid-cols-4 gap-1"
                role="radiogroup"
                aria-label="Font size selection"
              >
                {(['small', 'medium', 'large', 'x-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      settings.fontSize === size
                        ? 'bg-blue text-white'
                        : 'bg-card hover:bg-elevated'
                    }`}
                    role="radio"
                    aria-checked={settings.fontSize === size}
                    aria-label={`${size} font size`}
                  >
                    {size === 'x-large' ? 'XL' : size.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-secondary" />
                <label 
                  htmlFor="screen-reader-toggle"
                  className="text-sm font-medium"
                >
                  Screen Reader
                </label>
              </div>
              <button
                id="screen-reader-toggle"
                onClick={handleToggleScreenReader}
                className={`w-10 h-6 rounded-full transition-colors ${
                  settings.screenReader 
                    ? 'bg-blue' 
                    : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.screenReader}
                aria-label={`Screen reader optimizations ${settings.screenReader ? 'on' : 'off'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.screenReader ? 'translate-x-5' : 'translate-x-1'
                } mt-1`} />
              </button>
            </div>

            {/* Focus Indicators */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Focus className="w-4 h-4 text-secondary" />
                <label 
                  htmlFor="focus-visible-toggle"
                  className="text-sm font-medium"
                >
                  Focus Indicators
                </label>
              </div>
              <button
                id="focus-visible-toggle"
                onClick={handleToggleFocusVisible}
                className={`w-10 h-6 rounded-full transition-colors ${
                  settings.focusVisible 
                    ? 'bg-blue' 
                    : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.focusVisible}
                aria-label={`Focus indicators ${settings.focusVisible ? 'on' : 'off'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.focusVisible ? 'translate-x-5' : 'translate-x-1'
                } mt-1`} />
              </button>
            </div>

            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Keyboard className="w-4 h-4 text-secondary" />
                <label 
                  htmlFor="keyboard-nav-toggle"
                  className="text-sm font-medium"
                >
                  Keyboard Navigation
                </label>
              </div>
              <button
                id="keyboard-nav-toggle"
                onClick={handleToggleKeyboardNavigation}
                className={`w-10 h-6 rounded-full transition-colors ${
                  settings.keyboardNavigation 
                    ? 'bg-blue' 
                    : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={settings.keyboardNavigation}
                aria-label={`Keyboard navigation ${settings.keyboardNavigation ? 'on' : 'off'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.keyboardNavigation ? 'translate-x-5' : 'translate-x-1'
                } mt-1`} />
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                updateSettings({
                  highContrast: false,
                  reducedMotion: false,
                  fontSize: 'medium',
                  screenReader: false,
                  focusVisible: true,
                  keyboardNavigation: true,
                });
                announceToScreenReader('Accessibility settings reset to default');
              }}
              className="w-full py-2 px-4 bg-card hover:bg-elevated rounded-lg text-sm font-medium transition-colors"
              aria-label="Reset all accessibility settings to default"
            >
              Reset to Default
            </button>
          </div>
        )}
      </div>
    </div>
  );
}