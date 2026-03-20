'use client'

import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  disabled = false,
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:ring-offset-2 focus:ring-offset-[#04030a] disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white hover:opacity-90',
    secondary: 'bg-[rgba(255,255,255,.035)] text-[#f5f2ef] border border-[rgba(255,255,255,.09)] hover:bg-[rgba(255,255,255,.05)]',
    ghost: 'text-[#f5f2ef] hover:text-[#9333ea] hover:bg-[rgba(147,51,234,.1)]'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <button 
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}