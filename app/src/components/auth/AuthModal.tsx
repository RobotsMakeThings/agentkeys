'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Github, Eye, EyeOff, Loader2, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isValidEmail, validatePassword } from '@/lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, mode: initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, loginWithGithub, loginWithWallet } = useAuth();

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'signup') {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message!;
      }
    }

    // Name validation (signup only)
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.email, formData.password, formData.name.trim());
      }

      if (result.success) {
        onClose();
        // Reset form
        setFormData({ email: '', password: '', name: '', confirmPassword: '' });
        setErrors({});
      } else {
        setErrors({ general: result.error || 'Authentication failed' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsSubmitting(true);
    
    try {
      // In production, implement proper GitHub OAuth flow
      // For demo purposes, simulate GitHub data
      const mockGithubData = {
        id: Date.now(),
        login: 'demo-user',
        name: 'Demo User',
        email: 'demo@github.local',
        avatar_url: 'https://github.com/github.png'
      };

      const result = await loginWithGithub(mockGithubData);
      
      if (result.success) {
        onClose();
      } else {
        setErrors({ general: result.error || 'GitHub login failed' });
      }
    } catch (error) {
      setErrors({ general: 'GitHub login failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalletConnect = async () => {
    setIsSubmitting(true);
    
    try {
      // In production, use actual wallet connection (MetaMask, etc.)
      // For demo purposes, simulate wallet connection
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Request account access
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        
        const result = await loginWithWallet(walletAddress);
        
        if (result.success) {
          onClose();
        } else {
          setErrors({ general: result.error || 'Wallet connection failed' });
        }
      } else {
        // No wallet detected, simulate for demo
        const mockWalletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
        
        const result = await loginWithWallet(mockWalletAddress);
        
        if (result.success) {
          onClose();
        } else {
          setErrors({ general: result.error || 'Wallet connection failed' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Wallet connection failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrors({});
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-8 w-full max-w-md relative shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          disabled={isSubmitting}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400">
            {mode === 'login' 
              ? 'Sign in to access your AgentCards collection'
              : 'Join AgentCards and get your own wallet automatically'
            }
          </p>
        </div>

        {/* Quick Auth Options */}
        <div className="space-y-3 mb-6">
          
          {/* GitHub Login */}
          <button
            onClick={handleGithubLogin}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-[#24292e] hover:bg-[#1a1e22] text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
          </button>

          {/* Wallet Connect */}
          <button
            onClick={handleWalletConnect}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <Wallet className="w-5 h-5" />
            <span>Connect Wallet</span>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name (signup only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-red-500/50 focus:ring-red-500/50' 
                      : 'border-gray-600/50 focus:border-blue-500/50 focus:ring-blue-500/50'
                  }`}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.email 
                    ? 'border-red-500/50 focus:ring-red-500/50' 
                    : 'border-gray-600/50 focus:border-blue-500/50 focus:ring-blue-500/50'
                }`}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.password 
                    ? 'border-red-500/50 focus:ring-red-500/50' 
                    : 'border-gray-600/50 focus:border-blue-500/50 focus:ring-blue-500/50'
                }`}
                placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password (signup only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword 
                      ? 'border-red-500/50 focus:ring-red-500/50' 
                      : 'border-gray-600/50 focus:border-blue-500/50 focus:ring-blue-500/50'
                  }`}
                  placeholder="Confirm your password"
                  disabled={isSubmitting}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
          </button>
        </form>

        {/* Auth Method Info */}
        <div className="mt-6 space-y-3">
          {mode === 'signup' && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="text-blue-400 font-medium text-sm">New Wallet Creation</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Email/GitHub signup creates a new wallet for you. You'll get the private keys!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">⚡</span>
              </div>
              <div>
                <p className="text-purple-400 font-medium text-sm">Flexible Login Options</p>
                <p className="text-gray-400 text-xs mt-1">
                  Connect existing wallet OR create new account with auto-generated wallet
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={switchMode}
            className="text-gray-400 hover:text-white transition-colors text-sm"
            disabled={isSubmitting}
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  );
}