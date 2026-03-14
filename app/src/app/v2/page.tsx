'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function V2Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect v2 to main AgentCards page
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Welcome to AgentCards</h1>
        <p className="text-gray-400">The new NFT trading card platform for AI agents</p>
      </div>
    </div>
  );
}