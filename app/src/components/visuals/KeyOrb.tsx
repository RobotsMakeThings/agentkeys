'use client';

import React, { useEffect, useRef } from 'react';

interface KeyOrbProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function KeyOrb({ size = 200, className = '', animated = true }: KeyOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !orbRef.current) return;

    const orb = orbRef.current;
    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.01;
      
      // Rotation animation
      orb.style.transform = `rotate(${time * 20}deg)`;
      
      // Pulse animation
      const pulse = 0.9 + 0.1 * Math.sin(time * 2);
      orb.style.transform += ` scale(${pulse})`;
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animated]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 blur-xl animate-pulse" />
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Main orb container */}
      <div
        ref={orbRef}
        className="relative z-10 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-blue-600 p-1"
        style={{ width: size * 0.7, height: size * 0.7 }}
      >
        {/* Inner orb surface */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-card via-elevated to-card border border-medium overflow-hidden">
          
          {/* Key icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width={size * 0.25}
              height={size * 0.25}
              viewBox="0 0 24 24"
              fill="none"
              className="text-gradient"
            >
              <path
                d="M7 10V7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7V10M7 10H17M7 10H5C4.44772 10 4 10.4477 4 11V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.4477 20 19V11C20 10.4477 19.5523 10 19 10H17M11 14V16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              />
            </svg>
          </div>
          
          {/* Data streams */}
          {animated && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-0.5 data-stream"
                  style={{
                    top: `${20 + i * 10}%`,
                    animationDelay: `${i * 0.3}s`,
                    opacity: 0.3,
                  }}
                />
              ))}
            </>
          )}
          
          {/* Neural connections */}
          <div className="absolute inset-0 neural-pulse">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0066ff', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#7c5cff', stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>
              
              {/* Connection lines */}
              <path
                d="M20 30 Q 50 10 80 30"
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                fill="none"
                className="neural-pulse"
              />
              <path
                d="M20 50 Q 50 70 80 50"
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                fill="none"
                className="neural-pulse"
                style={{ animationDelay: '1s' }}
              />
              <path
                d="M30 20 Q 50 50 70 80"
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                fill="none"
                className="neural-pulse"
                style={{ animationDelay: '2s' }}
              />
            </svg>
          </div>
          
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-violet-500/10 rounded-full" />
          
        </div>
      </div>
      
      {/* Floating data points */}
      {animated && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping"
              style={{
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}