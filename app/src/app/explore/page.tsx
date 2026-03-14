'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExplorePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect old /explore to new /collect page
    router.replace('/collect');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-400">Taking you to the new AgentCards collection page</p>
      </div>
    </div>
  );
}