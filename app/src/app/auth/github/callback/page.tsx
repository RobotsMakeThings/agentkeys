'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGithub } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    handleGitHubCallback();
  }, []);

  const handleGitHubCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setError('GitHub authentication was cancelled or failed');
        return;
      }

      if (!code) {
        setStatus('error');
        setError('No authorization code received from GitHub');
        return;
      }

      // In production, exchange code for access token with your backend
      // For demo purposes, simulate GitHub user data
      const mockGithubResponse = await simulateGitHubAPI(code);
      
      // Login with GitHub data  
      const result = await loginWithGithub(mockGithubResponse.user);
      
      if (result.success) {
        setStatus('success');
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setStatus('error');
        setError(result.error || 'Login failed');
      }

    } catch (error) {
      console.error('GitHub callback error:', error);
      setStatus('error');
      setError('An unexpected error occurred');
    }
  };

  // Simulate GitHub API response (replace with real implementation)
  const simulateGitHubAPI = async (code: string) => {
    // In production, this would be a server-side API call
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    // Mock successful response
    return {
      user: {
        id: Date.now() + Math.floor(Math.random() * 1000),
        login: 'demo-github-user',
        name: 'GitHub Demo User',
        email: 'demo@github.example',
        avatar_url: 'https://github.com/github.png'
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-8 text-center">
        
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Signing you in...
            </h2>
            <p className="text-gray-400">
              Connecting your GitHub account and creating your wallet
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to AgentCards!
            </h2>
            <p className="text-gray-400 mb-6">
              Your account has been created successfully. You now have your own secure wallet.
            </p>
            <div className="text-sm text-green-400">
              Redirecting to home page...
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Sign In Failed
            </h2>
            <p className="text-gray-400 mb-6">
              {error}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all"
            >
              Return Home
            </button>
          </>
        )}

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-sm text-blue-400">
            <strong>🔐 Secure:</strong> Your wallet is encrypted and stored safely. We never have access to your private keys.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <GitHubCallbackContent />
    </Suspense>
  );
}