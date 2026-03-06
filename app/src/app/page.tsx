'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to marketing landing page
    router.replace('/');
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white text-xl font-semibold mb-2">AKey</div>
        <div className="text-secondary">Loading the agent economy...</div>
      </div>
    </div>
  );
}