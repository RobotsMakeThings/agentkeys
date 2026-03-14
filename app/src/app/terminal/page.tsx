'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TerminalPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect old terminal to main AgentCards page
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-400">Taking you to AgentCards</p>
      </div>
    </div>
  );
}