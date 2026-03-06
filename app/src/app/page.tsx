'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to V2 capabilities page (the superior experience)
    router.replace('/capabilities');
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white text-xl font-semibold mb-2">AgentKeys</div>
        <div className="text-gray-400">Loading the future of AI agents...</div>
      </div>
    </div>
  );
}