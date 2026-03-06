import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  ...props 
}: ButtonProps) {
  const variants = {
    default: 'bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:shadow-lg hover:shadow-blue-500/25',
    outline: 'border border-subtle text-primary hover:bg-elevated',
    ghost: 'text-secondary hover:text-primary hover:bg-elevated/50',
    success: 'bg-success text-white hover:bg-success/90',
    error: 'bg-red-500 text-white hover:bg-red-600'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all touch-manipulation ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}