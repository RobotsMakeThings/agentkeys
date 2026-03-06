'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function VersionToggle() {
  const pathname = usePathname();
  const isV2 = pathname.startsWith('/v2');

  return (
    <div className="fixed bottom-4 right-4 z-50 no-print">
      <div className="glass-strong p-4 rounded-xl border border-medium shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-5 h-5 text-blue" />
          <span className="text-small font-medium text-primary">
            UI Version
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-small font-medium transition-all ${
              !isV2
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'text-secondary hover:text-primary hover:bg-card'
            }`}
          >
            V1
          </Link>
          
          <Link
            href="/capabilities"
            className="px-3 py-1.5 rounded-lg text-small font-medium transition-all flex items-center gap-1 bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg hover:opacity-90"
          >
            Capability
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        
        {isV2 && (
          <div className="mt-2 text-xs text-muted">
            New Design Preview
          </div>
        )}
      </div>
    </div>
  );
}