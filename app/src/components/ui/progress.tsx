import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function Progress({ 
  value, 
  max = 100, 
  className = '', 
  size = 'md',
  variant = 'default'
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variants = {
    default: 'bg-gradient-to-r from-blue-500 to-violet-500',
    success: 'bg-success',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={`w-full bg-medium rounded-full overflow-hidden ${sizes[size]} ${className}`}>
      <div 
        className={`${sizes[size]} transition-all duration-300 ease-out ${variants[variant]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}